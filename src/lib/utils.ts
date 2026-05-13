export function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

export function escapeHtml(text: string) {
  const div = document?.createElement?.('div') ?? { textContent: '' };
  div.textContent = text;
  return div.innerHTML ?? text;
}

export function formatDate(date: Date | string) {
  const d = new Date(date);
  return d.toLocaleDateString('zh-HK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatPriceHKD(amount: number) {
  return `HK$${amount}`;
}

export const IMAGE_CONFIG = {
  maxSizeMB: 8,
  acceptedTypes: ['image/jpeg', 'image/png'],
  maxSizeBytes: 8 * 1024 * 1024,
};
