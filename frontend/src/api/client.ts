import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 60000,
})

export default api

// Health Score
export const calculateHealthScore = (data: Record<string, number>) =>
  api.post('/api/v1/health-score/calculate', data).then(r => r.data)

// FIRE Planner
export const generateFirePlan = (data: Record<string, number>) =>
  api.post('/api/v1/fire-planner/generate', data).then(r => r.data)

// Tax Wizard (multipart form)
export const analyzeTax = (formData: FormData) =>
  api.post('/api/v1/tax-wizard/analyze', formData).then(r => r.data)

// Portfolio X-Ray (multipart form)
export const analyzePortfolio = (formData: FormData) =>
  api.post('/api/v1/portfolio-xray/analyze', formData).then(r => r.data)

// Life Events
export const adviseLifeEvent = (data: Record<string, unknown>) =>
  api.post('/api/v1/life-events/advise', data).then(r => r.data)

// Couple Planner
export const optimizeCouplePlan = (data: Record<string, unknown>) =>
  api.post('/api/v1/couple-planner/optimize', data).then(r => r.data)
