export const MATURITY_PROFILES = [
  { min: 5,  max: 8,  id: 'pena',     emoji: '🪶', label: 'A Pena ao Vento',       level: 'Iniciante'    },
  { min: 9,  max: 12, id: 'correndo', emoji: '👟', label: 'Começando a Correr',     level: 'Explorador'   },
  { min: 13, max: 16, id: 'corrida',  emoji: '🏃', label: 'Na Corrida',             level: 'Estrategista' },
  { min: 17, max: 20, id: 'caixa',    emoji: '🍫', label: 'Sabe o que vai na Caixa', level: 'Avançado'   },
] as const

export type MaturityProfileId = typeof MATURITY_PROFILES[number]['id']

export function getMaturityProfile(phase1Points: number) {
  return MATURITY_PROFILES.find(p => phase1Points >= p.min && phase1Points <= p.max)
    ?? MATURITY_PROFILES[0]
}

export const MAX_POINTS_PER_PHASE = 20   // 5 perguntas × 4 pts
export const MAX_POINTS_SURPRISE  = 25   // 5 perguntas × 5 pts
export const MAX_POINTS_TOTAL     = 145  // 6 × 20 + 25
