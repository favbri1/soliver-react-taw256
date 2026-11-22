// Generador de PDF mínimo, SIN dependencias externas.
// Soporta texto (Helvetica / Helvetica-Bold), rectángulos y líneas, y varias páginas.
// Suficiente para reportes con tablas y gráficos de barras dibujados con vectores.
//
// Coordenadas: origen arriba-izquierda, en puntos (A4 = 595 x 842). La conversión
// al sistema de PDF (origen abajo-izquierda) se hace internamente.

export type RGB = [number, number, number] // cada canal de 0 a 255

const PAGE_W = 595
const PAGE_H = 842

// Anchos de glifo (unidades de 1/1000 em) de Helvetica, caracteres ASCII 32..126.
const W_REGULAR = [
  278, 278, 355, 556, 556, 889, 667, 191, 333, 333, 389, 584, 278, 333, 278, 278, 556, 556, 556, 556, 556, 556, 556,
  556, 556, 556, 278, 278, 584, 584, 584, 556, 1015, 667, 667, 722, 722, 667, 611, 778, 722, 278, 500, 667, 556, 833,
  722, 778, 667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611, 278, 278, 278, 469, 556, 333, 556, 556, 500, 556,
  556, 278, 556, 556, 222, 222, 500, 222, 833, 556, 556, 556, 556, 333, 500, 278, 556, 500, 722, 500, 500, 500, 334,
  260, 334, 584,
]
const W_BOLD = [
  278, 333, 474, 556, 556, 889, 722, 238, 333, 333, 389, 584, 278, 333, 278, 278, 556, 556, 556, 556, 556, 556, 556,
  556, 556, 556, 333, 333, 584, 584, 584, 611, 975, 722, 722, 722, 722, 667, 611, 778, 722, 278, 556, 722, 611, 833,
  722, 778, 667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611, 333, 278, 333, 584, 556, 333, 556, 611, 556, 611,
  556, 333, 611, 611, 278, 278, 556, 278, 889, 611, 611, 611, 611, 389, 556, 333, 611, 556, 778, 556, 556, 500, 389,
  280, 389, 584,
]

// Caracteres fuera de ASCII que podemos escribir en la codificación WinAnsi.
const WIN_ANSI_EXTRA: Record<string, number> = {
  '€': 0x80,
  '…': 0x85,
  '‘': 0x91,
  '’': 0x92,
  '“': 0x93,
  '”': 0x94,
  '•': 0x95,
  '–': 0x96,
  '—': 0x97,
}
const EXTRA_WIDTH: Record<string, [number, number]> = {
  '¿': [611, 611],
  '¡': [333, 333],
  '…': [1000, 1000],
  '•': [350, 350],
  '–': [556, 556],
  '—': [1000, 1000],
  '‘': [222, 278],
  '’': [222, 278],
  '“': [333, 500],
  '”': [333, 500],
  '€': [556, 556],
}

/** Convierte un texto a bytes WinAnsi (cada char del resultado = 1 byte). */
function toWinAnsi(text: string): string {
  let out = ''
  for (const ch of text) {
    const code = ch.codePointAt(0)!
    if (code >= 32 && code <= 126) out += ch
    else if (code >= 160 && code <= 255) out += String.fromCharCode(code) // Latin-1 = WinAnsi en A0-FF
    else if (WIN_ANSI_EXTRA[ch] !== undefined) out += String.fromCharCode(WIN_ANSI_EXTRA[ch])
    else if (ch === '\t') out += ' '
    else out += '?'
  }
  return out
}

function glyphWidth(ch: string, bold: boolean): number {
  const code = ch.charCodeAt(0)
  if (code >= 32 && code <= 126) return (bold ? W_BOLD : W_REGULAR)[code - 32]
  if (EXTRA_WIDTH[ch]) return EXTRA_WIDTH[ch][bold ? 1 : 0]
  // Letras con tilde: mismo ancho que la letra base (á → a, ñ → n, Ü → U…)
  const base = ch.normalize('NFD').charAt(0)
  const bc = base.charCodeAt(0)
  if (bc >= 32 && bc <= 126) return (bold ? W_BOLD : W_REGULAR)[bc - 32]
  return 556
}

function escapePdf(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')
}

const n = (x: number) => (Math.round(x * 100) / 100).toString()
const rgb = (c: RGB) => `${n(c[0] / 255)} ${n(c[1] / 255)} ${n(c[2] / 255)}`

export interface TextOptions {
  size?: number
  bold?: boolean
  color?: RGB
  align?: 'left' | 'center' | 'right'
}

export class PdfDocument {
  readonly width = PAGE_W
  readonly height = PAGE_H
  private pages: string[][] = []
  private current = -1
  private info: { title: string; author: string; subject: string }

  constructor(info: { title?: string; author?: string; subject?: string } = {}) {
    this.info = { title: info.title ?? '', author: info.author ?? '', subject: info.subject ?? '' }
    this.addPage()
  }

  get pageCount(): number {
    return this.pages.length
  }

  addPage(): void {
    this.pages.push([])
    this.current = this.pages.length - 1
  }

