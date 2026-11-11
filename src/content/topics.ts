import type { ContentCategory } from './types'

/**
 * The education hub's five topics. Each has one hub page (the topic's pillar), the articles in its
 * category, and the free tools that answer its questions with your own numbers.
 */
export interface Topic {
  id: string
  title: string
  /** Showcase heading: gradient accent word + the rest. */
  accent: string
  headline: string
  /** The question this topic answers, used as the section's heading (AEO). */
  question: string
  intro: string
  hub: string
  categories: ContentCategory[]
  tools: string[]
}

export const TOPICS: Topic[] = [
  {
    id: 'budgeting',
    accent: 'Budget',
    headline: 'your salary',
    title: 'Budgeting',
    question: 'How do I make my salary last the whole month?',
    intro: 'Plan payments first, set limits for everyday spending, and know your safe daily amount.',
    hub: '/budgeting',
    categories: ['Budgeting'],
    tools: ['/calculators/budget'],
  },
  {
    id: 'expenses',
    accent: 'Track',
    headline: 'your spending',
    title: 'Expenses',
    question: 'Where is my money actually going?',
    intro: 'Track every expense, sort needs from wants, and catch overspending before the month ends.',
    hub: '/expense-tracker',
    categories: ['Expense tracking'],
    tools: ['/calculators/budget', '/financial-health'],
  },
  {
    id: 'debt',
    accent: 'Clear',
    headline: 'your debt',
    title: 'Debt management',
    question: 'How do I get out of debt, and stay out?',
    intro: 'List every loan, stop new borrowing, and pay down the right loan first, towards a real debt-free date.',
    hub: '/debt-management',
    categories: ['Debt'],
    tools: ['/calculators/debt-payoff'],
  },
  {
    id: 'saving',
    accent: 'Grow',
    headline: 'your savings',
    title: 'Saving',
    question: 'How can I save on a salary that already feels too small?',
    intro: 'Pay yourself first, build an emergency fund, and use sinking funds for big known costs like school fees.',
    hub: '/saving-money',
    categories: ['Saving'],
    tools: ['/calculators/savings', '/calculators/savings-goal', '/calculators/emergency-fund'],
  },
  {
    id: 'independence',
    accent: 'Reach',
    headline: 'financial freedom',
    title: 'Financial independence',
    question: 'What does financial freedom take, and when could work become optional?',
    intro: 'The stages from not borrowing to get by, to debt-free, to savings that give you choices.',
    hub: '/financial-freedom',
    categories: ['Financial freedom'],
    tools: ['/calculators/financial-freedom', '/financial-health'],
  },
]
