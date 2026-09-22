import type { ReactNode } from 'react'

export interface ColumnDef<T> {
  key: string
  label: string
  align?: 'left' | 'right' | 'center'
  cell?: (row: T) => ReactNode
}

interface Props<T> {
  columns: ColumnDef<T>[]
  rows: T[]
  rowKey: (row: T) => string
}

function alignClass(align?: 'left' | 'right' | 'center') {
  return align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'
}

export default function DataTable<T extends Record<string, any>>({ columns, rows, rowKey }: Props<T>) {
  return (
    <div className="card overflow-hidden">
      {/* Desktop / tablet: tabla real */}
      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-ink-100 bg-ink-50/60 text-xs uppercase tracking-wide text-ink-400">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className={`px-4 py-3 font-medium ${alignClass(col.align)}`}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {rows.map((row) => (
              <tr key={rowKey(row)} className="transition-colors hover:bg-ink-50/60">
                {columns.map((col) => (
                  <td key={col.key} className={`px-4 py-3 align-middle ${alignClass(col.align)}`}>
                    {col.cell ? col.cell(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: tarjetas apiladas */}
      <div className="divide-y divide-ink-100 sm:hidden">
        {rows.map((row) => (
          <div key={rowKey(row)} className="space-y-2 p-4">
            {columns.map((col) => (
              <div key={col.key} className="flex items-center justify-between gap-3 text-sm">
                <span className="text-xs font-medium uppercase tracking-wide text-ink-400">{col.label}</span>
                <span className="text-right">{col.cell ? col.cell(row) : row[col.key]}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
