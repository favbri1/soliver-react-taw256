import { PdfDocument, type RGB } from './pdf'
import type { AlertItem, DashboardMetric, InventoryDistribution, MonthlyPoint } from '@/types'

// Construye el reporte de gestión en PDF a partir de los datos del dashboard.
// Se genera 100% en el navegador (sin librerías). Con backend, el mismo reporte
// podrá generarse en el servidor (GET /reports/pdf) y esta función quedaría como
// alternativa de respaldo.

export interface ReportData {
  metrics: DashboardMetric[]
  distribution: InventoryDistribution[]
  alerts: AlertItem[]
  reservationsByMonth: MonthlyPoint[]
  revenueByMonth: MonthlyPoint[]
  topCostumes: MonthlyPoint[]
}

export interface ReportMeta {
  scenarioLabel: string
  generatedBy: string
  generatedAt: Date
}

const INK: RGB = [11, 11, 11]
const GOLD: RGB = [212, 166, 74]
const WINE: RGB = [163, 13, 29]
const GRAY: RGB = [107, 114, 128]
const LIGHT: RGB = [243, 244, 246]
const LINE: RGB = [229, 231, 235]
const WHITE: RGB = [255, 255, 255]

const MARGIN = 40
const BOTTOM = 790 // límite inferior del contenido (el pie de página va más abajo)

const STATUS_LABELS: Record<string, string> = {
  Limpieza: 'En limpieza',
  Reparacion: 'En reparación',
  Danado: 'Dañado',
}

const fmt = (v: number) => v.toLocaleString('es-BO')

function metricText(m: DashboardMetric): string {
  return `${m.prefix ?? ''}${fmt(m.value)}${m.suffix ?? ''}`
}

/** Redondea hacia arriba a un valor "bonito" (1, 2, 5 × 10^k) para el eje Y. */
function niceMax(v: number): number {
  if (v <= 0) return 1
  const pow = Math.pow(10, Math.floor(Math.log10(v)))
  const f = v / pow
  const nice = f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10
  return nice * pow
}

function wrap(doc: PdfDocument, text: string, maxWidth: number, size: number): string[] {
  const words = text.split(/\s+/)
  const lines: string[] = []
  let cur = ''
  for (const w of words) {
    const test = cur ? `${cur} ${w}` : w
    if (doc.textWidth(test, size) <= maxWidth || !cur) cur = test
    else {
      lines.push(cur)
      cur = w
    }
  }
  if (cur) lines.push(cur)
  return lines
}

