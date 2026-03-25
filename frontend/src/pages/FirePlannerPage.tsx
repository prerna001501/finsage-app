import { useState } from 'react'
import { generateFirePlan } from '../api/client'
import SipGrowthChart from '../components/shared/SipGrowthChart'
import DonutChart from '../components/shared/DonutChart'
import ResultCard from '../components/shared/ResultCard'

const fmt = (n: number) => {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`
  return `₹${(n / 1000).toFixed(0)}K`
}

const SAMPLE = {
  current_age: 30, fire_age: 50, monthly_income: 150000,
  monthly_expenses: 70000, current_corpus: 500000, monthly_sip: 30000,
  annual_return_pct: 12, inflation_rate: 6.5,
}

export default function FirePlannerPage() {
  const [form, setForm] = useState(SAMPLE)
  const [result, setResult] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const data = await generateFirePlan(form)
      setResult(data)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to generate FIRE plan'
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
        <h1 className="text-3xl font-bold">🔥 FIRE Path Planner</h1>
        <p className="mt-1" style={{ color: '#6B6C8A' }}>Calculate your Financial Independence corpus and monthly investment plan</p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-xl p-6 shadow-sm space-y-4" style={{ background: '#FFFBEA', border: '1.5px solid #EDD382' }}>
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold">FIRE Parameters</h2>
          <button type="button" onClick={() => setForm(SAMPLE)} className="text-xs transition-colors" style={{ color: '#F4442E' }}>
            📦 Load Sample Data
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            ['current_age', 'Current Age'],
            ['fire_age', 'Target FIRE Age'],
            ['monthly_income', 'Monthly Income (₹)'],
            ['monthly_expenses', 'Monthly Expenses (₹)'],
            ['current_corpus', 'Current Savings (₹)'],
            ['monthly_sip', 'Current Monthly SIP (₹)'],
            ['annual_return_pct', 'Expected Return (% p.a.)'],
            ['inflation_rate', 'Inflation Rate (%)'],
          ].map(([key, label]) => (
            <div key={key} className="space-y-1">
              <label className={labelClass} style={labelStyle}>{label}</label>
              <input
                type="number"
                step="any"
                className={inputClass}
                style={inputStyle}
                value={form[key as keyof typeof form]}
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
          {loading ? '⏳ Calculating FIRE roadmap…' : '🔥 Generate My FIRE Plan'}
        </button>
        {error && <p className="text-sm" style={{ color: '#F4442E' }}>{error}</p>}
      </form>

      {result && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Corpus Required', value: fmt(result.corpus_required as number), color: '#F4442E' },
              { label: 'Monthly SIP Required', value: fmt(result.monthly_sip_required as number), color: '#FC9E4F' },
              { label: 'Years to FIRE', value: `${result.years_to_fire} yrs`, color: '#16A34A' },
              { label: 'FIRE Age', value: `Age ${form.fire_age}`, color: '#F4442E' },
            ].map(stat => (
              <div key={stat.label} className="rounded-xl p-4 shadow-sm text-center" style={{ background: '#FFFBEA', border: '1.5px solid #EDD382' }}>
                <div className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
                <div className="text-xs mt-1" style={{ color: '#6B6C8A' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="rounded-xl p-6 shadow-sm" style={{ background: '#FFFBEA', border: '1.5px solid #EDD382' }}>
            <h3 className="font-semibold mb-4">Corpus Growth Projection</h3>
            <SipGrowthChart data={(result.corpus_projection as { age: number; corpus: number; invested: number }[])} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl p-6 shadow-sm" style={{ background: '#FFFBEA', border: '1.5px solid #EDD382' }}>
              <h3 className="font-semibold mb-4">Recommended Asset Allocation</h3>
              <DonutChart
                data={Object.entries(result.asset_allocation as Record<string, number>).map(([k, v]) => ({
                  name: k.charAt(0).toUpperCase() + k.slice(1),
                  value: v,
                }))}
              />
            </div>
            <ResultCard title="FIRE Roadmap Phases" icon="🗺️">
              <div className="space-y-3">
                {(result.phases as { phase: string; years: string; focus: string; milestones: string[] }[]).map((p, i) => (
                  <div key={i} className="border-l-2 pl-3" style={{ borderColor: '#FC9E4F' }}>
                    <p className="font-medium text-sm">{p.phase} <span className="font-normal" style={{ color: '#6B6C8A' }}>({p.years})</span></p>
                    <p className="text-xs" style={{ color: '#6B6C8A' }}>{p.focus}</p>
                  </div>
                ))}
              </div>
            </ResultCard>
          </div>

          <ResultCard title="AI Recommendations" icon="🤖">
            <ul className="space-y-2">
              {(result.recommendations as string[]).map((r, i) => (
                <li key={i} className="flex gap-2 text-sm"><span style={{ color: '#16A34A' }}>✓</span>{r}</li>
              ))}
            </ul>
          </ResultCard>
        </div>
      )}
    </div>
  )
}
