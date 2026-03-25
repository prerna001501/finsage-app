import { useState } from 'react'
import { analyzeTax } from '../api/client'
import FileUpload from '../components/shared/FileUpload'
import ResultCard from '../components/shared/ResultCard'

const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`

export default function TaxWizardPage() {
  const [file, setFile] = useState<File | null>(null)
  const [useSample, setUseSample] = useState(false)
  const [manual, setManual] = useState({
    gross_salary: '', hra_received: '', rent_paid: '',
    section_80c: '', section_80d: '', section_80ccd_nps: '', home_loan_interest: '',
  })
  const [result, setResult] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const fd = new FormData()
    if (useSample) {
      fd.append('use_sample', 'true')
    } else if (file) {
      fd.append('form16_pdf', file)
    } else {
      Object.entries(manual).forEach(([k, v]) => fd.append(k, v || '0'))
    }
    try {
      const data = await analyzeTax(fd)
      setResult(data)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Analysis failed'
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
        <h1 className="text-3xl font-bold">🧾 AI Tax Wizard</h1>
        <p className="mt-1" style={{ color: '#6B6C8A' }}>FY 2024-25 old vs new regime comparison + missed deductions recovery</p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-xl p-6 shadow-sm space-y-6" style={{ background: '#FFFBEA', border: '1.5px solid #EDD382' }}>
        <div>
          <h2 className="font-semibold mb-4">Upload Form 16 or Enter Manually</h2>
          <FileUpload
            onFile={f => { setFile(f); setUseSample(false) }}
            onSample={() => { setUseSample(true); setFile(null) }}
            label="Form 16 PDF"
          />
        </div>

        {!file && !useSample && (
          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-wide" style={{ color: '#6B6C8A' }}>Or enter manually</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                ['gross_salary', 'Gross Salary (₹)'],
                ['hra_received', 'HRA Received (₹)'],
                ['rent_paid', 'Annual Rent Paid (₹)'],
                ['section_80c', '80C Invested (₹)'],
                ['section_80d', '80D Premium (₹)'],
                ['section_80ccd_nps', 'NPS 80CCD(1B) (₹)'],
                ['home_loan_interest', 'Home Loan Interest (₹)'],
              ].map(([key, label]) => (
                <div key={key} className="space-y-1">
                  <label className={labelClass} style={labelStyle}>{label}</label>
                  <input
                    type="number"
                    className={inputClass}
                    style={inputStyle}
                    value={manual[key as keyof typeof manual]}
                    onChange={e => setManual({ ...manual, [key]: e.target.value })}
                    placeholder="0"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-all"
          style={{ background: '#F4442E' }}
        >
          {loading ? '⏳ Analyzing tax with AI…' : '🧾 Analyze My Tax'}
        </button>
        {error && <p className="text-sm" style={{ color: '#F4442E' }}>{error}</p>}
      </form>

      {result && (
        <div className="space-y-6">
          {/* Regime comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['old_regime', 'new_regime'].map(regime => {
              const r = result[regime] as { taxable_income: number; total_tax: number; effective_rate: number; deductions_claimed: number }
              const comp = result.comparison as { recommended: string }
              const isRecommended = comp.recommended === regime.replace('_regime', '')
              return (
                <div key={regime} className={`rounded-xl p-6 border-2 transition-all shadow-sm`} style={{ background: '#FFFBEA', borderColor: isRecommended ? '#16A34A' : '#EDD382' }}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">{regime === 'old_regime' ? '📜 Old Regime' : '✨ New Regime'}</h3>
                    {isRecommended && <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(22,163,74,0.15)', color: '#16A34A' }}>✓ Recommended</span>}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span style={{ color: '#6B6C8A' }}>Taxable Income</span><span>{fmt(r.taxable_income)}</span></div>
                    <div className="flex justify-between"><span style={{ color: '#6B6C8A' }}>Total Tax</span><span className="font-semibold" style={{ color: '#F4442E' }}>{fmt(r.total_tax)}</span></div>
                    <div className="flex justify-between"><span style={{ color: '#6B6C8A' }}>Effective Rate</span><span>{r.effective_rate}%</span></div>
                    <div className="flex justify-between"><span style={{ color: '#6B6C8A' }}>Deductions</span><span style={{ color: '#16A34A' }}>{fmt(r.deductions_claimed)}</span></div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Savings banner */}
          <div className="rounded-xl p-5 text-center" style={{ background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.25)' }}>
            <p className="font-bold text-xl" style={{ color: '#16A34A' }}>
              💰 Choose {(result.comparison as { recommended: string; savings: number }).recommended.toUpperCase()} REGIME — Save {fmt((result.comparison as { savings: number }).savings)} per year
            </p>
          </div>

          {/* Missed deductions */}
          {result.missed_deductions && (result.missed_deductions as unknown[]).length > 0 && (
            <ResultCard title="Missed Deductions — Recovery Plan" icon="🔍" variant="warning">
              <div className="space-y-3">
                {(result.missed_deductions as { section: string; description: string; potential_saving: number; action: string }[]).map((d, i) => (
                  <div key={i} className="flex gap-3 p-3 rounded-lg" style={{ background: 'rgba(252,158,79,0.07)' }}>
                    <span className="font-bold text-sm w-16 shrink-0" style={{ color: '#FC9E4F' }}>{d.section}</span>
                    <div>
                      <p className="text-sm font-medium">{d.description}</p>
                      <p className="text-xs mt-0.5" style={{ color: '#16A34A' }}>Potential saving: {fmt(d.potential_saving)}</p>
                      <p className="text-xs mt-0.5" style={{ color: '#6B6C8A' }}>{d.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ResultCard>
          )}

          {/* Investment suggestions */}
          {result.investment_suggestions && (
            <ResultCard title="Recommended Tax-Saving Investments" icon="📈">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(result.investment_suggestions as { instrument: string; section: string; recommended_amount: number; rationale: string }[]).map((s, i) => (
                  <div key={i} className="p-3 rounded-lg" style={{ background: 'rgba(244,68,46,0.06)', border: '1px solid rgba(244,68,46,0.15)' }}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{s.instrument}</span>
                      <span className="text-xs" style={{ color: '#F4442E' }}>{s.section}</span>
                    </div>
                    <p className="text-sm font-semibold" style={{ color: '#16A34A' }}>{fmt(s.recommended_amount)}</p>
                    <p className="text-xs mt-1" style={{ color: '#6B6C8A' }}>{s.rationale}</p>
                  </div>
                ))}
              </div>
            </ResultCard>
          )}
        </div>
      )}
    </div>
  )
}