export function buildReportPdf(data: ReportData, meta: ReportMeta): Uint8Array {
  const doc = new PdfDocument({
    title: 'Reporte de gestión - SOLIVER',
    author: meta.generatedBy,
    subject: `Escenario: ${meta.scenarioLabel}`,
  })
  const contentW = doc.width - MARGIN * 2
  let y = 0

  const dateStr = meta.generatedAt.toLocaleDateString('es-BO', { day: '2-digit', month: 'long', year: 'numeric' })
  const timeStr = meta.generatedAt.toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' })

  function ensureSpace(h: number) {
    if (y + h > BOTTOM) {
      doc.addPage()
      y = MARGIN
    }
  }

  function sectionTitle(title: string, subtitle?: string) {
    ensureSpace(subtitle ? 48 : 34)
    doc.rect(MARGIN, y, 3, subtitle ? 24 : 14, { fill: GOLD })
    doc.text(title, MARGIN + 10, y + 11, { size: 13, bold: true, color: INK })
    if (subtitle) doc.text(subtitle, MARGIN + 10, y + 23, { size: 8.5, color: GRAY })
    y += subtitle ? 38 : 26
  }

  // ---------- Encabezado ----------
  doc.rect(0, 0, doc.width, 78, { fill: INK })
  doc.rect(0, 78, doc.width, 3, { fill: GOLD })
  doc.text('SOLIVER', MARGIN, 38, { size: 24, bold: true, color: GOLD })
  doc.text('ALQUILER Y VENTA DE TRAJES DE CAPORAL', MARGIN, 54, { size: 8, color: [200, 200, 200] })
  doc.text('Reporte de gestión', doc.width - MARGIN, 38, { size: 16, bold: true, color: WHITE, align: 'right' })
  doc.text(`${dateStr} · ${timeStr}`, doc.width - MARGIN, 54, { size: 8.5, color: [200, 200, 200], align: 'right' })
  y = 98

  doc.text(`Escenario: `, MARGIN, y, { size: 9, color: GRAY })
  doc.text(meta.scenarioLabel, MARGIN + doc.textWidth('Escenario: ', 9), y, { size: 9, bold: true, color: INK })
  doc.text(`Generado por: `, doc.width / 2, y, { size: 9, color: GRAY })
  doc.text(meta.generatedBy, doc.width / 2 + doc.textWidth('Generado por: ', 9), y, { size: 9, bold: true, color: INK })
  y += 22

  // ---------- Indicadores clave ----------
  sectionTitle('Indicadores clave', 'Resumen del período según el escenario seleccionado')
  const cols = 3
  const gap = 12
  const boxW = (contentW - gap * (cols - 1)) / cols
  const boxH = 54
  const rows = Math.ceil(data.metrics.length / cols)
  ensureSpace(rows * (boxH + gap))
  data.metrics.forEach((m, i) => {
    const bx = MARGIN + (i % cols) * (boxW + gap)
    const by = y + Math.floor(i / cols) * (boxH + gap)
    doc.rect(bx, by, boxW, boxH, { fill: LIGHT })
    doc.rect(bx, by, 3, boxH, { fill: i === data.metrics.length - 1 ? GOLD : INK })
    doc.text(doc.fit(m.label.toUpperCase(), boxW - 20, 7.5, true), bx + 12, by + 16, { size: 7.5, bold: true, color: GRAY })
    doc.text(metricText(m), bx + 12, by + 40, { size: 20, bold: true, color: INK })
  })
  y += rows * (boxH + gap) + 8

  // ---------- Gráfico de barras verticales ----------
  function barChart(title: string, subtitle: string, points: MonthlyPoint[], color: RGB, money: boolean) {
    const chartH = 120
    ensureSpace(chartH + 80)
    sectionTitle(title, subtitle)
    const left = MARGIN + 38
    const width = contentW - 38
    const top = y + 6
    const max = niceMax(Math.max(...points.map((p) => p.value), 1))
    const steps = 4
    for (let s = 0; s <= steps; s++) {
      const gy = top + chartH - (chartH * s) / steps
      doc.line(left, gy, left + width, gy, { color: LINE, width: 0.5 })
      const v = (max * s) / steps
      doc.text(fmt(v), left - 6, gy + 3, { size: 7, color: GRAY, align: 'right' })
    }
    const slot = width / points.length
    const barW = Math.min(36, slot * 0.55)
    points.forEach((p, i) => {
      const bh = (chartH * p.value) / max
      const bx = left + slot * i + (slot - barW) / 2
      doc.rect(bx, top + chartH - bh, barW, bh, { fill: color })
      doc.text(money ? `Bs. ${fmt(p.value)}` : fmt(p.value), bx + barW / 2, top + chartH - bh - 4, {
        size: 7.5,
        bold: true,
        color: INK,
        align: 'center',
      })
      doc.text(p.label, bx + barW / 2, top + chartH + 13, { size: 8, color: GRAY, align: 'center' })
    })
    y = top + chartH + 30
  }

  barChart('Ingresos mensuales', 'Evolución en bolivianos (Bs.)', data.revenueByMonth, GOLD, true)
  barChart('Reservas por mes', 'Últimos 6 meses', data.reservationsByMonth, INK, false)

  // ---------- Barras horizontales: trajes más alquilados ----------
  {
    const sorted = [...data.topCostumes].sort((a, b) => b.value - a.value)
    ensureSpace(sorted.length * 24 + 60)
    sectionTitle('Trajes más alquilados', 'Acumulado histórico, ordenado de mayor a menor')
    const labelW = 190
    const barMax = contentW - labelW - 40
    const max = Math.max(...sorted.map((p) => p.value), 1)
    sorted.forEach((p) => {
      doc.text(doc.fit(p.label, labelW - 8, 9), MARGIN, y + 10, { size: 9, color: INK })
      const bw = (barMax * p.value) / max
      doc.rect(MARGIN + labelW, y + 1, barMax, 12, { fill: LIGHT })
      doc.rect(MARGIN + labelW, y + 1, bw, 12, { fill: WINE })
      doc.text(fmt(p.value), MARGIN + labelW + barMax + 8, y + 10, { size: 9, bold: true, color: INK })
      y += 24
    })
    y += 10
  }

  // ---------- Estado del inventario ----------
  {
    ensureSpace(data.distribution.length * 22 + 70)
    sectionTitle('Estado del inventario', 'Distribución actual de trajes')
    const total = data.distribution.reduce((acc, d) => acc + d.count, 0) || 1
    doc.rect(MARGIN, y, contentW, 20, { fill: INK })
    doc.text('ESTADO', MARGIN + 10, y + 13, { size: 8, bold: true, color: WHITE })
    doc.text('CANTIDAD', MARGIN + 270, y + 13, { size: 8, bold: true, color: WHITE, align: 'right' })
    doc.text('PORCENTAJE', MARGIN + contentW - 10, y + 13, { size: 8, bold: true, color: WHITE, align: 'right' })
    y += 20
    data.distribution.forEach((d, i) => {
      if (i % 2 === 1) doc.rect(MARGIN, y, contentW, 22, { fill: LIGHT })
      const pct = Math.round((d.count / total) * 100)
      doc.text(STATUS_LABELS[d.status] ?? d.status, MARGIN + 10, y + 15, { size: 9.5, color: INK })
      doc.text(String(d.count), MARGIN + 270, y + 15, { size: 9.5, bold: true, color: INK, align: 'right' })
      doc.rect(MARGIN + 300, y + 7, 130, 8, { fill: LINE })
      doc.rect(MARGIN + 300, y + 7, (130 * pct) / 100, 8, { fill: GOLD })
      doc.text(`${pct}%`, MARGIN + contentW - 10, y + 15, { size: 9.5, color: INK, align: 'right' })
      y += 22
    })
    doc.line(MARGIN, y, MARGIN + contentW, y, { color: INK, width: 0.8 })
    y += 20
  }

  // ---------- Observaciones ----------
  if (data.alerts.length > 0) {
    sectionTitle('Observaciones y alertas', 'Puntos de atención detectados en el período')
    data.alerts.forEach((a) => {
      const lines = wrap(doc, a.message, contentW - 28, 8.5)
      const h = 18 + lines.length * 11 + 8
      ensureSpace(h)
      const tone: RGB = a.type === 'warning' ? WINE : a.type === 'success' ? [22, 130, 80] : GRAY
      doc.rect(MARGIN, y, 3, h - 6, { fill: tone })
      doc.text(doc.fit(a.title, contentW - 28, 10, true), MARGIN + 12, y + 11, { size: 10, bold: true, color: INK })
      lines.forEach((l, i) => doc.text(l, MARGIN + 12, y + 25 + i * 11, { size: 8.5, color: GRAY }))
      y += h
    })
  }

  // ---------- Pie de página en todas las páginas ----------
  const total = doc.pageCount
  for (let i = 0; i < total; i++) {
    doc.setPage(i)
    doc.line(MARGIN, 812, doc.width - MARGIN, 812, { color: LINE, width: 0.5 })
    doc.text('SOLIVER · Alquiler y Venta de Trajes de Caporal', MARGIN, 826, { size: 8, color: GRAY })
    doc.text(`Página ${i + 1} de ${total}`, doc.width - MARGIN, 826, { size: 8, color: GRAY, align: 'right' })
  }

  return doc.build()
}

export function reportFileName(date: Date = new Date()): string {
  const p = (v: number) => String(v).padStart(2, '0')
  return `reporte-soliver-${date.getFullYear()}${p(date.getMonth() + 1)}${p(date.getDate())}.pdf`
}
