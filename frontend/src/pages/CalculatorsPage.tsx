import { useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const fmt = (n: number) => {
  if (n >= 10000000) return `₹${(n/10000000).toFixed(2)}Cr`
  if (n >= 100000) return `₹${(n/100000).toFixed(1)}L`
  return `₹${Math.round(n).toLocaleString('en-IN')}`
}

type CalcType = 'sip' | 'lumpsum' | 'emi' | 'goal'

function SIPCalc() {
  const [monthly, setMonthly] = useState(10000)
  const [years, setYears] = useState(10)
  const [rate, setRate] = useState(12)
  const [stepup, setStepup] = useState(10)

  const data = []
  let corpus = 0, invested = 0, sip = monthly
  const mr = rate / 100 / 12
  for (let y = 1; y <= years; y++) {
    for (let m = 0; m < 12; m++) { corpus = corpus * (1 + mr) + sip; invested += sip }
    sip = sip * (1 + stepup / 100)
    data.push({ year: `Yr ${y}`, corpus: Math.round(corpus), invested: Math.round(invested) })
  }
  const gain = corpus - invested
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[['Monthly SIP (₹)', monthly, setMonthly, 500, 200000, 500],
          ['Duration (Years)', years, setYears, 1, 40, 1],
          ['Expected Return (%)', rate, setRate, 1, 30, 0.5],
          ['Annual Step-up (%)', stepup, setStepup, 0, 30, 1]
        ].map(([label, val, setter, min, max, step]: any) => (
          <div key={label} className="space-y-2">
            <div className="flex justify-between text-xs"><span style={{ color: '#6B6C8A' }}>{label}</span><span className="font-semibold" style={{ color: '#F4442E' }}>{typeof val === 'number' && val >= 500 ? fmt(val) : val}{label.includes('%') ? '%' : label.includes('Years') ? 'y' : ''}</span></div>
            <input type="range" min={min} max={max} step={step} value={val as number} onChange={e => setter(Number(e.target.value))} className="w-full accent-[#F4442E]" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4 rounded-xl" style={{ background: 'rgba(244,68,46,0.06)', border: '1px solid rgba(244,68,46,0.15)' }}><p className="text-2xl font-bold" style={{ color: '#F4442E' }}>{fmt(invested)}</p><p className="text-xs mt-1" style={{ color: '#6B6C8A' }}>Amount Invested</p></div>
        <div className="text-center p-4 rounded-xl" style={{ background: 'rgba(252,158,79,0.08)', border: '1px solid rgba(252,158,79,0.2)' }}><p className="text-2xl font-bold" style={{ color: '#FC9E4F' }}>{fmt(corpus)}</p><p className="text-xs mt-1" style={{ color: '#6B6C8A' }}>Final Corpus</p></div>
        <div className="text-center p-4 bg-green-50 rounded-xl border border-green-100"><p className="text-2xl font-bold text-green-600">{fmt(gain)}</p><p className="text-xs mt-1" style={{ color: '#6B6C8A' }}>Wealth Gained</p></div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="c" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#F4442E" stopOpacity={0.2}/><stop offset="95%" stopColor="#F4442E" stopOpacity={0}/></linearGradient>
            <linearGradient id="i" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#FC9E4F" stopOpacity={0.15}/><stop offset="95%" stopColor="#FC9E4F" stopOpacity={0}/></linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(237,211,130,0.4)" />
          <XAxis dataKey="year" tick={{ fill: '#6B6C8A', fontSize: 10 }} />
          <YAxis tickFormatter={fmt} tick={{ fill: '#6B6C8A', fontSize: 10 }} />
          <Tooltip contentStyle={{ background: '#fff', border: '1px solid #EDD382', borderRadius: 8 }} formatter={(v: number) => [fmt(v)]} />
          <Area type="monotone" dataKey="corpus" name="Corpus" stroke="#F4442E" fill="url(#c)" strokeWidth={2} />
          <Area type="monotone" dataKey="invested" name="Invested" stroke="#FC9E4F" fill="url(#i)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

function LumpsumCalc() {
  const [amount, setAmount] = useState(100000)
  const [years, setYears] = useState(10)
  const [rate, setRate] = useState(12)
  const future = amount * Math.pow(1 + rate/100, years)
  const gain = future - amount
  const data = Array.from({length: years}, (_, i) => ({ year: `Yr ${i+1}`, value: Math.round(amount * Math.pow(1 + rate/100, i+1)) }))
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-4">
        {[['Investment Amount (₹)', amount, setAmount, 1000, 10000000, 1000],
          ['Duration (Years)', years, setYears, 1, 40, 1],
          ['Expected Return (%)', rate, setRate, 1, 30, 0.5]
        ].map(([label, val, setter, min, max, step]: any) => (
          <div key={label} className="space-y-2">
            <div className="flex justify-between text-xs"><span style={{ color: '#6B6C8A' }}>{label}</span><span className="font-semibold" style={{ color: '#F4442E' }}>{label.includes('₹') ? fmt(val) : label.includes('%') ? `${val}%` : `${val}y`}</span></div>
            <input type="range" min={min} max={max} step={step} value={val as number} onChange={e => setter(Number(e.target.value))} className="w-full accent-[#F4442E]" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4 rounded-xl" style={{ background: 'rgba(244,68,46,0.06)', border: '1px solid rgba(244,68,46,0.15)' }}><p className="text-2xl font-bold" style={{ color: '#F4442E' }}>{fmt(amount)}</p><p className="text-xs mt-1" style={{ color: '#6B6C8A' }}>Invested</p></div>
        <div className="text-center p-4 rounded-xl" style={{ background: 'rgba(252,158,79,0.08)', border: '1px solid rgba(252,158,79,0.2)' }}><p className="text-2xl font-bold" style={{ color: '#FC9E4F' }}>{fmt(future)}</p><p className="text-xs mt-1" style={{ color: '#6B6C8A' }}>Future Value</p></div>
        <div className="text-center p-4 bg-green-50 rounded-xl border border-green-100"><p className="text-2xl font-bold text-green-600">{fmt(gain)}</p><p className="text-xs mt-1" style={{ color: '#6B6C8A' }}>Gain ({Math.round(gain/amount*100)}%)</p></div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <defs><linearGradient id="lv" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#F4442E" stopOpacity={0.2}/><stop offset="95%" stopColor="#F4442E" stopOpacity={0}/></linearGradient></defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(237,211,130,0.4)" />
          <XAxis dataKey="year" tick={{ fill: '#6B6C8A', fontSize: 10 }} />
          <YAxis tickFormatter={fmt} tick={{ fill: '#6B6C8A', fontSize: 10 }} />
          <Tooltip contentStyle={{ background: '#fff', border: '1px solid #EDD382', borderRadius: 8 }} formatter={(v: number) => [fmt(v)]} />
          <Area type="monotone" dataKey="value" name="Value" stroke="#F4442E" fill="url(#lv)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

function EMICalc() {
  const [principal, setPrincipal] = useState(2000000)
  const [rate, setRate] = useState(8.5)
  const [tenure, setTenure] = useState(20)
  const mr = rate / 100 / 12
  const months = tenure * 12
  const emi = mr === 0 ? principal / months : (principal * mr * Math.pow(1+mr, months)) / (Math.pow(1+mr, months) - 1)
  const totalPaid = emi * months
  const totalInterest = totalPaid - principal
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-4">
        {[['Loan Amount (₹)', principal, setPrincipal, 100000, 20000000, 50000],
          ['Interest Rate (% p.a.)', rate, setRate, 5, 20, 0.1],
          ['Tenure (Years)', tenure, setTenure, 1, 30, 1]
        ].map(([label, val, setter, min, max, step]: any) => (
          <div key={label} className="space-y-2">
            <div className="flex justify-between text-xs"><span style={{ color: '#6B6C8A' }}>{label}</span><span className="font-semibold" style={{ color: '#F4442E' }}>{label.includes('₹') ? fmt(val) : label.includes('%') ? `${val}%` : `${val}y`}</span></div>
            <input type="range" min={min} max={max} step={step} value={val as number} onChange={e => setter(Number(e.target.value))} className="w-full accent-[#F4442E]" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-5 rounded-xl" style={{ background: 'rgba(244,68,46,0.07)', border: '1px solid rgba(244,68,46,0.2)' }}><p className="text-3xl font-bold" style={{ color: '#F4442E' }}>{fmt(Math.round(emi))}</p><p className="text-xs mt-1" style={{ color: '#6B6C8A' }}>Monthly EMI</p></div>
        <div className="text-center p-5 rounded-xl" style={{ background: 'rgba(237,211,130,0.12)', border: '1px solid rgba(237,211,130,0.4)' }}><p className="text-2xl font-bold" style={{ color: '#020122' }}>{fmt(totalPaid)}</p><p className="text-xs mt-1" style={{ color: '#6B6C8A' }}>Total Amount Paid</p></div>
        <div className="text-center p-5 bg-red-50 rounded-xl border border-red-200"><p className="text-2xl font-bold text-red-600">{fmt(totalInterest)}</p><p className="text-xs mt-1" style={{ color: '#6B6C8A' }}>Total Interest ({Math.round(totalInterest/principal*100)}% extra)</p></div>
      </div>
      <div className="rounded-xl p-4 text-sm" style={{ background: 'rgba(252,158,79,0.08)', border: '1px solid rgba(252,158,79,0.25)', color: '#020122' }}>
        💡 <strong>Tip:</strong> Paying one extra EMI per year reduces your {tenure}y tenure by ~{Math.round(tenure*0.08)} years and saves {fmt(totalInterest*0.15)} in interest.
      </div>
    </div>
  )
}

function GoalCalc() {
  const [goal, setGoal] = useState(5000000)
  const [years, setYears] = useState(15)
  const [rate, setRate] = useState(12)
  const [current, setCurrent] = useState(0)
  const mr = rate / 100 / 12
  const months = years * 12
  const fvCurrent = current * Math.pow(1 + rate/100, years)
  const remaining = Math.max(0, goal - fvCurrent)
  const sip = mr === 0 ? remaining / months : remaining * mr / (Math.pow(1+mr, months) - 1)
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[['Goal Amount (₹)', goal, setGoal, 100000, 50000000, 100000],
          ['Time Horizon (Years)', years, setYears, 1, 40, 1],
          ['Expected Return (%)', rate, setRate, 1, 30, 0.5],
          ['Current Savings (₹)', current, setCurrent, 0, 10000000, 10000]
        ].map(([label, val, setter, min, max, step]: any) => (
          <div key={label} className="space-y-2">
            <div className="flex justify-between text-xs"><span style={{ color: '#6B6C8A' }}>{label}</span><span className="font-semibold" style={{ color: '#F4442E' }}>{label.includes('₹') ? fmt(val) : label.includes('%') ? `${val}%` : `${val}y`}</span></div>
            <input type="range" min={min} max={max} step={step} value={val as number} onChange={e => setter(Number(e.target.value))} className="w-full accent-[#F4442E]" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-6 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(244,68,46,0.08) 0%, rgba(244,68,46,0.04) 100%)', border: '1px solid rgba(244,68,46,0.2)' }}>
          <p className="text-4xl font-bold" style={{ color: '#F4442E' }}>{fmt(Math.round(sip))}</p>
          <p className="text-sm font-medium mt-2" style={{ color: '#020122' }}>Monthly SIP Required</p>
          <p className="text-xs mt-1" style={{ color: '#6B6C8A' }}>to reach {fmt(goal)} in {years} years</p>
        </div>
        <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
          <p className="text-4xl font-bold text-green-600">{fmt(fvCurrent)}</p>
          <p className="text-sm font-medium mt-2" style={{ color: '#020122' }}>Current Savings Growth</p>
          <p className="text-xs mt-1" style={{ color: '#6B6C8A' }}>your ₹{fmt(current)} grows to this in {years}y</p>
        </div>
      </div>
      <div className="rounded-xl p-4 text-sm" style={{ background: 'rgba(244,68,46,0.06)', border: '1px solid rgba(244,68,46,0.15)', color: '#020122' }}>
        💡 <strong>Insight:</strong> Starting today with {fmt(Math.round(sip))}/month will build {fmt(goal)} by your target date.
        Delay of 1 year would require {fmt(Math.round(sip * 1.15))}/month — 15% more.
      </div>
    </div>
  )
}

export default function CalculatorsPage() {
  const [active, setActive] = useState<CalcType>('sip')
  const TABS: { key: CalcType; label: string; desc: string; icon: string }[] = [
    { key: 'sip', label: 'SIP Calculator', desc: 'Monthly investment → final corpus', icon: '📅' },
    { key: 'lumpsum', label: 'Lump Sum', desc: 'One-time investment → future value', icon: '💰' },
    { key: 'emi', label: 'EMI Calculator', desc: 'Loan amount → monthly payment', icon: '🏦' },
    { key: 'goal', label: 'Goal Planner', desc: 'Target amount → required SIP', icon: '🎯' },
  ]
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold" style={{ color: '#020122' }}>🧮 Financial Calculators</h1>
        <p className="mt-1 text-sm" style={{ color: '#6B6C8A' }}>Free, instant calculations — no signup, no fees. Drag the sliders to explore scenarios.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => setActive(tab.key)}
            className="p-4 rounded-xl border text-left transition-all"
            style={active === tab.key
              ? { borderColor: '#F4442E', background: 'rgba(244,68,46,0.07)', boxShadow: '0 4px 12px rgba(244,68,46,0.12)' }
              : { borderColor: '#EDD382', background: '#FFFBEA' }
            }>
            <span className="text-2xl">{tab.icon}</span>
            <p className="text-sm font-semibold mt-2" style={{ color: active === tab.key ? '#F4442E' : '#020122' }}>{tab.label}</p>
            <p className="text-xs mt-0.5" style={{ color: '#6B6C8A' }}>{tab.desc}</p>
          </button>
        ))}
      </div>
      <div className="rounded-2xl shadow-sm p-6" style={{ background: '#FFFBEA', border: '1.5px solid #EDD382' }}>
        {active === 'sip' && <SIPCalc />}
        {active === 'lumpsum' && <LumpsumCalc />}
        {active === 'emi' && <EMICalc />}
        {active === 'goal' && <GoalCalc />}
      </div>
      <div className="rounded-xl p-5" style={{ background: '#FFF7ED', border: '1.5px solid #FC9E4F' }}>
        <p className="text-xs leading-relaxed" style={{ color: '#020122' }}>
          <strong style={{ color: '#F4442E' }}>Note:</strong> These calculators use standard financial formulas. Returns shown are illustrative based on the rate you enter — actual mutual fund returns vary and past performance does not guarantee future results. For tax-saving investments, consult the specific instrument rules.
        </p>
      </div>
    </div>
  )
}
