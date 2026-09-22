interface Props {
  height?: string
  rounded?: string
}

export default function Skeleton({ height = '1rem', rounded = '0.5rem' }: Props) {
  return <div className="animate-pulse bg-ink-100" style={{ height, borderRadius: rounded }} />
}
