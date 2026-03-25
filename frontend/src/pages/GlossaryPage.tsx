import { useState } from 'react'

const GLOSSARY_TERMS = [
  {
    category: 'Investments',
    terms: [
      {
        term: 'SIP',
        full: 'Systematic Investment Plan',
        simple: 'A way to invest a fixed amount every month automatically — like a recurring deposit but into mutual funds. Starting small (even ₹500/month) and staying consistent builds significant wealth over time thanks to compounding.',
        example: 'Investing ₹10,000/month via SIP in an equity fund at 12% annual return for 20 years grows to ~₹1 Crore.',
        icon: '📅',
      },
      {
        term: 'Mutual Fund',
        full: 'Mutual Fund',
        simple: 'A pool of money collected from many investors and managed by a professional fund manager who invests it in stocks, bonds, or other assets. You buy "units" of the fund.',
        example: 'Instead of picking 50 stocks yourself, a mutual fund does it for you with just ₹500.',
        icon: '🏦',
      },
      {
        term: 'ELSS',
        full: 'Equity Linked Savings Scheme',
        simple: 'A type of mutual fund that invests mainly in stocks AND gives you a tax deduction of up to ₹1.5 lakh under Section 80C. It has a 3-year lock-in (shortest among tax-saving instruments).',
        example: 'Invest ₹1.5L in ELSS → save up to ₹46,800 in taxes (at 30% bracket) + get equity returns.',
        icon: '💸',
      },
      {
        term: 'NAV',
        full: 'Net Asset Value',
        simple: 'The price of one unit of a mutual fund — calculated by dividing the total value of the fund\'s investments by the number of units. Like the share price of a mutual fund.',
        example: 'If a fund has ₹100 Cr in assets and 1 Cr units, its NAV = ₹100.',
        icon: '🏷️',
      },
      {
        term: 'Expense Ratio',
        full: 'Expense Ratio',
        simple: 'The annual fee a mutual fund charges you as a percentage of your investment. A lower expense ratio means more money stays invested and compounds for you. Direct plans have lower expense ratios than regular plans.',
        example: '₹10L invested at 1.5% expense ratio = ₹15,000/year silently deducted. Switching to a 0.5% direct plan saves ₹10,000/year.',
        icon: '📊',
      },
      {
        term: 'Direct vs Regular Plan',
        full: 'Direct vs Regular Mutual Fund Plan',
        simple: 'Regular plans are bought through a distributor/agent who gets a commission (paid by you via higher expense ratio). Direct plans are bought directly from the fund house — same fund, lower fees, higher returns over time.',
        example: 'Over 20 years, a 1% difference in expense ratio on ₹10L can cost you ₹15-20L in lost returns.',
        icon: '🔄',
      },
      {
        term: 'XIRR',
        full: 'Extended Internal Rate of Return',
        simple: 'The true annualised return on your investments when you\'ve made multiple investments at different times (like SIPs). More accurate than simple return % because it accounts for when each rupee was invested.',
        example: 'If you invested ₹5L in SIPs over 3 years and it\'s now ₹7L, XIRR tells you the actual annual return rate (not just 40% total).',
        icon: '📈',
      },
      {
        term: 'CAGR',
        full: 'Compound Annual Growth Rate',
        simple: 'The average yearly growth rate of an investment over multiple years, assuming profits are reinvested. It\'s the "smoothed out" annual return.',
        example: 'If ₹1L grew to ₹2L in 6 years, CAGR = ~12.2% per year.',
        icon: '📐',
      },
    ],
  },
  {
    category: 'Tax & Savings',
    terms: [
      {
        term: 'Section 80C',
        full: 'Income Tax Act Section 80C',
        simple: 'A section of the Indian Income Tax Act that allows you to deduct up to ₹1.5 lakh from your taxable income by investing in approved instruments — EPF, PPF, ELSS, life insurance premium, home loan principal, NSC, etc.',
        example: 'If your salary is ₹10L and you invest ₹1.5L under 80C, you are taxed on only ₹8.5L.',
        icon: '🧾',
      },
      {
        term: 'Section 80D',
        full: 'Income Tax Act Section 80D',
        simple: 'Tax deduction for health insurance premiums paid for yourself and your family. Up to ₹25,000 for self + ₹25,000 for parents (₹50,000 if parents are senior citizens).',
        example: 'Pay ₹15,000 health insurance premium → save ₹4,500 in tax (at 30% bracket).',
        icon: '🏥',
      },
      {
        term: 'HRA',
        full: 'House Rent Allowance',
        simple: 'A component of your salary that helps pay rent — and partially or fully exempt from income tax if you actually pay rent. The exemption is the minimum of: actual HRA received, 50% of basic salary (metro) or 40% (non-metro), or rent paid minus 10% of basic salary.',
        example: 'If HRA received = ₹2L, rent paid = ₹1.8L, basic salary = ₹6L (metro): exempt = min(₹2L, ₹3L, ₹1.2L) = ₹1.2L.',
        icon: '🏠',
      },
      {
        term: 'PPF',
        full: 'Public Provident Fund',
        simple: 'A government-backed savings scheme with a 15-year lock-in. Currently offers ~7.1% interest per year, tax-free. Contributions qualify for 80C deduction. Completely safe since backed by the government of India.',
        example: 'Invest ₹1.5L/year in PPF for 15 years → corpus of ~₹40L, all tax-free.',
        icon: '🏛️',
      },
      {
        term: 'NPS',
        full: 'National Pension System',
        simple: 'A government pension scheme where you invest during your working years and get a pension after retirement. Extra benefit: ₹50,000 additional tax deduction under Section 80CCD(1B) — over and above the ₹1.5L 80C limit.',
        example: 'Invest ₹50K in NPS → get extra ₹15,000 tax saving (at 30% bracket) beyond 80C.',
        icon: '👴',
      },
      {
        term: 'Form 16',
        full: 'Form 16 — TDS Certificate',
        simple: 'A certificate your employer gives you each year showing your total salary and the TDS (tax deducted at source) already deducted from your pay. It\'s the main document you need for filing your income tax return.',
        example: 'FinSage can read your Form 16 PDF and instantly calculate whether old or new tax regime saves you more money.',
        icon: '📋',
      },
      {
        term: 'Old vs New Tax Regime',
        full: 'Old vs New Tax Regime (FY 2024-25)',
        simple: 'India offers two ways to calculate your income tax. The OLD regime allows many deductions (80C, HRA, 80D, home loan) but has higher slab rates. The NEW regime has lower slab rates but almost no deductions. You must choose one each year.',
        example: 'If you have lots of investments (80C full, NPS, HRA, insurance) → old regime usually wins. If you have no investments → new regime usually wins.',
        icon: '⚖️',
      },
    ],
  },
  {
    category: 'Financial Planning',
    terms: [
      {
        term: 'FIRE',
        full: 'Financial Independence, Retire Early',
        simple: 'A lifestyle movement where you aggressively save and invest during your working years so you can stop working — or choose to work — much earlier than the traditional retirement age of 60. The math: accumulate 25x your annual expenses (the "4% rule").',
        example: 'If you spend ₹8L/year, your FIRE number = ₹2 Crore. Once your investments reach ₹2Cr, you can live off 4% (₹8L/year) without ever running out of money.',
        icon: '🔥',
      },
      {
        term: 'Corpus',
        full: 'Corpus (Investment Corpus)',
        simple: 'The total accumulated value of all your investments. In retirement planning, "retirement corpus" means the total savings you need before you can retire comfortably.',
        example: '"My retirement corpus goal is ₹5 Crore by age 55."',
        icon: '🏆',
      },
      {
        term: 'Emergency Fund',
        full: 'Emergency Fund',
        simple: 'A reserve of 3-6 months of your monthly expenses kept in a liquid, easily accessible account (savings account or liquid mutual fund). It\'s your financial safety net for job loss, medical emergencies, or unexpected expenses.',
        example: 'Monthly expenses = ₹50,000 → Emergency fund target = ₹1.5L to ₹3L in a savings account.',
        icon: '🛡️',
      },
      {
        term: 'Asset Allocation',
        full: 'Asset Allocation',
        simple: 'How you divide your investments across different types of assets — equity (stocks/mutual funds), debt (FD/bonds/PPF), gold, and real estate. Different assets behave differently in different market conditions.',
        example: 'A common rule: 100 minus your age = % in equity. Age 30 → 70% equity, 30% debt.',
        icon: '🥧',
      },
      {
        term: 'Safe Withdrawal Rate',
        full: 'Safe Withdrawal Rate (SWR)',
        simple: 'The percentage of your retirement corpus you can withdraw each year without running out of money over a 30+ year retirement. The globally accepted rate is 4% (the "4% rule"). For India, 3.5% is safer due to higher inflation.',
        example: 'Corpus = ₹2Cr → Safe annual withdrawal = ₹8L (4%) or ₹7L (3.5%).',
        icon: '🚿',
      },
      {
        term: 'Inflation',
        full: 'Inflation',
        simple: 'The rate at which prices rise over time, reducing the purchasing power of your money. India\'s long-term average inflation is ~6-7%. This is why ₹1L today won\'t buy the same things 10 years from now.',
        example: '₹50,000/month expenses today = ~₹95,000/month in 10 years at 6.5% inflation.',
        icon: '📉',
      },
      {
        term: 'Compounding',
        full: 'Compound Interest / Compounding',
        simple: 'Earning returns on your returns. When your investment grows, next year\'s returns are calculated on the larger amount. Over long periods, compounding creates exponential growth — which is why starting early matters so much.',
        example: '₹1L at 12%/year: Year 1 = ₹1.12L, Year 10 = ₹3.1L, Year 20 = ₹9.6L, Year 30 = ₹30L.',
        icon: '❄️',
      },
    ],
  },
  {
    category: 'Insurance',
    terms: [
      {
        term: 'Term Insurance',
        full: 'Term Life Insurance',
        simple: 'Pure life insurance with no investment component. You pay a small annual premium; your family gets a large sum if you die during the policy term. This is the ONLY life insurance most people need. Rule of thumb: cover = 10x annual income.',
        example: 'For ₹15L annual income, buy ₹1.5Cr term cover. Costs only ~₹12,000-15,000/year for a 30-year-old.',
        icon: '🛡️',
      },
      {
        term: 'Health Insurance',
        full: 'Health Insurance / Mediclaim',
        simple: 'Covers hospitalisation and medical expenses. Essential because a single medical emergency can wipe out years of savings. Recommended: ₹10L+ individual cover or a family floater plan.',
        example: 'A basic ₹5L health plan costs ~₹10,000-15,000/year but covers lakhs in hospital bills.',
        icon: '🏥',
      },
    ],
  },
  {
    category: 'Market Terms',
    terms: [
      {
        term: 'LTCG',
        full: 'Long Term Capital Gains',
        simple: 'The profit from selling an investment held for more than a year. For equity mutual funds: gains above ₹1 lakh per year are taxed at 10% (no indexation). For debt funds: taxed at 20% with indexation.',
        example: 'Sell equity mutual funds and earn ₹2L profit (held >1 year) → tax = 10% on ₹1L (after the free ₹1L) = ₹10,000.',
        icon: '📊',
      },
      {
        term: 'STCG',
        full: 'Short Term Capital Gains',
        simple: 'Profit from selling equity investments held for less than one year. Taxed at 15% regardless of income slab.',
        example: 'Buy MF units and sell within 12 months with ₹1L profit → tax = ₹15,000 (15%).',
        icon: '⚡',
      },
      {
        term: 'CAMS Statement',
        full: 'Computer Age Management Services Statement',
        simple: 'A consolidated statement of all your mutual fund investments across different fund houses — in one PDF. You can get it free from the CAMS website. FinSage\'s Portfolio X-Ray can read this to analyse your full portfolio.',
        example: 'Download your CAMS statement → upload to Portfolio X-Ray → get instant XIRR and overlap analysis.',
        icon: '📄',
      },
      {
        term: 'Benchmark',
        full: 'Benchmark Index',
        simple: 'A market index used to compare your fund\'s performance. If your large-cap fund returns 10% but Nifty 50 returned 13%, your fund underperformed. Common benchmarks: Nifty 50 (large-cap), Nifty Midcap 150 (mid-cap), Nifty Smallcap 250 (small-cap).',
        example: 'Always compare a fund\'s XIRR to its benchmark before deciding to continue or switch.',
        icon: '🎯',
      },
    ],
  },
]

