import { useState } from 'react'
import { calculateHealthScore } from '../api/client'
import RadarChart from '../components/shared/RadarChart'
import ScoreGauge from '../components/shared/ScoreGauge'
import ResultCard from '../components/shared/ResultCard'

const SAMPLE = {
  age: 32, monthly_income: 150000, monthly_expenses: 70000,
  emergency_fund: 200000, monthly_investments: 25000, existing_debt_emi: 15000,
  total_assets: 1200000, life_insurance_cover: 5000000, health_insurance_cover: 500000,
  retirement_corpus: 800000, section_80c_used: 100000, section_80d_used: 15000,
}

export default function HealthScorePage() {
  const [form, setForm] = useState(SAMPLE)
  const [result, setResult] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const data = await calculateHealthScore(form)
      setResult(data)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to calculate score'
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
        <h1 className="text-3xl font-bold">💊 Money Health Score</h1>
        <p className="mt-1" style={{ color: '#6B6C8A' }}>AI-powered 360° financial health check across 6 dimensions</p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-xl p-6 shadow-sm space-y-4" style={{ background: '#FFFBEA', border: '1.5px solid #EDD382' }}>
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold">Your Financial Profile</h2>
          <button type="button" onClick={() => setForm(SAMPLE)} className="text-xs transition-colors" style={{ color: '#F4442E' }}>
            📦 Load Sample Data
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            ['age', 'Age (years)', ''],
            ['monthly_income', 'Monthly Income (₹)', ''],
            ['monthly_expenses', 'Monthly Expenses (₹)', ''],
            ['emergency_fund', 'Emergency Fund (₹)', ''],
            ['monthly_investments', 'Monthly Investments (₹)', ''],
            ['existing_debt_emi', 'Existing EMIs (₹)', ''],
            ['total_assets', 'Total Assets (₹)', ''],
            ['life_insurance_cover', 'Life Insurance Cover (₹)', ''],
            ['health_insurance_cover', 'Health Insurance (₹)', ''],
            ['retirement_corpus', 'Retirement Corpus (₹)', ''],
            ['section_80c_used', '80C Invested (₹)', ''],
            ['section_80d_used', '80D Premium (₹)', ''],
          ].map(([key, label]) => (
            <div key={key} className="space-y-1">
              <label className={labelClass} style={labelStyle}>{label}</label>
              <input
                type="number"
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
          {loading ? '⏳ Analyzing your finances with AI…' : '🚀 Calculate My Health Score'}
        </button>
        {error && <p className="text-sm" style={{ color: '#F4442E' }}>{error}</p>}
      </form>

      {result && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl p-6 shadow-sm flex flex-col items-center gap-4" style={{ background: '#FFFBEA', border: '1.5px solid #EDD382' }}>
              <ScoreGauge score={result.overall_score as number} label="Overall Score" />
              <p className="text-sm text-center" style={{ color: '#6B6C8A' }}>{result.summary as string}</p>
            </div>
            <div className="rounded-xl p-6 shadow-sm" style={{ background: '#FFFBEA', border: '1.5px solid #EDD382' }}>
              <h3 className="text-sm font-semibold uppercase tracking-wide mb-3" style={{ color: '#6B6C8A' }}>6-Dimension Radar</h3>
              <RadarChart
                data={Object.entries(result.dimensions as Record<string, { score: number }>).map(([k, v]) => ({
                  dimension: k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
                  score: v.score,
                  fullMark: 100,
                }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.values(result.dimensions as Record<string, { label: string; score: number; status: string; insight: string }>).map(dim => (
              <ResultCard key={dim.label} title={dim.label} variant={dim.score >= 70 ? 'success' : dim.score >= 50 ? 'warning' : 'danger'}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold" style={{ color: '#FC9E4F' }}>{dim.score}</span>
                  <span className="text-xs" style={{ color: '#6B6C8A' }}>{dim.status}</span>
                </div>
                <p className="text-sm" style={{ color: '#020122' }}>{dim.insight}</p>
              </ResultCard>
            ))}
          </div>

          <ResultCard title="Top 3 Action Priorities" icon="🎯">
            <div className="space-y-3">
              {(result.top_priorities as { rank: number; action: string; impact: string; timeline: string }[]).map(p => (
                <div key={p.rank} className="flex gap-3">
                  <span className="font-bold text-lg w-6" style={{ color: '#FC9E4F' }}>#{p.rank}</span>
                  <div>
                    <p className="text-sm font-medium">{p.action}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#16A34A' }}>Impact: {p.impact}</p>
                    <p className="text-xs" style={{ color: '#6B6C8A' }}>Timeline: {p.timeline}</p>
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
