import { Link, useLocation } from 'react-router-dom'

const NAV_ITEMS = [
  { path: '/health-score', label: '💊 Health Score' },
  { path: '/fire-planner', label: '🔥 FIRE Planner' },
  { path: '/tax-wizard', label: '🧾 Tax Wizard' },
  { path: '/portfolio-xray', label: '📊 Portfolio X-Ray' },
  { path: '/life-events', label: '🎯 Life Events' },
  { path: '/couple-planner', label: '💑 Couple Planner' },
  { path: '/ask', label: '💬 Ask AI' },
  { path: '/calculators', label: '🧮 Calculators' },
  { path: '/glossary', label: '📖 Glossary' },
  { path: '/about', label: 'ℹ️ About' },
]

export default function Navbar() {
  const location = useLocation()
  return (
    <nav className="sticky top-0 z-50" style={{ background: '#020122' }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-6 h-16">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shadow-md" style={{ background: 'linear-gradient(135deg, #F4442E, #FC9E4F)', color: '#020122' }}>F</div>
            <span className="text-xl font-bold" style={{ background: 'linear-gradient(135deg, #F4442E, #FC9E4F)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>FinSage</span>
          </Link>
          <div className="flex items-center gap-0.5 overflow-x-auto">
            {NAV_ITEMS.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className="px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all"
                style={location.pathname === item.path
                  ? { background: '#F4442E', color: '#FFFFFF', fontWeight: 600 }
                  : { color: '#EDD382', hover: undefined }
                }
                onMouseEnter={e => { if (location.pathname !== item.path) (e.target as HTMLElement).style.color = '#FC9E4F' }}
                onMouseLeave={e => { if (location.pathname !== item.path) (e.target as HTMLElement).style.color = '#EDD382' }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
