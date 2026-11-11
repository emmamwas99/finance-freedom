import { z } from 'zod'

const signup = z.object({
  email: z.email('Enter a valid email address.'),
  password: z.string().min(8, 'Use at least 8 characters.'),
  name: z.string().trim().min(1, 'Enter your name.').max(100, 'Name is too long.'),
  expectedIncome: z.number().finite().nonnegative('Income cannot be negative.'),
})

export function validateSignup(value: z.input<typeof signup>) {
  const result = signup.safeParse(value)
  if (!result.success) throw new Error(result.error.issues[0]?.message ?? 'Check your details.')
  return result.data
}
