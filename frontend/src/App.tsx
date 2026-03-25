import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import PageWrapper from './components/layout/PageWrapper'
import HomePage from './pages/HomePage'
import HealthScorePage from './pages/HealthScorePage'
import FirePlannerPage from './pages/FirePlannerPage'
import TaxWizardPage from './pages/TaxWizardPage'
import PortfolioXrayPage from './pages/PortfolioXrayPage'
import LifeEventsPage from './pages/LifeEventsPage'
import CouplePlannerPage from './pages/CouplePlannerPage'
import GlossaryPage from './pages/GlossaryPage'
import AboutPage from './pages/AboutPage'
import AskFinSagePage from './pages/AskFinSagePage'
import CalculatorsPage from './pages/CalculatorsPage'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen font-sans" style={{ backgroundColor: '#F2F3AE', backgroundImage: 'radial-gradient(ellipse at 10% 10%, rgba(252,158,79,0.12) 0%, transparent 50%), radial-gradient(ellipse at 90% 90%, rgba(244,68,46,0.06) 0%, transparent 50%)' }}>
        <Navbar />
        <PageWrapper>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/health-score" element={<HealthScorePage />} />
            <Route path="/fire-planner" element={<FirePlannerPage />} />
            <Route path="/tax-wizard" element={<TaxWizardPage />} />
            <Route path="/portfolio-xray" element={<PortfolioXrayPage />} />
            <Route path="/life-events" element={<LifeEventsPage />} />
            <Route path="/couple-planner" element={<CouplePlannerPage />} />
            <Route path="/ask" element={<AskFinSagePage />} />
            <Route path="/calculators" element={<CalculatorsPage />} />
            <Route path="/glossary" element={<GlossaryPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PageWrapper>
      </div>
    </BrowserRouter>
  )
}
