import { A, Callout, Definition, Example, Ext, Formula, Prose, Steps, Table } from '@/components/marketing/prose'
import type { Article } from '@/content/types'

export const meta: Article['meta'] = {
  slug: 'how-to-track-expenses',
  title: 'How to track your daily expenses and keep the habit',
  seoTitle: 'How to Track Daily Expenses',
  description:
    'Track daily expenses by recording each one the same day in a few clear categories, reviewing weekly and covering missed days with one untracked entry.',
  summary:
    'Record every expense the same day, ideally the moment you pay, in a short list of categories tagged as needs or wants. Do a ten-minute review each week, cover missed days with one “untracked” entry instead of giving up, and use your M-Pesa and bank statements as a monthly cross-check.',
  keyTakeaways: [
    'Same-day recording matters more than perfect recording: amount and category are enough.',
    'Use a short, stable list of categories so months can be compared.',
    'Tag each category as a need or a want to see where you have room to cut.',
    'A ten-minute weekly review catches overspending while there’s still month left.',
    'Missed a few days? Record the gap as one untracked amount and carry on.',
  ],
  keywords: [
    'how to track expenses',
    'how to track daily expenses',
    'expense tracking tips',
    'track M-Pesa spending',
    'needs vs wants list',
    'expense tracker Kenya',
  ],
  published: '2026-11-11',
  updated: '2026-11-11',
  readingMinutes: 7,
  category: 'Expense tracking',
  related: ['/guides/needs-vs-wants', '/expense-tracker', '/guides/how-to-make-a-monthly-budget', '/blog/why-you-run-out-of-money-before-payday', '/budgeting'],
  toc: [
    { id: 'why-track', label: 'Why track your expenses?' },
    { id: 'what-to-record', label: 'What to record' },
    { id: 'categories', label: 'Which categories to use' },
    { id: 'needs-vs-wants', label: 'Needs vs wants' },
    { id: 'daily-habit', label: 'Making it a daily habit' },
    { id: 'weekly-review', label: 'The weekly review' },
    { id: 'missed-days', label: 'The untracked lump sum' },
    { id: 'mpesa-cross-check', label: 'M-Pesa statements as a cross-check' },
  ],
  faq: [
    {
      q: 'What is the easiest way to track daily expenses?',
      a: 'Record each expense on your phone the moment you pay, with just the amount and a category. A budgeting app or a simple notes list both work; the habit of same-day recording matters more than the tool.',
    },
    {
      q: 'Do I need to track every shilling?',
      a: 'No. Aim to record most spending on the day, and cover any gaps with one untracked lump sum so your totals stay accurate. Detail helps, but a complete total matters more.',
    },
    {
      q: 'How do I track cash spending?',
      a: 'Either record each cash purchase as you make it, or record a cash withdrawal straight away under the categories it will be spent on, such as transport and food. Check what’s left in your wallet during your weekly review.',
    },
    {
      q: 'Is an M-Pesa statement enough to track my expenses?',
      a: 'Not on its own. A statement shows who you paid but not why, so it can’t tell a loan repayment from a gift or groceries. It works best as a monthly cross-check against your own records.',
    },
    {
      q: 'How long before tracking shows useful patterns?',
      a: 'One full month gives you a first picture of where your money goes. After two or three months you have averages you can use to set realistic spending limits.',
    },
  ],
  sources: [{ title: 'Safaricom', url: 'https://www.safaricom.co.ke/', publisher: 'Safaricom PLC' }],
}

