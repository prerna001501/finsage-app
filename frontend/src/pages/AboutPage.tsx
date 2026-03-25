import { useNavigate } from 'react-router-dom'

const FEATURES_DETAIL = [
  { icon: '💊', name: 'Money Health Score', desc: '6-dimension financial health assessment with personalised priority actions.' },
  { icon: '🔥', name: 'FIRE Path Planner', desc: 'Corpus calculation, SIP targets, and year-by-year projection chart.' },
  { icon: '🧾', name: 'Smart Tax Wizard', desc: 'Old vs new regime comparison with missed deductions recovery.' },
  { icon: '📊', name: 'MF Portfolio X-Ray', desc: 'XIRR analysis, fund overlap detection, and expense ratio audit.' },
  { icon: '🎯', name: 'Life Event Advisor', desc: '30/60/90-day plans for marriage, baby, job change, bonus, and more.' },
  { icon: '💑', name: "Couple's Planner", desc: 'Joint HRA optimisation, NPS strategy, and goal-based SIP split.' },
]

const HOW_IT_WORKS = [
  { step: '1', title: 'You enter your data', desc: 'Fill in a simple form or upload a PDF (Form 16 / CAMS statement). Sample data is available for every tool so you can demo instantly.', icon: '📝' },
  { step: '2', title: 'Python does the math', desc: 'Our backend calculates XIRR, tax under both regimes, SIP projections, and expense ratios using exact formulas — no guesswork.', icon: '🔢' },
  { step: '3', title: 'AI adds the insight', desc: 'Llama 3.3-70B (by Meta, open-source) analyses your computed numbers and generates personalised recommendations, priorities, and action plans.', icon: '🤖' },
  { step: '4', title: 'You get a clear plan', desc: 'Visualised results with charts, ranked priorities, and specific next steps — not generic advice, but tailored to your actual numbers.', icon: '✅' },
]

