import { useState } from 'react'
import { adviseLifeEvent } from '../api/client'
import ResultCard from '../components/shared/ResultCard'
import DonutChart from '../components/shared/DonutChart'

const EVENTS = [
  { type: 'marriage', icon: '💍', label: 'Marriage', color: '#F4442E' },
  { type: 'baby', icon: '👶', label: 'New Baby', color: '#16A34A' },
  { type: 'job_change', icon: '💼', label: 'Job Change', color: '#FC9E4F' },
  { type: 'bonus', icon: '💰', label: 'Bonus / Windfall', color: '#F4442E' },
  { type: 'retirement', icon: '🏖️', label: 'Retirement', color: '#16A34A' },
  { type: 'home_purchase', icon: '🏠', label: 'Home Purchase', color: '#FC9E4F' },
]

const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`

export default function LifeEventsPage() {
  const [selectedEvent, setSelectedEvent] = useState('')
  const [form, setForm] = useState({ age: 32, monthly_income: 150000, monthly_expenses: 70000, current_savings: 800000, event_amount: 500000, existing_investments: 1200000, partner_income: 80000, has_emergency_fund: true })
  const [result, setResult] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedEvent) return
    setLoading(true)
    setError(null)
    try {
      const data = await adviseLifeEvent({ ...form, event_type: selectedEvent })
      setResult(data)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to get advice'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'w-full rounded-lg px-3 py-2 text-sm focus:outline-none'
  const inputStyle = { background: '#FEFEF5', border: '1.5px solid #EDD382', color: '#020122' }
  const labelClass = 'text-xs font-medium'
  const labelStyle = { color: '#6B6C8A' }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">🎯 Life Event Advisor</h1>
        <p className="mt-1" style={{ color: '#6B6C8A' }}>30/60/90-day financial action plan for every major life milestone</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-xl p-6 shadow-sm" style={{ background: '#FFFBEA', border: '1.5px solid #EDD382' }}>
          <h2 className="font-semibold mb-4">Select Your Life Event</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {EVENTS.map(ev => (
              <button
                key={ev.type}
                type="button"
                onClick={() => setSelectedEvent(ev.type)}
                className="p-4 rounded-xl border text-left transition-all"
                style={selectedEvent === ev.type
                  ? { borderColor: '#F4442E', background: 'rgba(244,68,46,0.08)', color: '#F4442E' }
                  : { borderColor: 'rgba(237,211,130,0.6)', color: '#020122' }
                }
              >
                <div className="text-2xl mb-1">{ev.icon}</div>
                <div className="text-sm font-medium">{ev.label}</div>
              </button>
            ))}
          </div>
        </div>

        {selectedEvent && (
          <div className="rounded-xl p-6 shadow-sm space-y-4" style={{ background: '#FFFBEA', border: '1.5px solid #EDD382' }}>
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold">Your Financial Snapshot</h2>
              <button
                type="button"
                onClick={() => setForm({ age: 32, monthly_income: 150000, monthly_expenses: 70000, current_savings: 800000, event_amount: 500000, existing_investments: 1200000, partner_income: 80000, has_emergency_fund: true })}
                className="text-xs transition-colors"
                style={{ color: '#F4442E' }}
              >
                📦 Load Sample Data
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                ['age', 'Age'],
                ['monthly_income', 'Monthly Income (₹)'],
                ['monthly_expenses', 'Monthly Expenses (₹)'],
                ['current_savings', 'Current Savings (₹)'],
                ['event_amount', 'Event Amount (₹)'],
                ['existing_investments', 'Existing Investments (₹)'],
                ['partner_income', 'Partner Income (₹)'],
              ].map(([key, label]) => (
                <div key={key} className="space-y-1">
                  <label className={labelClass} style={labelStyle}>{label}</label>
                  <input
                    type="number"
                    className={inputClass}
                    style={inputStyle}
                    value={form[key as keyof typeof form] as number}
                    onChange={e => setForm({ ...form, [key]: Number(e.target.value) })}
                  />
                </div>
              ))}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all"
              style={{ background: '#F4442E' }}
            >
              {loading ? '⏳ Generating action plan…' : '🎯 Get My Action Plan'}
            </button>
            {error && <p className="text-sm" style={{ color: '#F4442E' }}>{error}</p>}
          </div>
        )}
      </form>

      {result && (
        <div className="space-y-6">
          <p className="text-sm rounded-xl p-4 shadow-sm" style={{ color: '#6B6C8A', background: '#FFFBEA', border: '1.5px solid #EDD382' }}>{result.summary as string}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ResultCard title="Immediate Actions (This Week)" icon="⚡" variant="warning">
              <div className="space-y-3">
                {(result.immediate_actions as { action: string; deadline: string; amount: number | null; reason: string }[]).map((a, i) => (
                  <div key={i} className="p-3 rounded-lg" style={{ background: 'rgba(252,158,79,0.07)' }}>
                    <p className="text-sm font-medium">{a.action}</p>
                    {a.amount && <p className="text-sm font-semibold" style={{ color: '#FC9E4F' }}>{fmt(a.amount)}</p>}
                    <p className="text-xs mt-0.5" style={{ color: '#6B6C8A' }}>{a.deadline} — {a.reason}</p>
                  </div>
                ))}
              </div>
            </ResultCard>

            <div className="rounded-xl p-6 shadow-sm" style={{ background: '#FFFBEA', border: '1.5px solid #EDD382' }}>
              <h3 className="text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: '#6B6C8A' }}>Allocation Plan</h3>
              {result.allocation_plan && (
                <DonutChart
                  data={Object.entries(result.allocation_plan as Record<string, number>)
                    .filter(([, v]) => v > 0)
                    .map(([k, v]) => ({ name: k.replace(/_/g, ' '), value: v }))}
                />
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { key: 'day_30_actions', label: '30-Day Plan', icon: '📅', color: '#F4442E' },
              { key: 'day_60_actions', label: '60-Day Plan', icon: '📆', color: '#FC9E4F' },
              { key: 'day_90_actions', label: '90-Day Plan', icon: '🗓️', color: '#16A34A' },
            ].map(({ key, label, icon, color }) => (
              <ResultCard key={key} title={label} icon={icon}>
                <ul className="space-y-2">
                  {((result[key] as string[]) || []).map((action, i) => (
                    <li key={i} className="flex gap-2 text-sm">
                      <span style={{ color }}>•</span>{action}
                    </li>
                  ))}
                </ul>
              </ResultCard>
            ))}
          </div>

          {result.tax_implications && (
            <ResultCard title="Tax Implications" icon="🧾">
              <p className="text-sm" style={{ color: '#020122' }}>{result.tax_implications as string}</p>
            </ResultCard>
          )}
        </div>
      )}
    </div>
  )
}