export default function Body() {
  return (
    <Prose>
      <p>
        Tracking expenses means writing down what you spend, as you spend it, so you can see where your salary actually goes. The method matters less than the
        habit: a quick, slightly imperfect record kept every day beats a perfect spreadsheet abandoned in week two.
      </p>

      <h2 id="why-track">Why track your expenses?</h2>
      <p>
        Because a budget is only a plan, and tracking tells you whether the plan is working. Without records, the month-end question “where did the money go?”
        has no answer.
      </p>
      <p>
        The big payments are easy to remember: rent, school fees, the SACCO loan. What disappears is the small, frequent spending: matatu fares, lunch,
        airtime and data bundles, M-Pesa transaction charges, a soda here, KSh 500 sent to a cousin there. Each one is too small to notice, but together they
        can become one of the largest lines in your month. Tracking makes them visible.
      </p>
      <p>
        Tracking also gives you real numbers for your next budget. Limits based on two or three months of records are far more realistic than guesses, which
        is why it’s the natural partner to <A href="/guides/how-to-make-a-monthly-budget">making a monthly budget</A>.
      </p>

      <h2 id="what-to-record">What should you record for each expense?</h2>
      <p>Four things: the amount, the date, the category and, when it helps, a short note. That’s enough to answer almost any question later.</p>
      <ul>
        <li>
          <strong>Amount:</strong> what left your pocket, including the transaction charge if there was one.
        </li>
        <li>
          <strong>Date:</strong> the day you paid, so the expense lands in the right week and month.
        </li>
        <li>
          <strong>Category:</strong> where it belongs, such as Food &amp; Groceries or Transport.
        </li>
        <li>
          <strong>Note (optional):</strong> only when the category isn’t enough, for example “Mum’s medicine” under Family Support.
        </li>
      </ul>
      <p>You don’t need receipts, and you don’t need to list every item in a supermarket basket. One entry per payment is plenty.</p>

      <h2 id="categories">Which categories should you use?</h2>
      <p>
        Use a short list that matches how you actually live, and keep it the same from month to month so you can compare. Somewhere between 10 and 16
        categories works for most households.
      </p>
      <Table caption="A starting set of categories">
        <thead>
          <tr>
            <th>Category</th>
            <th>Type</th>
            <th>Examples</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Rent &amp; Housing</td>
            <td>Need</td>
            <td>Rent, service charge, repairs</td>
          </tr>
          <tr>
            <td>Food &amp; Groceries</td>
            <td>Need</td>
            <td>Market, supermarket, cooking gas</td>
          </tr>
          <tr>
            <td>Transport</td>
            <td>Need</td>
            <td>Matatu, boda boda, fuel, parking</td>
          </tr>
          <tr>
            <td>School Fees</td>
            <td>Need</td>
            <td>Fees, school transport, lunch programme</td>
          </tr>
          <tr>
            <td>House Help</td>
            <td>Need</td>
            <td>Monthly pay</td>
          </tr>
          <tr>
            <td>Utilities, Airtime &amp; Data</td>
            <td>Need</td>
            <td>Electricity, water, Wi-Fi, bundles</td>
          </tr>
          <tr>
            <td>Health</td>
            <td>Need</td>
            <td>Clinic, pharmacy, cover</td>
          </tr>
          <tr>
            <td>Family Support</td>
            <td>Need</td>
            <td>Parents, siblings, relatives</td>
          </tr>
          <tr>
            <td>Loan Repayments</td>
            <td>Debt</td>
            <td>SACCO, bank, mobile loans</td>
          </tr>
          <tr>
            <td>Savings</td>
            <td>Saving</td>
            <td>Emergency fund, goals</td>
          </tr>
          <tr>
            <td>Eating Out &amp; Fun</td>
            <td>Want</td>
            <td>Restaurants, outings, subscriptions</td>
          </tr>
          <tr>
            <td>Clothes &amp; Personal</td>
            <td>Want</td>
            <td>Clothes, salon, barber</td>
          </tr>
          <tr>
            <td>Miscellaneous</td>
            <td>Want</td>
            <td>Anything that doesn’t fit elsewhere</td>
          </tr>
        </tbody>
      </Table>
      <p>
        If you run a side business, keep its costs out of your household categories, or give it its own category. Otherwise you can’t tell whether the
        business is making money or quietly eating your salary.
      </p>

      <h2 id="needs-vs-wants">How do you tell needs from wants?</h2>
      <Definition term="Needs and wants">
        A need is spending you have to cover to live and work: housing, basic food, transport to work, school fees, health. A want is anything you could cut or
        downgrade without real harm.
      </Definition>
      <p>
        Plenty of spending is a bit of both. Lunch at work is a need; a lunch costing KSh 800 when one at KSh 250 would do is part need, part want. A practical rule:
        the basic version is the need, the upgrade is the want. You don’t have to split every transaction; just tag each category honestly and accept that
        some are mixed. The <A href="/glossary#needs-and-wants">glossary</A> has more examples.
      </p>
      <p>
        The point isn’t guilt. Wants are where you can move quickly when money is tight, while needs usually take months to change. Knowing which is which
        tells you where to look first.
      </p>

      <h2 id="daily-habit">How do you make tracking a daily habit?</h2>
      <p>
        Record each expense the same day, ideally the moment you pay. Same-day recording is the one rule that matters most, because memory fades fast and an
        M-Pesa message from last Tuesday rarely says what the money was for.
      </p>
      <Steps
        items={[
          {
            title: 'Record at the point of payment',
            body: 'When the M-Pesa confirmation arrives, log the expense before you put the phone away. It takes about ten seconds.',
          },
          {
            title: 'Attach it to something you already do',
            body: 'For example, on the matatu home or just before bed, scroll through the day’s messages and add anything you missed.',
          },
          {
            title: 'Make it fast',
            body: 'Keep your tracker on the home screen. Rounding to the nearest ten shillings is fine if it keeps you going.',
          },
          {
            title: 'Decide how you’ll handle cash',
            body: 'Either record each cash purchase, or record a withdrawal straight away under the categories it will be spent on, such as transport and food.',
          },
          {
            title: 'Forgive the gaps',
            body: 'Missing a day is normal. Use the untracked lump sum below instead of giving up.',
          },
        ]}
      />
      <p>
        In Finfe, adding an expense takes a few taps, and ticking a planned payment such as rent or the SACCO loan records it for you. Your records are
        encrypted and sync between your phone and computer. It’s <A href="/signup">free to start</A>.
      </p>

      <h2 id="weekly-review">What should a weekly review look like?</h2>
      <p>
        Once a week, take ten minutes to fill gaps and check each category against its limit. A weekly review catches problems while there’s still time to
        adjust, instead of at month end when the money has gone.
      </p>
      <ol>
        <li>Scroll through the week’s M-Pesa and bank messages and add anything missing.</li>
        <li>Check each category against its limit. Anything at 80% or more with lots of the month still to go needs attention.</li>
        <li>Look at your total for wants. Is it where you expected?</li>
        <li>Pick one small change for next week: cook at home twice more, walk part of the way, skip one outing.</li>
      </ol>
      <p>Sunday evening works well for many people: the week is fresh in your mind and the next one hasn’t started.</p>

      <h2 id="missed-days">Missed a few days? Record an untracked lump sum</h2>
      <p>
        If you miss several days, don’t try to reconstruct every purchase, and don’t give up. Work out the total you can’t account for, record it as one
        “untracked” expense, and start again today.
      </p>
      <Formula label="Untracked spending equals money at the start plus money received minus money you have now minus spending you recorded">
        Untracked = money at the start + money received − money you have now − spending you recorded
      </Formula>
      <Example title="Example: fixing a lost week">
        <p>
          On Monday you had <strong>KSh 12,400</strong> across M-Pesa, your bank account and cash. You received nothing new during the week. You recorded{' '}
          <strong>KSh 5,100</strong> of spending before you lost the thread. On Sunday you have <strong>KSh 4,300</strong>.
        </p>
        <p>
          You actually spent 12,400 − 4,300 = KSh 8,100, of which 5,100 is recorded. So you add one expense of <strong>KSh 3,000</strong> under Miscellaneous,
          with a note such as “Untracked, 14–20 June”. Your monthly total is now right, even if the detail isn’t.
        </p>
      </Example>
      <Callout tone="info" title="Leave out transfers between your own accounts">
        <p>
          Moving money from M-Pesa to your bank, or into a savings account, isn’t spending. If you moved money into savings during the week, count it as part of
          “money you have now”.
        </p>
      </Callout>
      <p>
        An untracked entry now and then is fine. If it’s large every week, that’s a sign to make recording easier (fewer categories, a quicker routine), not to
        try harder.
      </p>

      <h2 id="mpesa-cross-check">How do you use M-Pesa statements as a cross-check?</h2>
      <p>
        Once a month, compare your records with your M-Pesa and bank statements to catch anything you missed. Use statements as a check, not as your main way of
        tracking.
      </p>
      <p>
        A statement tells you where money went (a Paybill, a till number, a person) but not why. “Sent to John Kamau, KSh 1,500” could be a loan repayment, a
        contribution or a gift. You know the reason on the day; three weeks later you may not. That’s why same-day recording matters.
      </p>
      <p>When you scan a statement, look for:</p>
      <ul>
        <li>Transaction charges and Fuliza charges that add up quietly over the month.</li>
        <li>Repeated payments you’d forgotten, such as subscriptions, betting or data bundles bought several times a day.</li>
        <li>Money sent to family or friends that never made it into your records.</li>
        <li>Mobile loans taken or repaid, so your list of debts stays up to date.</li>
      </ul>
      <p>
        Safaricom lets you request an M-Pesa statement for a chosen period; check the M-Pesa app or{' '}
        <Ext href="https://www.safaricom.co.ke/">Safaricom’s website</Ext> for the current steps. Your bank’s app or branch can give you a bank statement. Once
        you have a month or two of clean records, use them to set realistic limits for next month’s budget.
      </p>
    </Prose>
  )
}
