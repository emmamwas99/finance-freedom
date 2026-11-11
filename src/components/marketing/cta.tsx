import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { TRIAL_DAYS } from '@/lib/plans'

export function CtaBanner({ title = 'Start next month with a plan.', text = 'It takes two minutes to list what you must pay. Free to start, with a 14-day Pro trial.' }: { title?: string; text?: string }) {
  return (
    <section className="rounded-2xl bg-navy px-6 py-10 text-white sm:px-10">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-semibold">{title}</h2>
          <p className="mt-1 max-w-xl text-white/80">{text}</p>
        </div>
        <Link href="/signup" prefetch={false} className="inline-flex h-12 shrink-0 items-center gap-2 rounded-lg bg-primary px-6 text-base font-medium text-white hover:bg-primary/90">
          Start free: {TRIAL_DAYS} days of Pro <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  )
}
