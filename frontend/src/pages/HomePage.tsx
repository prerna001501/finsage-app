import { useNavigate } from 'react-router-dom'

const FEATURES = [
  {
    path: '/health-score',
    icon: '💊',
    title: 'Money Health Score',
    description: 'Get a 360° financial health check across 6 dimensions — emergency fund, debt, investments, insurance, retirement, and tax efficiency.',
    color: '#F4442E',
    tag: 'Start Here',
  },
  {
    path: '/fire-planner',
    icon: '🔥',
    title: 'FIRE Path Planner',
    description: 'Calculate exactly how much corpus you need for financial independence. Get your monthly SIP target and a year-by-year growth projection.',
    color: '#FC9E4F',
    tag: 'Plan',
  },
  {
    path: '/tax-wizard',
    icon: '🧾',
    title: 'Smart Tax Wizard',
    description: 'Upload your Form 16 or enter salary details. Get instant old vs new regime comparison and discover deductions you may have missed.',
    color: '#16A34A',
    tag: 'Save ₹38K avg',
  },
  {
    path: '/portfolio-xray',
    icon: '📊',
    title: 'MF Portfolio X-Ray',
    description: 'Deep-dive into your mutual fund portfolio. Calculates real XIRR returns, detects fund overlap, and reveals hidden expense ratio drag.',
    color: '#F4442E',
    tag: 'Optimize',
  },
  {
    path: '/life-events',
    icon: '🎯',
    title: 'Life Event Advisor',
    description: 'Marriage, new baby, job change, bonus, retirement or home purchase — get a personalised 30/60/90-day financial action plan.',
    color: '#FC9E4F',
    tag: 'Smart',
  },
  {
    path: '/couple-planner',
    icon: '💑',
    title: "Couple's Money Planner",
    description: 'Optimise finances together. HRA split, joint NPS contributions, SIP allocation by goal, and insurance gap analysis — all in one place.',
    color: '#16A34A',
    tag: 'India First',
  },
]

const IMPACT_STATS = [
  { value: '₹38K', label: 'Avg tax savings/user', icon: '💰' },
  { value: '₹8K', label: 'Expense drag saved/yr', icon: '📉' },
  { value: '₹0', label: 'vs ₹25K advisor fee', icon: '🎁' },
  { value: '95%', label: 'Indians without a plan', icon: '🇮🇳' },
]

export default function HomePage() {
  const navigate = useNavigate()
  return (
    <div className="space-y-14">
      {/* Hero */}
      <div className="text-center space-y-5 py-10">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg" style={{ background: 'linear-gradient(135deg, #F4442E, #FC9E4F)', color: '#020122' }}>F</div>
          <span className="text-4xl font-extrabold gradient-text">FinSage</span>
        </div>
        <h1 className="text-5xl font-extrabold leading-tight" style={{ color: '#020122' }}>
          Your Personal<br />
          <span className="gradient-text">AI Finance Advisor</span>
        </h1>
        <p className="text-xl max-w-2xl mx-auto leading-relaxed" style={{ color: '#6B6C8A' }}>
          Six powerful tools. Real AI analysis. Zero advisor fees.<br />
          Built for every Indian who deserves a financial plan.
        </p>
        <div className="flex gap-4 justify-center pt-2 flex-wrap">
          <button
            onClick={() => navigate('/health-score')}
            className="text-white font-semibold px-8 py-3 rounded-xl transition-all shadow-lg"
            style={{ background: '#F4442E', boxShadow: '0 8px 24px rgba(244,68,46,0.25)' }}
          >
            Check My Financial Health →
          </button>
          <button
            onClick={() => navigate('/glossary')}
            className="font-semibold px-8 py-3 rounded-xl transition-all"
            style={{ border: '2px solid #FC9E4F', color: '#FC9E4F', background: 'transparent' }}
          >
            📖 Finance Glossary
          </button>
        </div>
        <p className="text-xs mt-2" style={{ color: '#6B6C8A' }}>
          Powered by <span style={{ color: '#FC9E4F' }}>Llama 3.3 — 70B</span> (Meta Open Source) · No data stored · Private by design
        </p>
      </div>

      {/* Impact stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {IMPACT_STATS.map(stat => (
          <div key={stat.label} className="rounded-xl p-5 text-center shadow-sm card-hover" style={{ background: '#FFFBEA', border: '1.5px solid #EDD382' }}>
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold" style={{ color: '#F4442E' }}>{stat.value}</div>
            <div className="text-xs mt-1" style={{ color: '#6B6C8A' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Feature grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold" style={{ color: '#020122' }}>6 AI-Powered Tools</h2>
          <button onClick={() => navigate('/about')} className="text-sm transition-colors" style={{ color: '#FC9E4F' }}>
            Learn how it works →
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(f => (
            <div
              key={f.path}
              onClick={() => navigate(f.path)}
              className="rounded-xl p-6 shadow-sm cursor-pointer card-hover group"
              style={{ background: '#FFFBEA', border: '1.5px solid #EDD382' }}
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-3xl">{f.icon}</span>
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: f.color + '18', color: f.color }}
                >
                  {f.tag}
                </span>
              </div>
              <h3 className="text-base font-semibold mb-2 transition-colors" style={{ color: '#020122' }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#6B6C8A' }}>{f.description}</p>
              <div className="mt-4 text-sm font-medium flex items-center gap-1 transition-colors" style={{ color: '#FC9E4F' }}>
                Get Started <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New to finance? */}
      <div
        onClick={() => navigate('/glossary')}
        className="rounded-2xl p-8 cursor-pointer card-hover text-center"
        style={{ background: 'linear-gradient(135deg, #EDD382 0%, #FC9E4F 100%)', border: '1px solid #EDD382' }}
      >
        <span className="text-4xl">📖</span>
        <h3 className="text-xl font-bold mt-3 mb-2" style={{ color: '#020122' }}>New to Personal Finance?</h3>
        <p className="text-sm max-w-xl mx-auto" style={{ color: '#020122', opacity: 0.75 }}>
          Not sure what FIRE, XIRR, SIP, or expense ratio means? Visit our Finance Glossary — plain-English explanations of every term used in this app.
        </p>
        <span className="inline-block mt-4 text-sm font-semibold px-5 py-2 rounded-lg" style={{ background: '#020122', color: '#EDD382' }}>Open Finance Glossary →</span>
      </div>

      {/* Footer */}
      <div className="text-center text-xs pt-6 space-y-1" style={{ color: '#020122', opacity: 0.6, borderTop: '2px solid #EDD382' }}>
        <p><span className="font-semibold" style={{ color: '#F4442E', opacity: 1 }}>FinSage</span> — AI-powered personal finance for every Indian</p>
        <p>Powered by Llama 3.3-70B (Meta) · FastAPI · React · Recharts</p>
      </div>
    </div>
  )
}
