/** Emergency fund target = essential monthly costs × months of cover. */
export interface EmergencyInput {
  essentialsPerMonth: number
  monthsOfCover: number
  currentSavings: number
  monthlySaving: number
}

export function emergencyFund(input: EmergencyInput) {
  const essentials = Math.max(0, input.essentialsPerMonth)
  const months = Math.max(0, input.monthsOfCover)
  const target = essentials * months
  const current = Math.max(0, input.currentSavings)
  const gap = Math.max(0, target - current)
  const monthly = Math.max(0, input.monthlySaving)
  const monthsToTarget = gap === 0 ? 0 : monthly > 0 ? Math.ceil(gap / monthly) : Infinity
  const coveredMonths = essentials > 0 ? current / essentials : 0
  /** First milestone: one month of essentials. */
  const starterGap = Math.max(0, essentials - current)
  return { target, gap, monthsToTarget, coveredMonths, progress: target > 0 ? Math.min(1, current / target) : 0, starterGap }
}
