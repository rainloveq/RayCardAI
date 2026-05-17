export type EffectType = 'sparkle' | 'confetti' | 'heart' | 'firework' | 'snow' | 'petal';

export const EFFECT_LABELS: Record<EffectType, string> = {
  sparkle: '✨ 星光',
  confetti: '🎊 彩帶',
  heart: '💕 愛心',
  firework: '🎆 煙花',
  snow: '❄️ 雪花',
  petal: '🌸 花瓣',
};

const FESTIVAL_EFFECT_MAP: Record<string, EffectType> = {
  birthday: 'confetti',
  christmas: 'snow',
  lunarnewyear: 'firework',
  newyear: 'firework',
  valentine: 'heart',
};

export function getEffectForFestival(festivalId: string): EffectType {
  return FESTIVAL_EFFECT_MAP[festivalId] || 'sparkle';
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  decay: number;
  rotation: number;
  rotationSpeed: number;
}

const EFFECT_PALETTES: Record<EffectType, string[]> = {
  sparkle: ['#FFD700', '#FFF8DC', '#F0E68C', '#FFE4B5', '#FFFFFF'],
  confetti: ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF', '#FF8FB1', '#C084FC'],
  heart: ['#FF69B4', '#FF1493', '#FFB6C1', '#DB7093', '#FFC0CB'],
  firework: ['#FF4500', '#FFD700', '#00CED1', '#FF1493', '#7FFF00', '#FF6347'],
  snow: ['#FFFFFF', '#F0F8FF', '#E6E6FA', '#F5F5F5', '#FFF0F5'],
  petal: ['#FFB7C5', '#FFC0CB', '#FF69B4', '#FF91A4', '#FFAEB9'],
};