export default function AboutPage() {
  const navigate = useNavigate()

  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      {/* Hero */}
      <div className="text-center space-y-4 py-6">
        <div className="flex items-center justify-center gap-3">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg" style={{ background: 'linear-gradient(135deg, #F4442E, #FC9E4F)', color: '#020122' }}>F</div>
          <h1 className="text-4xl font-extrabold gradient-text">FinSage</h1>
        </div>
        <p className="text-xl font-medium" style={{ color: '#020122' }}>Your AI-Powered Personal Finance Advisor</p>
        <p className="max-w-2xl mx-auto leading-relaxed" style={{ color: '#6B6C8A' }}>
          FinSage makes professional-grade financial planning accessible to every Indian — for free.
          No confusing jargon. No expensive advisors. Just clear, actionable guidance powered by AI.
        </p>
      </div>

      {/* The Problem */}
      <div className="rounded-2xl p-8 shadow-sm" style={{ background: '#FFFBEA', border: '1.5px solid #EDD382' }}>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><span>🎯</span> The Problem We're Solving</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { stat: '95%', desc: 'of Indians have no formal financial plan', color: '#F4442E' },
            { stat: '₹25,000+', desc: 'is the annual cost of a human financial advisor — unaffordable for most', color: '#F4442E' },
            { stat: '₹38,000', desc: 'average annual tax savings missed by salaried Indians due to unawareness', color: '#16A34A' },
          ].map(item => (
            <div key={item.stat} className="text-center p-4 rounded-xl" style={{ background: '#FFFBEA', border: '1.5px solid #EDD382' }}>
              <div className="text-3xl font-extrabold" style={{ color: item.color }}>{item.stat}</div>
              <p className="text-sm mt-2 leading-relaxed" style={{ color: '#6B6C8A' }}>{item.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-sm mt-6 leading-relaxed" style={{ color: '#6B6C8A' }}>
          Most Indians — salaried professionals, small business owners, young earners — never get personalised financial advice
          because it's either too expensive or too complicated. FinSage bridges this gap by combining real financial mathematics
          with the conversational power of AI to deliver advisor-quality guidance at zero cost.
        </p>
      </div>

      {/* What FinSage Does */}
      <div>
        <h2 className="text-xl font-bold mb-5 flex items-center gap-2"><span>⚡</span> What FinSage Does</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FEATURES_DETAIL.map(f => (
            <div key={f.name} className="flex gap-4 p-4 rounded-xl" style={{ background: '#FFFBEA', border: '1.5px solid #EDD382' }}>
              <span className="text-2xl shrink-0">{f.icon}</span>
              <div>
                <p className="font-semibold text-sm" style={{ color: '#020122' }}>{f.name}</p>
                <p className="text-xs mt-1 leading-relaxed" style={{ color: '#6B6C8A' }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div>
        <h2 className="text-xl font-bold mb-5 flex items-center gap-2"><span>⚙️</span> How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {HOW_IT_WORKS.map(step => (
            <div key={step.step} className="flex gap-4 p-5 rounded-xl" style={{ background: '#FFFBEA', border: '1.5px solid #EDD382' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0" style={{ background: 'rgba(244,68,46,0.1)', border: '1px solid rgba(244,68,46,0.25)', color: '#F4442E' }}>
                {step.step}
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: '#020122' }}>{step.title}</p>
                <p className="text-xs mt-1 leading-relaxed" style={{ color: '#6B6C8A' }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technology */}
      <div className="rounded-2xl p-8 shadow-sm" style={{ background: '#FFFBEA', border: '1.5px solid #EDD382' }}>
        <h2 className="text-xl font-bold mb-5 flex items-center gap-2"><span>🛠️</span> Technology</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'FastAPI', desc: 'Python backend', icon: '⚡', color: '#16A34A' },
            { name: 'Llama 3.3-70B', desc: 'AI by Meta (open-source)', icon: '🤖', color: '#FC9E4F' },
            { name: 'React + Vite', desc: 'Frontend', icon: '⚛️', color: '#F4442E' },
            { name: 'Recharts', desc: 'Data visualisation', icon: '📊', color: '#FC9E4F' },
          ].map(tech => (
            <div key={tech.name} className="text-center p-4 rounded-xl" style={{ background: '#FFFBEA', border: '1.5px solid #EDD382' }}>
              <span className="text-2xl">{tech.icon}</span>
              <p className="font-semibold text-sm mt-2" style={{ color: tech.color }}>{tech.name}</p>
              <p className="text-xs mt-1" style={{ color: '#6B6C8A' }}>{tech.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 p-4 rounded-xl" style={{ background: 'rgba(244,68,46,0.06)', border: '1px solid rgba(244,68,46,0.15)' }}>
          <p className="text-sm" style={{ color: '#F4442E' }}>
            <span className="font-semibold">🔒 Privacy: </span>
            FinSage does not store any of your financial data. All calculations happen in your browser session.
            Your data is sent to the AI only to generate advice and is not retained.
          </p>
        </div>
      </div>

      {/* Who is it for */}
      <div>
        <h2 className="text-xl font-bold mb-5 flex items-center gap-2"><span>👥</span> Who Is FinSage For?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: '💼', title: 'Salaried Professionals', desc: 'Understand your Form 16, optimise your tax regime, and make the most of your 80C/80D limits.' },
            { icon: '🎓', title: 'Young Earners', desc: 'Just started earning? FinSage helps you build an emergency fund, start SIPs, and plan for financial independence from day one.' },
            { icon: '👨‍👩‍👧', title: 'Families', desc: 'Plan for your child\'s education, optimise joint finances, review insurance, and ensure you\'re saving enough for retirement.' },
          ].map(item => (
            <div key={item.title} className="rounded-xl p-5 shadow-sm text-center" style={{ background: '#FFFBEA', border: '1.5px solid #EDD382' }}>
              <span className="text-3xl">{item.icon}</span>
              <h3 className="font-semibold mt-3 mb-2" style={{ color: '#020122' }}>{item.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: '#6B6C8A' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="rounded-xl p-5" style={{ background: '#FFF7ED', border: '1.5px solid #FC9E4F' }}>
        <p className="text-xs leading-relaxed" style={{ color: '#020122' }}>
          <span className="font-semibold" style={{ color: '#F4442E' }}>⚠️ Disclaimer: </span>
          FinSage provides educational and informational financial guidance only. It does not constitute professional financial, tax, or investment advice.
          All suggestions are based on general principles and AI analysis of the data you provide. For major financial decisions, please consult a
          SEBI-registered investment advisor or certified financial planner.
        </p>
      </div>

      {/* CTA */}
      <div className="text-center space-y-4 rounded-2xl p-10" style={{ background: '#020122' }}>
        <h2 className="text-xl font-bold" style={{ color: '#EDD382' }}>Ready to take control of your finances?</h2>
        <p className="text-sm" style={{ color: '#6B6C8A' }}>Start free. No signup. No data stored.</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={() => navigate('/health-score')}
            className="text-white font-semibold px-8 py-3 rounded-xl transition-all shadow-lg"
            style={{ background: '#F4442E', boxShadow: '0 8px 24px rgba(244,68,46,0.35)' }}
          >
            Check My Financial Health →
          </button>
          <button
            onClick={() => navigate('/glossary')}
            className="font-semibold px-8 py-3 rounded-xl transition-all"
            style={{ border: '2px solid #EDD382', color: '#EDD382', background: 'transparent' }}
          >
            📖 Browse Glossary
          </button>
        </div>
      </div>
    </div>
  )
}
