export default function QRCodeCard({ code }: { code: string }) {
  return (
    <div>
      <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-xl border border-ink-100 bg-white p-3 shadow-soft">
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <rect width="100" height="100" fill="white" />
          <g fill="#0B0B0B">
            <rect x="6" y="6" width="24" height="24" />
            <rect x="12" y="12" width="12" height="12" fill="white" />
            <rect x="70" y="6" width="24" height="24" />
            <rect x="76" y="12" width="12" height="12" fill="white" />
            <rect x="6" y="70" width="24" height="24" />
            <rect x="12" y="76" width="12" height="12" fill="white" />
            <rect x="40" y="10" width="6" height="6" />
            <rect x="50" y="16" width="6" height="6" />
            <rect x="40" y="40" width="8" height="8" />
            <rect x="54" y="40" width="6" height="6" />
            <rect x="64" y="46" width="6" height="6" />
            <rect x="40" y="54" width="6" height="6" />
            <rect x="52" y="60" width="8" height="8" />
            <rect x="66" y="64" width="6" height="6" />
            <rect x="40" y="70" width="6" height="6" />
            <rect x="54" y="76" width="6" height="6" />
            <rect x="70" y="80" width="20" height="6" />
            <rect x="80" y="60" width="6" height="14" />
          </g>
        </svg>
      </div>
      <p className="mt-2 text-center text-xs font-mono tracking-wide text-ink-400">{code}</p>
    </div>
  )
}
