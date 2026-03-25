import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
interface DonutChartProps { data: { name: string; value: number }[]; colors?: string[] }
const DEFAULT_COLORS = ['#F4442E', '#FC9E4F', '#EDD382', '#020122', '#16A34A', '#6B6C8A']
export default function DonutChart({ data, colors = DEFAULT_COLORS }: DonutChartProps) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" strokeWidth={2} stroke="#F2F3AE">
          {data.map((_, index) => <Cell key={index} fill={colors[index % colors.length]} />)}
        </Pie>
        <Tooltip contentStyle={{ background: '#FFFFFF', border: '1px solid #EDD382', borderRadius: 8 }} formatter={(v: number) => [`${v}%`]} />
        <Legend wrapperStyle={{ color: '#6B6C8A', fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  )
}