export function createParticleSystem(
  canvas: HTMLCanvasElement,
  imageUrl: string,
  effect: EffectType,
  durationSeconds: number
) {
  const ctx = canvas.getContext('2d')!;
  let particles: Particle[] = [];
  let animationId: number | null = null;
  let startTime = 0;
  let image: HTMLImageElement | null = null;
  let running = false;

  const colors = EFFECT_PALETTES[effect] || EFFECT_PALETTES.sparkle;

  function spawnParticle(): Particle {
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.5 + Math.random() * 2.5;

    let particle: Particle = {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * 0.6,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1,
      size: 2 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: 0.7 + Math.random() * 0.3,
      decay: 0.003 + Math.random() * 0.012,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.1,
    };

    // Effect-specific overrides
    switch (effect) {
      case 'heart': {
        const t = Math.random() * Math.PI * 2;
        const r = 3 + Math.random() * 4;
        particle.x = canvas.width / 2 + 16 * Math.pow(Math.sin(t), 3) * 3;
        particle.y = canvas.height * 0.35 + (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * 2;
        particle.vx = (Math.random() - 0.5) * 0.8;
        particle.vy = -1 - Math.random() * 2;
        particle.size = 6 + Math.random() * 10;
        break;
      }
      case 'firework':
        particle.x = canvas.width / 2 + (Math.random() - 0.5) * canvas.width * 0.4;
        particle.y = canvas.height * 0.35 + (Math.random() - 0.5) * canvas.height * 0.3;
        particle.vx = (Math.random() - 0.5) * 6;
        particle.vy = (Math.random() - 0.5) * 6;
        particle.size = 1.5 + Math.random() * 3;
        particle.decay = 0.02 + Math.random() * 0.03;
        break;
      case 'snow':
        particle.x = Math.random() * canvas.width;
        particle.y = -10 - Math.random() * canvas.height;
        particle.vx = (Math.random() - 0.5) * 0.5;
        particle.vy = 0.5 + Math.random() * 1.5;
        particle.size = 3 + Math.random() * 5;
        particle.decay = 0;
        particle.opacity = 0.6 + Math.random() * 0.4;
        break;
      case 'petal':
        particle.x = Math.random() * canvas.width;
        particle.y = -10 - Math.random() * 50;
        particle.vx = (Math.random() - 0.5) * 1;
        particle.vy = 0.5 + Math.random() * 1.2;
        particle.size = 4 + Math.random() * 8;
        particle.rotationSpeed = (Math.random() - 0.5) * 0.08;
        particle.decay = 0;
        break;
    }

    return particle;
  }

  function animate(timestamp: number) {
    if (!running) return;
    if (!startTime) startTime = timestamp;

    const elapsed = (timestamp - startTime) / 1000;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background image
    if (image) {
      // Scale image to fill canvas
      const imgAspect = image.width / image.height;
      const canvasAspect = canvas.width / canvas.height;
      let dw = canvas.width;
      let dh = canvas.height;
      let dx = 0;
      let dy = 0;
      if (imgAspect > canvasAspect) {
        dh = canvas.width / imgAspect;
        dy = (canvas.height - dh) / 2;
      } else {
        dw = canvas.height * imgAspect;
        dx = (canvas.width - dw) / 2;
      }
      ctx.drawImage(image, dx, dy, dw, dh);
    }

    // Spawn new particles while within duration
    if (elapsed < durationSeconds) {
      const spawnRate = effect === 'firework' ? 8 : effect === 'heart' ? 5 : effect === 'snow' ? 2 : 3;
      for (let i = 0; i < spawnRate; i++) {
        particles.push(spawnParticle());
      }
    }

    // Update and draw particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.opacity -= p.decay;
      p.rotation += p.rotationSpeed;

      if (p.opacity <= 0) {
        // Reset snow/petal particles that go off screen
        if ((effect === 'snow' || effect === 'petal') && p.y > canvas.height + 10) {
          p.y = -10;
          p.x = Math.random() * canvas.width;
          p.opacity = 0.6 + Math.random() * 0.4;
        } else {
          particles.splice(i, 1);
        }
        continue;
      }

      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);

      switch (effect) {
        case 'heart':
          drawHeart(ctx, p.size, p.color);
          break;
        case 'sparkle':
          drawSparkle(ctx, p.size, p.color);
          break;
        case 'firework':
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
          // Glow effect
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = p.color + '33';
          ctx.fill();
          break;
        case 'snow':
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
          break;
        case 'petal':
          drawPetal(ctx, p.size, p.color);
          break;
        case 'confetti':
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
          break;
        default:
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
      }

      ctx.restore();
    }

    // Remove particles only if we're past the duration and all particles faded
    if (elapsed >= durationSeconds + 2 && particles.length === 0) {
      stop();
      return;
    }

    animationId = requestAnimationFrame(animate);
  }

  function drawHeart(ctx: CanvasRenderingContext2D, size: number, color: string) {
    const s = size / 16;
    ctx.beginPath();
    ctx.moveTo(0, s * 4);
    ctx.bezierCurveTo(-s * 8, -s * 2, -s * 8, -s * 10, 0, -s * 10);
    ctx.bezierCurveTo(s * 8, -s * 10, s * 8, -s * 2, 0, s * 4);
    ctx.fillStyle = color;
    ctx.fill();
  }

  function drawSparkle(ctx: CanvasRenderingContext2D, size: number, color: string) {
    const s = size;
    ctx.beginPath();
    ctx.moveTo(0, -s);
    for (let i = 0; i < 4; i++) {
      ctx.lineTo(s * 0.3, -s * 0.3);
      ctx.lineTo(s, 0);
      ctx.lineTo(s * 0.3, s * 0.3);
      ctx.rotate(Math.PI / 2);
      ctx.lineTo(0, -s);
    }
    ctx.fillStyle = color;
    ctx.fill();
    // Center glow
    ctx.beginPath();
    ctx.arc(0, 0, s * 0.4, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
  }

  function drawPetal(ctx: CanvasRenderingContext2D, size: number, color: string) {
    const w = size * 0.6;
    const h = size;
    ctx.beginPath();
    ctx.ellipse(0, 0, w, h, 0, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }

  function start() {
    running = true;
    startTime = 0;
    particles = [];

    if (!image) {
      const img = new Image();
      img.onload = () => {
        image = img;
        animationId = requestAnimationFrame(animate);
      };
      img.onerror = () => {
        // Draw placeholder text on canvas
        ctx.fillStyle = '#1E1B4B';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#A5B4FC';
        ctx.font = '16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('圖片載入失敗', canvas.width / 2, canvas.height / 2);
      };
      img.src = imageUrl;
    } else {
      animationId = requestAnimationFrame(animate);
    }
  }

  function stop() {
    running = false;
    if (animationId !== null) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }

  return { start, stop };
}