  /** Cambia la página sobre la que se dibuja (0-based). Útil para pies de página. */
  setPage(index: number): void {
    this.current = index
  }

  private emit(op: string): void {
    this.pages[this.current].push(op)
  }

  textWidth(text: string, size = 10, bold = false): number {
    let w = 0
    for (const ch of text) w += glyphWidth(ch, bold)
    return (w * size) / 1000
  }

  /** Recorta el texto con "…" para que quepa en `maxWidth`. */
  fit(text: string, maxWidth: number, size = 10, bold = false): string {
    if (this.textWidth(text, size, bold) <= maxWidth) return text
    let t = text
    while (t.length > 1 && this.textWidth(t + '…', size, bold) > maxWidth) t = t.slice(0, -1)
    return t.trimEnd() + '…'
  }

  /** Escribe texto con la línea base en (x, y). */
  text(text: string, x: number, y: number, opts: TextOptions = {}): void {
    const size = opts.size ?? 10
    const bold = opts.bold ?? false
    const color = opts.color ?? [0, 0, 0]
    let px = x
    if (opts.align === 'right') px = x - this.textWidth(text, size, bold)
    else if (opts.align === 'center') px = x - this.textWidth(text, size, bold) / 2
    this.emit(
      `BT /${bold ? 'F2' : 'F1'} ${n(size)} Tf ${rgb(color)} rg ${n(px)} ${n(PAGE_H - y)} Td (${escapePdf(
        toWinAnsi(text),
      )}) Tj ET`,
    )
  }

  rect(x: number, y: number, w: number, h: number, opts: { fill?: RGB; stroke?: RGB; lineWidth?: number } = {}): void {
    const parts: string[] = ['q']
    if (opts.fill) parts.push(`${rgb(opts.fill)} rg`)
    if (opts.stroke) parts.push(`${rgb(opts.stroke)} RG ${n(opts.lineWidth ?? 0.5)} w`)
    parts.push(`${n(x)} ${n(PAGE_H - y - h)} ${n(w)} ${n(h)} re`)
    parts.push(opts.fill && opts.stroke ? 'B' : opts.fill ? 'f' : 'S')
    parts.push('Q')
    this.emit(parts.join(' '))
  }

  line(x1: number, y1: number, x2: number, y2: number, opts: { color?: RGB; width?: number } = {}): void {
    this.emit(
      `q ${rgb(opts.color ?? [0, 0, 0])} RG ${n(opts.width ?? 0.5)} w ${n(x1)} ${n(PAGE_H - y1)} m ${n(x2)} ${n(
        PAGE_H - y2,
      )} l S Q`,
    )
  }

  /** Genera el archivo PDF completo. */
  build(): Uint8Array {
    // Objetos: 1 Catalog, 2 Pages, 3 F1, 4 F2, 5 Info, luego (Page, Content) por página.
    const objects: string[] = []
    const pageObjIds = this.pages.map((_, i) => 6 + i * 2)

    objects[1] = '<< /Type /Catalog /Pages 2 0 R >>'
    objects[2] = `<< /Type /Pages /Kids [${pageObjIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${this.pages.length} >>`
    objects[3] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>'
    objects[4] = '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>'
    const d = new Date()
    const pad = (v: number) => String(v).padStart(2, '0')
    const stamp = `D:${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(d.getHours())}${pad(
      d.getMinutes(),
    )}${pad(d.getSeconds())}`
    objects[5] = `<< /Title (${escapePdf(toWinAnsi(this.info.title))}) /Author (${escapePdf(
      toWinAnsi(this.info.author),
    )}) /Subject (${escapePdf(toWinAnsi(this.info.subject))}) /Creator (SOLIVER) /Producer (SOLIVER PdfDocument) /CreationDate (${stamp}) >>`

    this.pages.forEach((ops, i) => {
      const pageId = 6 + i * 2
      const contentId = pageId + 1
      const stream = ops.join('\n')
      objects[pageId] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentId} 0 R >>`
      objects[contentId] = `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`
    })

    // Cada char del string = 1 byte (todo es ASCII o WinAnsi), así los offsets son exactos.
    let out = '%PDF-1.4\n%\u00e2\u00e3\u00cf\u00d3\n'
    const offsets: number[] = []
    for (let id = 1; id < objects.length; id++) {
      offsets[id] = out.length
      out += `${id} 0 obj\n${objects[id]}\nendobj\n`
    }
    const xrefPos = out.length
    out += `xref\n0 ${objects.length}\n0000000000 65535 f \n`
    for (let id = 1; id < objects.length; id++) {
      out += `${String(offsets[id]).padStart(10, '0')} 00000 n \n`
    }
    out += `trailer\n<< /Size ${objects.length} /Root 1 0 R /Info 5 0 R >>\nstartxref\n${xrefPos}\n%%EOF\n`

    const bytes = new Uint8Array(out.length)
    for (let i = 0; i < out.length; i++) bytes[i] = out.charCodeAt(i) & 0xff
    return bytes
  }
}

/** Descarga un archivo generado en el navegador. */
export function downloadBytes(bytes: Uint8Array, filename: string, mime = 'application/pdf'): void {
  const blob = new Blob([bytes as BlobPart], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
