import { useState } from 'react'
import { optimizeCouplePlan } from '../api/client'
import ResultCard from '../components/shared/ResultCard'

const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`

const PARTNER_DEFAULTS = {
  A: { name: 'Raj', age: 33, monthly_income: 180000, monthly_expenses: 60000, existing_investments: 2000000, life_insurance_cover: 10000000, hra_received: 72000, rent_paid: 240000, city_metro: true, section_80c_used: 100000, nps_contribution: 0 },
  B: { name: 'Priya', age: 31, monthly_income: 120000, monthly_expenses: 40000, existing_investments: 1200000, life_insurance_cover: 5000000, hra_received: 48000, rent_paid: 0, city_metro: true, section_80c_used: 80000, nps_contribution: 0 },
}

export default function CouplePlannerPage() {
  const [partnerA, setPartnerA] = useState(PARTNER_DEFAULTS.A)
  const [partnerB, setPartnerB] = useState(PARTNER_DEFAULTS.B)
  const [goals, setGoals] = useState([
    { name: 'Child Education', target_amount: 5000000, target_years: 15 },
    { name: 'Retirement Corpus', target_amount: 50000000, target_years: 25 },
  ])
  const [result, setResult] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const data = await optimizeCouplePlan({
        partner_a: partnerA,
        partner_b: partnerB,
        joint_goals: goals,
        has_children: false,
        home_loan_outstanding: 0,
      })
      setResult(data)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to optimize'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'w-full rounded-lg px-3 py-2 text-sm focus:outline-none'
  const inputStyle = { background: '#FEFEF5', border: '1.5px solid #EDD382', color: '#020122' }
  const labelClass = 'text-xs font-medium'
  const labelStyle = { color: '#6B6C8A' }

  const PartnerForm = ({ partner, setPartner, label, color }: {
    partner: typeof partnerA;
    setPartner: typeof setPartnerA;
    label: string;
    color: string;
  }) => (
    <div className="rounded-xl p-6 shadow-sm space-y-3" style={{ background: '#FFFBEA', border: '1.5px solid #EDD382' }}>
      <h3 className="font-semibold" style={{ color }}>{label}</h3>
      <div className="grid grid-cols-2 gap-3">
        {[
          ['name', 'Name', 'text'],
          ['age', 'Age', 'number'],
          ['monthly_income', 'Monthly Income (₹)', 'number'],
          ['monthly_expenses', 'Expenses (₹)', 'number'],
          ['existing_investments', 'Investments (₹)', 'number'],
          ['life_insurance_cover', 'Life Cover (₹)', 'number'],
          ['hra_received', 'HRA (₹/yr)', 'number'],
          ['rent_paid', 'Rent Paid (₹/yr)', 'number'],
          ['section_80c_used', '80C Used (₹)', 'number'],
          ['nps_contribution', 'NPS (₹/yr)', 'number'],
        ].map(([key, lbl, type]) => (
          <div key={key} className="space-y-1">
            <label className={labelClass} style={labelStyle}>{lbl}</label>
            <input
              type={type}
              className={inputClass}
              style={inputStyle}
              value={partner[key as keyof typeof partner] as string | number}
              onChange={e => setPartner({ ...partner, [key]: type === 'number' ? Number(e.target.value) : e.target.value })}
            />
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">💑 Couple's Money Planner</h1>
        <p className="mt-1" style={{ color: '#6B6C8A' }}>HRA optimization, joint NPS, SIP split — India's first AI couple planner</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Partner Details</h2>
          <button
            type="button"
            onClick={() => { setPartnerA(PARTNER_DEFAULTS.A); setPartnerB(PARTNER_DEFAULTS.B) }}
            className="text-xs transition-colors"
            style={{ color: '#F4442E' }}
          >
            📦 Load Sample Data
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PartnerForm partner={partnerA} setPartner={setPartnerA} label="Partner A" color="#F4442E" />
          <PartnerForm partner={partnerB} setPartner={setPartnerB} label="Partner B" color="#FC9E4F" />
        </div>

        {/* Goals */}
        <div className="rounded-xl p-6 shadow-sm space-y-3" style={{ background: '#FFFBEA', border: '1.5px solid #EDD382' }}>
          <h3 className="font-semibold">Joint Financial Goals</h3>
          {goals.map((g, i) => (
            <div key={i} className="grid grid-cols-3 gap-3 items-end">
              <div className="space-y-1">
                <label className={labelClass} style={labelStyle}>Goal Name</label>
                <input className={inputClass} style={inputStyle} value={g.name} onChange={e => setGoals(goals.map((gl, j) => j === i ? { ...gl, name: e.target.value } : gl))} />
              </div>
              <div className="space-y-1">
                <label className={labelClass} style={labelStyle}>Target Amount (₹)</label>
                <input type="number" className={inputClass} style={inputStyle} value={g.target_amount} onChange={e => setGoals(goals.map((gl, j) => j === i ? { ...gl, target_amount: Number(e.target.value) } : gl))} />
              </div>
              <div className="space-y-1">
                <label className={labelClass} style={labelStyle}>Years</label>
                <input type="number" className={inputClass} style={inputStyle} value={g.target_years} onChange={e => setGoals(goals.map((gl, j) => j === i ? { ...gl, target_years: Number(e.target.value) } : gl))} />
              </div>
            </div>
          ))}
          <button type="button" onClick={() => setGoals([...goals, { name: '', target_amount: 1000000, target_years: 10 }])} className="text-xs transition-colors" style={{ color: '#F4442E' }}>+ Add Goal</button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all"
          style={{ background: '#F4442E' }}
        >
          {loading ? '⏳ Optimizing joint finances…' : '💑 Optimize Our Finances'}
        </button>
        {error && <p className="text-sm" style={{ color: '#F4442E' }}>{error}</p>}
      </form>

      {result && (
        <div className="space-y-6">
          <p className="text-sm rounded-xl p-4" style={{ color: '#6B6C8A', background: '#FFFBEA', border: '1.5px solid #EDD382' }}>{result.summary as string}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* HRA */}
            <ResultCard title="HRA Optimization" icon="🏠" variant="success">
              {(() => {
                const h = result.hra_optimization as { recommended_claimant: string; annual_saving: number; rationale: string }
                return (
                  <div className="space-y-2 text-sm">
                    <div><span style={{ color: '#6B6C8A' }}>Claimant:</span> <span className="font-semibold" style={{ color: '#16A34A' }}>{h.recommended_claimant}</span></div>
                    <div><span style={{ color: '#6B6C8A' }}>Annual Saving:</span> <span className="font-semibold" style={{ color: '#FC9E4F' }}>{fmt(h.annual_saving)}</span></div>
                    <p className="text-xs mt-2" style={{ color: '#6B6C8A' }}>{h.rationale}</p>
                  </div>
                )
              })()}
            </ResultCard>

            {/* NPS */}
            <ResultCard title="NPS Strategy" icon="📅" variant="success">
              {(() => {
                const n = result.nps_recommendation as { partner_a_contribution: number; partner_b_contribution: number; combined_tax_saving: number; rationale: string }
                return (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span style={{ color: '#6B6C8A' }}>Partner A</span><span>{fmt(n.partner_a_contribution)}/yr</span></div>
                    <div className="flex justify-between"><span style={{ color: '#6B6C8A' }}>Partner B</span><span>{fmt(n.partner_b_contribution)}/yr</span></div>
                    <div className="flex justify-between"><span style={{ color: '#6B6C8A' }}>Tax Saving</span><span className="font-semibold" style={{ color: '#16A34A' }}>{fmt(n.combined_tax_saving)}</span></div>
                  </div>
                )
              })()}
            </ResultCard>

            {/* Tax savings */}
            <div className="bg-green-50 rounded-xl p-5 border border-green-200 flex flex-col items-center justify-center text-center">
              <span className="text-3xl mb-2">💰</span>
              <p className="text-3xl font-bold" style={{ color: '#16A34A' }}>{fmt(result.tax_savings_combined as number)}</p>
              <p className="text-xs mt-1" style={{ color: '#6B6C8A' }}>Combined Annual Tax Savings</p>
            </div>
          </div>

          {/* SIP Split */}
          <ResultCard title="SIP Split by Goal" icon="📈">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs" style={{ color: '#6B6C8A', borderBottom: '1px solid rgba(237,211,130,0.4)' }}>
                    <th className="text-left py-2">Goal</th>
                    <th className="text-right py-2">Partner A SIP</th>
                    <th className="text-right py-2">Partner B SIP</th>
                    <th className="text-right py-2">Fund Type</th>
                    <th className="text-right py-2">Years</th>
                  </tr>
                </thead>
                <tbody>
                  {(result.sip_split as { goal: string; partner_a_sip: number; partner_b_sip: number; fund_type: string; timeline_years: number }[]).map((s, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(237,211,130,0.3)' }}>
                      <td className="py-2 font-medium">{s.goal}</td>
                      <td className="py-2 text-right" style={{ color: '#F4442E' }}>{fmt(s.partner_a_sip)}</td>
                      <td className="py-2 text-right" style={{ color: '#FC9E4F' }}>{fmt(s.partner_b_sip)}</td>
                      <td className="py-2 text-right" style={{ color: '#6B6C8A' }}>{s.fund_type}</td>
                      <td className="py-2 text-right">{s.timeline_years}y</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ResultCard>

          {/* Insurance */}
          {result.joint_insurance && (
            <ResultCard title="Insurance Gap Analysis" icon="🛡️">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {['life_insurance_a', 'life_insurance_b'].map((key, i) => {
                  const ins = (result.joint_insurance as Record<string, { current: number; recommended: number; gap: number }>)[key]
                  return (
                    <div key={key} className="space-y-2">
                      <p className="font-medium" style={{ color: '#6B6C8A' }}>Partner {i === 0 ? 'A' : 'B'} Life Insurance</p>
                      <div className="flex justify-between"><span style={{ color: '#6B6C8A' }}>Current</span><span>{fmt(ins.current)}</span></div>
                      <div className="flex justify-between"><span style={{ color: '#6B6C8A' }}>Recommended</span><span style={{ color: '#16A34A' }}>{fmt(ins.recommended)}</span></div>
                      <div className="flex justify-between"><span style={{ color: '#6B6C8A' }}>Gap</span><span style={{ color: ins.gap > 0 ? '#F4442E' : '#16A34A' }}>{fmt(ins.gap)}</span></div>
                    </div>
                  )
                })}
              </div>
              <p className="text-xs mt-3" style={{ color: '#6B6C8A' }}>{(result.joint_insurance as { health_insurance: string }).health_insurance}</p>
            </ResultCard>
          )}

          {/* Goal timeline */}
          <ResultCard title="Goal Timeline" icon="🗓️">
            <div className="space-y-3">
              {(result.goal_timeline as { goal: string; target_amount: number; target_year: number; monthly_sip: number; assigned_to: string }[]).map((g, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg" style={{ background: 'rgba(237,211,130,0.12)' }}>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{g.goal}</p>
                    <p className="text-xs" style={{ color: '#6B6C8A' }}>Target {g.target_year} • Assigned to: {g.assigned_to}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm" style={{ color: '#FC9E4F' }}>{fmt(g.target_amount)}</p>
                    <p className="text-xs" style={{ color: '#6B6C8A' }}>SIP: {fmt(g.monthly_sip)}/mo</p>
                  </div>
                </div>
              ))}
            </div>
          </ResultCard>
        </div>
      )}
    </div>
  )
}