export default function GlossaryPage() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const categories = ['All', ...GLOSSARY_TERMS.map(g => g.category)]

  const filtered = GLOSSARY_TERMS.map(group => ({
    ...group,
    terms: group.terms.filter(t => {
      const matchesSearch = search === '' ||
        t.term.toLowerCase().includes(search.toLowerCase()) ||
        t.full.toLowerCase().includes(search.toLowerCase()) ||
        t.simple.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = activeCategory === 'All' || group.category === activeCategory
      return matchesSearch && matchesCategory
    }),
  })).filter(g => g.terms.length > 0)

  const totalTerms = GLOSSARY_TERMS.reduce((sum, g) => sum + g.terms.length, 0)

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold" style={{ color: '#020122' }}>📖 Finance Glossary</h1>
        <p className="mt-1" style={{ color: '#6B6C8A' }}>
          Plain-English explanations of {totalTerms} financial terms used in FinSage — no jargon, no confusion.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#6B6C8A' }}>🔍</span>
        <input
          type="text"
          placeholder="Search terms... e.g. FIRE, SIP, 80C, XIRR"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none"
          style={{ background: '#FEFEF5', border: '1.5px solid #EDD382', color: '#020122' }}
        />
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="px-4 py-1.5 rounded-full text-xs font-medium transition-all"
            style={activeCategory === cat
              ? { background: '#F4442E', color: 'white', border: '1.5px solid #F4442E' }
              : { background: '#FFFBEA', border: '1.5px solid #EDD382', color: '#020122' }
            }
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Terms */}
      {filtered.length === 0 ? (
        <div className="text-center py-12" style={{ color: '#6B6C8A' }}>
          No terms found for "{search}". Try a different search.
        </div>
      ) : (
        filtered.map(group => (
          <div key={group.category} className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: '#F4442E' }}>{group.category}</h2>
            <div className="space-y-3">
              {group.terms.map(term => (
                <div key={term.term} className="rounded-xl p-5 glossary-card transition-colors" style={{ background: '#FFFBEA', border: '1.5px solid #EDD382' }}>
                  <div className="flex items-start gap-4">
                    <span className="text-2xl shrink-0 mt-0.5">{term.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <h3 className="text-base font-bold" style={{ color: '#020122' }}>{term.term}</h3>
                        {term.full !== term.term && (
                          <span className="text-xs" style={{ color: '#6B6C8A' }}>— {term.full}</span>
                        )}
                      </div>
                      <p className="text-sm mt-2 leading-relaxed" style={{ color: '#6B6C8A' }}>{term.simple}</p>
                      <div className="mt-3 rounded-lg p-3" style={{ background: 'rgba(244,68,46,0.07)', border: '1px solid rgba(244,68,46,0.2)' }}>
                        <p className="text-xs" style={{ color: '#020122' }}><span className="font-semibold" style={{ color: '#F4442E' }}>Example: </span>{term.example}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      <div className="rounded-xl p-6 text-center" style={{ background: 'linear-gradient(135deg, #EDD382 0%, #FC9E4F 100%)', border: '1.5px solid #EDD382' }}>
        <p className="text-sm" style={{ color: '#020122' }}>
          Still confused about a term? All 6 tools in FinSage explain concepts in plain language as you use them.
          <br />Start with the{' '}
          <a href="/health-score" className="hover:underline font-semibold" style={{ color: '#020122' }}>Money Health Score</a>{' '}
          — it's the easiest entry point.
        </p>
      </div>
    </div>
  )
}
