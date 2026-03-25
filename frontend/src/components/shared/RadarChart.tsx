import { RadarChart as ReRadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts'
interface RadarChartProps { data: { dimension: string; score: number; fullMark: number }[] }
export default function RadarChart({ data }: RadarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <ReRadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
        <PolarGrid stroke="rgba(237,211,130,0.5)" />
        <PolarAngleAxis dataKey="dimension" tick={{ fill: '#6B6C8A', fontSize: 11 }} />
        <Radar name="Score" dataKey="score" stroke="#F4442E" fill="#F4442E" fillOpacity={0.15} strokeWidth={2} />
        <Tooltip contentStyle={{ background: '#FFFFFF', border: '1px solid #EDD382', borderRadius: 8, boxShadow: '0 4px 12px rgba(2,1,34,0.1)' }} labelStyle={{ color: '#020122' }} formatter={(v: number) => [`${v}/100`, 'Score']} />
      </ReRadarChart>
    </ResponsiveContainer>
  )
}
