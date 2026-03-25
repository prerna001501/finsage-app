import { ReactNode } from 'react'
interface ResultCardProps { title: string; children: ReactNode; variant?: 'default' | 'success' | 'warning' | 'danger'; icon?: string }
const variantStyles = {
  default: { wrapper: 'border', titleColor: '#6B6C8A', bg: '#FFFBEA', borderColor: '#EDD382' },
  success: { wrapper: 'border', titleColor: '#16A34A', bg: '#F0FDF4', borderColor: '#86EFAC' },
  warning: { wrapper: 'border', titleColor: '#EA580C', bg: '#FFF7ED', borderColor: '#FDBA74' },
  danger: { wrapper: 'border', titleColor: '#F4442E', bg: '#FFF1F0', borderColor: '#FCA5A5' },
}
export default function ResultCard({ title, children, variant = 'default', icon }: ResultCardProps) {
  const s = variantStyles[variant]
  return (
    <div className={`rounded-xl p-5 shadow-sm ${s.wrapper}`} style={{ background: s.bg, borderColor: s.borderColor }}>
      <h3 className="text-xs font-semibold uppercase tracking-wide mb-3 flex items-center gap-2" style={{ color: s.titleColor }}>
        {icon && <span>{icon}</span>}{title}
      </h3>
      {children}
    </div>
  )
}
