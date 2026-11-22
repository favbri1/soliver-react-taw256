// CAPTCHA de texto distorsionado, generado en el navegador (simulado).
// ⚠️ Un CAPTCHA validado en el cliente NO es seguro: un bot puede saltárselo.
// En producción debe generarse y validarse en el backend, o usar un servicio
// como reCAPTCHA / hCaptcha / Cloudflare Turnstile.

// Sin caracteres ambiguos (0/O, 1/I/L).
const CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
const COLORS = ['#0B0B0B', '#A30D1D', '#8A6A1F', '#1F2937', '#7C2D12']

export interface CaptchaGlyph {
  ch: string
  x: number
  y: number
  rotate: number
  size: number
  color: string
}
export interface CaptchaChallenge {
  code: string
  width: number
  height: number
  glyphs: CaptchaGlyph[]
  lines: { x1: number; y1: number; x2: number; y2: number; color: string }[]
  dots: { x: number; y: number }[]
}

const rand = (min: number, max: number) => min + Math.random() * (max - min)
const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)]

export function generateCaptcha(length = 5): CaptchaChallenge {
  const width = 170
  const height = 52
  let code = ''
  for (let i = 0; i < length; i++) code += CHARS[Math.floor(Math.random() * CHARS.length)]
  const slot = (width - 20) / length
  const glyphs: CaptchaGlyph[] = code.split('').map((ch, i) => ({
    ch,
    x: 14 + slot * i + rand(-2, 4),
    y: rand(32, 40),
    rotate: rand(-22, 22),
    size: rand(24, 30),
    color: pick(COLORS),
  }))
  const lines = Array.from({ length: 4 }, () => ({
    x1: rand(0, width / 3),
    y1: rand(4, height - 4),
    x2: rand((width * 2) / 3, width),
    y2: rand(4, height - 4),
    color: pick(COLORS),
  }))
  const dots = Array.from({ length: 28 }, () => ({ x: rand(0, width), y: rand(0, height) }))
  return { code, width, height, glyphs, lines, dots }
}

/** No distingue mayúsculas/minúsculas ni espacios. */
export function checkCaptcha(challenge: CaptchaChallenge, input: string): boolean {
  return input.replace(/\s/g, '').toUpperCase() === challenge.code
}
