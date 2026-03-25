interface ScoreGaugeProps { score: number; size?: number; label?: string }
export default function ScoreGauge({ score, size = 160, label = 'Score' }: ScoreGaugeProps) {
  const clampedScore = Math.max(0, Math.min(100, score))
  const color = clampedScore >= 75 ? '#16A34A' : clampedScore >= 50 ? '#FC9E4F' : '#F4442E'
  const strokeWidth = 12
  const radius = (size - strokeWidth) / 2
  const circumference = radius * Math.PI
  const progress = (clampedScore / 100) * circumference
  const grade = clampedScore >= 90 ? 'A+' : clampedScore >= 80 ? 'A' : clampedScore >= 70 ? 'B' : clampedScore >= 60 ? 'C' : clampedScore >= 50 ? 'D' : 'F'
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size / 2 + strokeWidth }}>
        <svg width={size} height={size / 2 + strokeWidth} viewBox={`0 0 ${size} ${size / 2 + strokeWidth}`}>
          <path d={`M ${strokeWidth/2} ${size/2} A ${radius} ${radius} 0 0 1 ${size-strokeWidth/2} ${size/2}`} fill="none" stroke="rgba(237,211,130,0.4)" strokeWidth={strokeWidth} strokeLinecap="round" />
          <path d={`M ${strokeWidth/2} ${size/2} A ${radius} ${radius} 0 0 1 ${size-strokeWidth/2} ${size/2}`} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray={`${progress} ${circumference}`} style={{ transition: 'stroke-dasharray 1s ease-in-out' }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
          <span className="text-3xl font-bold" style={{ color }}>{clampedScore}</span>
          <span className="text-xs" style={{ color: '#6B6C8A' }}>{label}</span>
        </div>
      </div>
      <span className="text-2xl font-bold" style={{ color }}>Grade: {grade}</span>
    </div>
  )
}
