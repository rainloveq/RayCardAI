const FESTIVAL_BORDER_COLORS: Record<string, string> = {
  birthday: '#FFB347',
  christmas: '#C41E3A',
  lunarnewyear: '#DC143C',
  newyear: '#FFD700',
  valentine: '#FF69B4',
};

const BRAND_BAR_HEIGHT = 44;
const QR_SIZE = 76;
const BORDER_WIDTH = 6;
const OUTPUT_WIDTH = 1080;

function drawQRCode(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  const modules = 21;
  const moduleSize = size / modules;
  const qr = generateQRData();
  ctx.fillStyle = '#000';
  for (let row = 0; row < modules; row++) {
    for (let col = 0; col < modules; col++) {
      if (qr[row * modules + col]) {
        ctx.fillRect(x + col * moduleSize, y + row * moduleSize, moduleSize, moduleSize);
      }
    }
  }
  // White center square
  ctx.fillStyle = '#fff';
  ctx.fillRect(x + moduleSize * 8, y + moduleSize * 8, moduleSize * 5, moduleSize * 5);
}

function generateQRData(): number[] {
  // Simple deterministic QR-like pattern (not a real QR code, but visually resembles one)
  const data = new Array(441).fill(0);
  for (let i = 0; i < 441; i++) {
    const row = Math.floor(i / 21);
    const col = i % 21;
    // Top-left finder pattern
    if (row < 7 && col < 7) data[i] = 1;
    // Top-right finder pattern
    if (row < 7 && col > 13) data[i] = 1;
    // Bottom-left finder pattern
    if (row > 13 && col < 7) data[i] = 1;
    // Center pattern
    if ((row + col) % 3 === 0 && row > 7 && row < 14 && col > 7 && col < 14) data[i] = 1;
  }
  return data;
}

export async function generateShareImage(
  sourceImageUrl: string,
  festival: string,
  greetingText: string
): Promise<Blob> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  // Load source image
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.crossOrigin = 'anonymous';
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = sourceImageUrl;
  });

  // Scale to 1080px wide, maintain aspect ratio
  const scale = OUTPUT_WIDTH / img.width;
  const imgHeight = Math.round(img.height * scale);
  const totalHeight = imgHeight + BRAND_BAR_HEIGHT;
  const borderColor = FESTIVAL_BORDER_COLORS[festival] || '#FFFFFF';

  canvas.width = OUTPUT_WIDTH + BORDER_WIDTH * 2;
  canvas.height = totalHeight + BORDER_WIDTH * 2;

  // Fill border
  ctx.fillStyle = borderColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Fill inner area (white background for the card area)
  ctx.fillStyle = '#fff';
  ctx.fillRect(BORDER_WIDTH, BORDER_WIDTH, OUTPUT_WIDTH, totalHeight);

  // Draw source image
  ctx.drawImage(img, BORDER_WIDTH, BORDER_WIDTH, OUTPUT_WIDTH, imgHeight);

  // Draw brand bar at bottom
  const barY = totalHeight + BORDER_WIDTH - BRAND_BAR_HEIGHT;
  ctx.fillStyle = '#0A0B1A';
  ctx.fillRect(BORDER_WIDTH, barY, OUTPUT_WIDTH, BRAND_BAR_HEIGHT);

  // Draw brand text on bar
  ctx.fillStyle = '#F1F5F9';
  ctx.font = '600 18px Inter, "Noto Sans TC", sans-serif';
  ctx.fillText('✨ RayCardAI · 製作你的專屬賀卡', BORDER_WIDTH + 16, barY + 30);

  // Draw QR code on right side of bar
  const qrX = canvas.width - BORDER_WIDTH - QR_SIZE - 16;
  const qrY = barY + (BRAND_BAR_HEIGHT - QR_SIZE) / 2;
  drawQRCode(ctx, qrX, qrY, QR_SIZE);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), 'image/png');
  });
}
