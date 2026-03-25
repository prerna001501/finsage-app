import { useState } from 'react'
import { analyzePortfolio } from '../api/client'
import FileUpload from '../components/shared/FileUpload'
import ResultCard from '../components/shared/ResultCard'
import DonutChart from '../components/shared/DonutChart'

const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`

export default function PortfolioXrayPage() {
  const [result, setResult] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (fd: FormData) => {
    setLoading(true)
    setError(null)
    try {
      const data = await analyzePortfolio(fd)
      setResult(data)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Analysis failed'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">📊 MF Portfolio X-Ray</h1>
        <p className="mt-1" style={{ color: '#6B6C8A' }}>XIRR, overlap analysis, expense drag, and AI rebalancing plan</p>
      </div>

      <div className="rounded-xl p-6 shadow-sm" style={{ background: '#FFFBEA', border: '1.5px solid #EDD382' }}>
        <h2 className="font-semibold mb-4">Upload CAMS Statement</h2>
        <FileUpload
          onFile={file => {
            const fd = new FormData()
            fd.append('cams_pdf', file)
            submit(fd)
          }}
          onSample={() => {
            const fd = new FormData()
            fd.append('use_sample', 'true')
            submit(fd)
          }}
          label="CAMS Consolidated Statement PDF"
        />
        {loading && (
          <div className="text-center py-6">
            <p className="loading-pulse" style={{ color: '#6B6C8A' }}>⏳ Analyzing portfolio with AI…</p>
          </div>
        )}
        {error && <p className="text-sm mt-3" style={{ color: '#F4442E' }}>{error}</p>}
      </div>

      {result && (
        <div className="space-y-6">
          {/* Key metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'XIRR', value: `${result.xirr}%`, color: (result.xirr as number) > 12 ? '#16A34A' : '#FC9E4F' },
              { label: 'Current Value', value: fmt(result.total_current_value as number), color: '#F4442E' },
              { label: 'Total Invested', value: fmt(result.total_invested as number), color: '#020122' },
              { label: 'Absolute Return', value: `${result.absolute_return}%`, color: (result.absolute_return as number) > 0 ? '#16A34A' : '#F4442E' },
            ].map(stat => (
              <div key={stat.label} className="rounded-xl p-4 shadow-sm text-center" style={{ background: '#FFFBEA', border: '1.5px solid #EDD382' }}>
                <div className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
                <div className="text-xs mt-1" style={{ color: '#6B6C8A' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Holdings table */}
          <ResultCard title="Holdings Breakdown" icon="📋">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs" style={{ color: '#6B6C8A', borderBottom: '1px solid rgba(237,211,130,0.4)' }}>
                    <th className="text-left py-2">Fund</th>
                    <th className="text-right py-2">Invested</th>
                    <th className="text-right py-2">Current Value</th>
                    <th className="text-right py-2">Gain</th>
                    <th className="text-right py-2">Plan</th>
                  </tr>
                </thead>
                <tbody>
                  {(result.holdings as { fund_name: string; invested: number; current_value: number; plan: string }[]).map((h, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(237,211,130,0.3)' }}>
                      <td className="py-2 font-medium">{h.fund_name}</td>
                      <td className="py-2 text-right" style={{ color: '#6B6C8A' }}>{fmt(h.invested)}</td>
                      <td className="py-2 text-right">{fmt(h.current_value)}</td>
                      <td className="py-2 text-right font-medium" style={{ color: h.current_value > h.invested ? '#16A34A' : '#F4442E' }}>
                        {((h.current_value - h.invested) / h.invested * 100).toFixed(1)}%
                      </td>
                      <td className="py-2 text-right">
                        <span className="text-xs px-2 py-0.5 rounded-full" style={h.plan === 'direct' ? { background: 'rgba(22,163,74,0.15)', color: '#16A34A' } : { background: 'rgba(244,68,46,0.1)', color: '#F4442E' }}>
                          {h.plan}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ResultCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Allocation chart */}
            <div className="rounded-xl p-6 shadow-sm" style={{ background: '#FFFBEA', border: '1.5px solid #EDD382' }}>
              <h3 className="font-semibold mb-3">Portfolio Allocation</h3>
              <DonutChart
                data={(result.holdings as { fund_name: string; current_value: number }[]).map(h => ({
                  name: h.fund_name.split(' ').slice(0, 2).join(' '),
                  value: Math.round(h.current_value / (result.total_current_value as number) * 100),
                }))}
              />
            </div>

            {/* Expense analysis */}
            <ResultCard title="Expense Analysis" icon="💸" variant="warning">
              <div className="space-y-3">
                {(() => {
                  const ea = result.expense_analysis as { total_annual_expense: number; savings_if_direct: number; effective_expense_ratio: number }
                  return (
                    <>
                      <div className="flex justify-between text-sm"><span style={{ color: '#6B6C8A' }}>Annual Expense Drag</span><span style={{ color: '#F4442E' }}>{fmt(ea.total_annual_expense)}</span></div>
                      <div className="flex justify-between text-sm"><span style={{ color: '#6B6C8A' }}>Savings if Direct</span><span style={{ color: '#16A34A' }}>{fmt(ea.savings_if_direct)}</span></div>
                      <div className="flex justify-between text-sm"><span style={{ color: '#6B6C8A' }}>Effective Expense Ratio</span><span>{ea.effective_expense_ratio}%</span></div>
                    </>
                  )
                })()}
              </div>
            </ResultCard>
          </div>

          {/* Overlap analysis */}
          {result.overlap_analysis && (
            <ResultCard title="Fund Overlap Analysis" icon="🔁">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {((result.overlap_analysis as { pairs: { fund1: string; fund2: string; overlap_pct: number; high: boolean }[] }).pairs).map((p, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg text-xs" style={p.high ? { background: 'rgba(244,68,46,0.08)', border: '1px solid rgba(244,68,46,0.2)' } : { background: 'rgba(237,211,130,0.1)' }}>
                    <span style={{ color: '#6B6C8A' }}>{p.fund1.split(' ').slice(0, 2).join(' ')} ↔ {p.fund2.split(' ').slice(0, 2).join(' ')}</span>
                    <span className="font-semibold" style={{ color: p.high ? '#F4442E' : '#16A34A' }}>{p.overlap_pct}%</span>
                  </div>
                ))}
              </div>
            </ResultCard>
          )}

          {/* Rebalancing plan */}
          <ResultCard title="AI Rebalancing Plan" icon="🤖">
            <div className="space-y-3">
              {(result.rebalancing_plan as { action: string; fund: string; amount: number; reason: string; priority: string }[]).map((r, i) => (
                <div key={i} className="flex gap-3 p-3 rounded-lg" style={{ background: 'rgba(237,211,130,0.1)' }}>
                  <span className="text-xs font-bold px-2 py-0.5 rounded h-fit" style={
                    r.action === 'buy' ? { background: 'rgba(22,163,74,0.15)', color: '#16A34A' } :
                    r.action === 'sell' ? { background: 'rgba(244,68,46,0.12)', color: '#F4442E' } :
                    { background: 'rgba(252,158,79,0.15)', color: '#FC9E4F' }
                  }>{r.action.toUpperCase()}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{r.fund} — {fmt(r.amount)}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#6B6C8A' }}>{r.reason}</p>
                  </div>
                  <span className="text-xs h-fit" style={{ color: r.priority === 'high' ? '#F4442E' : r.priority === 'medium' ? '#FC9E4F' : '#6B6C8A' }}>
                    {r.priority}
                  </span>
                </div>
              ))}
            </div>
          </ResultCard>
        </div>
      )}
    </div>
  )
}
