import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
interface SipGrowthChartProps { data: { age: number; corpus: number; invested: number }[] }
const fmt = (v: number) => v >= 10000000 ? `₹${(v/10000000).toFixed(1)}Cr` : v >= 100000 ? `₹${(v/100000).toFixed(1)}L` : `₹${(v/1000).toFixed(0)}K`
export default function SipGrowthChart({ data }: SipGrowthChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
        <defs>
          <linearGradient id="corpusGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#F4442E" stopOpacity={0.25}/><stop offset="95%" stopColor="#F4442E" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="investedGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#FC9E4F" stopOpacity={0.2}/><stop offset="95%" stopColor="#FC9E4F" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(237,211,130,0.4)" />
        <XAxis dataKey="age" tick={{ fill: '#6B6C8A', fontSize: 11 }} />
        <YAxis tickFormatter={fmt} tick={{ fill: '#6B6C8A', fontSize: 10 }} />
        <Tooltip contentStyle={{ background: '#FFFFFF', border: '1px solid #EDD382', borderRadius: 8 }} labelStyle={{ color: '#020122' }} formatter={(v: number) => [fmt(v)]} />
        <Legend wrapperStyle={{ color: '#6B6C8A', fontSize: 12 }} />
        <Area type="monotone" dataKey="corpus" name="Projected Corpus" stroke="#F4442E" fill="url(#corpusGrad)" strokeWidth={2} />
        <Area type="monotone" dataKey="invested" name="Amount Invested" stroke="#FC9E4F" fill="url(#investedGrad)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  )
}
