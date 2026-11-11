import { A, Callout, Definition, Example, Formula, Prose, Table } from '@/components/marketing/prose'
import type { Article } from '@/content/types'

export const meta: Article['meta'] = {
  slug: 'needs-vs-wants',
  title: 'Needs vs wants: how to sort your spending (with Kenyan examples)',
  seoTitle: 'Needs vs Wants: How to Sort Your Spending',
  description:
    'Needs are costs you must pay to live and work; wants are the rest. A simple test, Kenyan examples, the grey areas and how to keep wants near 30% of spending.',
  summary:
    'A need is a cost you would still pay in a hard month to live, work and keep firm commitments; a want is anything you could cut, pause or downgrade without real harm. Many expenses are partly both: the basic version is the need and the upgrade is the want. A common guideline is to keep wants to about 30% of your spending.',
  keyTakeaways: [
    'A need is what you’d still pay in a hard month to live, work and keep firm commitments; a want could be cut, paused or downgraded without real harm.',
    'Many expenses are mixed: the basic version is the need and the upgrade is the want.',
    'Loan repayments, saving and investing are neither needs nor wants, so Finfe gives them their own kinds: debt, saving and invest.',
    'A common guideline is to keep wants to about 30% of what you spend. Finfe’s “Am I on track?” check uses that line.',
    'Cut wants by trimming and swapping first, and keep the one or two you value most.',
  ],
  keywords: [
    'needs vs wants',
    'needs and wants examples',
    'needs vs wants Kenya',
    'how to separate needs and wants',
    'is family support a need or a want',
    'how much should I spend on wants',
    'how to cut spending',
  ],
  published: '2026-11-11',
  updated: '2026-11-11',
  readingMinutes: 7,
  category: 'Expense tracking',
  related: ['/guides/how-to-track-expenses', '/guides/50-30-20-rule', '/expense-tracker', '/calculators/budget', '/glossary#needs-and-wants'],
  toc: [
    { id: 'definitions', label: 'What’s the difference?' },
    { id: 'test', label: 'A test you can apply' },
    { id: 'kenyan-examples', label: 'Everyday Kenyan expenses sorted' },
    { id: 'grey-areas', label: 'Deciding the grey areas' },
    { id: 'five-kinds', label: 'The five spending kinds' },
    { id: 'how-much-on-wants', label: 'How much should go on wants?' },
    { id: 'cutting-wants', label: 'Cutting wants without misery' },
    { id: 'worked-example', label: 'Worked example: sorting a month' },
  ],
  faq: [
    {
      q: 'Is family support (black tax) a need or a want?',
      a: 'Regular support you have committed to, such as a parent’s rent or medicine, behaves like a need, so plan it as a fixed payment. Requests beyond the amount you planned are a choice, and deciding a monthly amount in advance makes them easier to handle.',
    },
    {
      q: 'Is a smartphone a need?',
      a: 'For most working people, a working phone with data is a need, because work, banking and M-Pesa run on it. The newest model, or upgrading before your phone stops working, is a want.',
    },
    {
      q: 'Are loan repayments needs or wants?',
      a: 'Neither. Once you have borrowed, repayments are commitments you must meet, so Finfe puts them in their own debt kind. That keeps them out of your wants total while still showing how much of your pay they take.',
    },
    {
      q: 'What percentage of my spending should go on wants?',
      a: 'A common guideline is about 30%. Finfe’s “Am I on track?” check flags wants above 30% of spending. If you are borrowing to get through the month, aim lower until the loans are cleared.',
    },
    {
      q: 'Are tithes and harambee contributions needs?',
      a: 'It depends on your commitments. Many people treat a regular tithe or offering as a fixed payment they plan first, like a need. Occasional harambees are easier to manage from a set monthly amount, so a request never has to become a loan.',
    },
  ],
}

export default function Body() {
  return (
    <Prose>
      <p>
        Sorting spending into needs and wants is the quickest way to find room in a budget. It isn’t about guilt. Wants are where money can move this week,
        while needs usually take months to change. Knowing which is which tells you where to look first.
      </p>

      <h2 id="definitions">What’s the difference between a need and a want?</h2>
      <p>
        A need is a cost you have to cover to live, work and keep your firm commitments. A want is something that makes life nicer but could be cut, paused or
        downgraded without real harm.
      </p>
      <Definition term="Need">
        Spending you would still have to pay in a hard month: housing, basic food, transport to work, school fees, health, and support you have committed to.
      </Definition>
      <Definition term="Want">
        Spending you choose for comfort or enjoyment: eating out, outings, subscriptions, new clothes, upgrades.
      </Definition>
      <p>
        The <A href="/glossary#needs-and-wants">glossary entry on needs and wants</A> has a short version you can share.
      </p>

      <h2 id="test">How can you tell whether something is a need?</h2>
      <p>
        Ask three questions. If the honest answer to either of the first two is yes, it’s a need, at least in its basic form. If both are no, it’s a want.
      </p>
      <ol>
        <li>
          <strong>The hard-month question:</strong> if my income dropped by a third next month, would I still pay this?
        </li>
        <li>
          <strong>The harm question:</strong> if I stopped or paused it, would my health, safety, job, my children’s schooling or a firm commitment suffer?
        </li>
        <li>
          <strong>The basic-version question:</strong> is there a cheaper version that does the same job? If so, the cheaper version is the need, and the
          difference is a want.
        </li>
      </ol>
      <Callout tone="tip" title="The rule that settles most cases">
        <p>The basic version is the need. The upgrade is the want.</p>
      </Callout>

      <h2 id="kenyan-examples">Which everyday Kenyan expenses are needs, and which are wants?</h2>
      <p>
        Most everyday costs fall clearly on one side, and a handful sit in between. The table gives the usual answer and the grey area to watch for each.
      </p>
      <Table caption="Everyday Kenyan expenses: need or want?">
        <thead>
          <tr>
            <th>Expense</th>
            <th>Usually</th>
            <th>Why / grey area</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Rent</td>
            <td>Need</td>
            <td>Housing is basic. A bigger house or pricier area than you need is partly a want, though moving takes time.</td>
          </tr>
          <tr>
            <td>Food and groceries</td>
            <td>Need</td>
            <td>Basic food is a need. Takeaways, snacks and premium brands are wants.</td>
          </tr>
          <tr>
            <td>Transport to work</td>
            <td>Need</td>
            <td>Getting to work protects your income. A boda boda when a matatu would do, or fuel for weekend trips, is a want.</td>
          </tr>
          <tr>
            <td>Data bundles and airtime</td>
            <td>Need</td>
            <td>Work, banking and M-Pesa depend on them. Extra bundles for streaming are a want.</td>
          </tr>
          <tr>
            <td>Smartphone</td>
            <td>Need (a working one)</td>
            <td>A working phone is essential. The newest model, or upgrading early, is a want.</td>
          </tr>
          <tr>
            <td>School fees</td>
            <td>Need</td>
            <td>Education is a firm commitment. The school you choose and extras such as trips are decisions you can plan.</td>
          </tr>
          <tr>
            <td>Eating out</td>
            <td>Want</td>
            <td>A basic lunch at work can be a need. The amount above a basic lunch, and weekend restaurants, are wants.</td>
          </tr>
          <tr>
            <td>Family support (“black tax”)</td>
            <td>Often a need</td>
            <td>Regular, agreed support, such as a parent’s rent or medicine, behaves like a need. Requests beyond what you planned are a choice.</td>
          </tr>
          <tr>
            <td>Church or harambee contributions</td>
            <td>Depends</td>
            <td>Many people plan a regular tithe or offering like a need. Occasional harambees are easier from a set monthly amount.</td>
          </tr>
          <tr>
            <td>Gym membership</td>
            <td>Want</td>
            <td>Exercise matters, but walking, running and home workouts cost little. If a doctor has advised supervised exercise, treat it as health.</td>
          </tr>
          <tr>
            <td>Netflix and other subscriptions</td>
            <td>Want</td>
            <td>Pleasant, and easy to pause and restart. Count every subscription, not just the big ones.</td>
          </tr>
          <tr>
            <td>Clothes</td>
            <td>Mostly want</td>
            <td>Work clothes, school uniform and replacing what’s worn out are needs. New outfits for their own sake are wants.</td>
          </tr>
          <tr>
            <td>Chama</td>
            <td>Depends</td>
            <td>A savings or merry-go-round chama is saving, and one that buys land or shares is investing. Purely social spending is closer to a want.</td>
          </tr>
          <tr>
            <td>Loan repayments</td>
            <td>Neither: debt</td>
            <td>Not a choice once you’ve borrowed, but not a living cost either. Track them on their own.</td>
          </tr>
        </tbody>
      </Table>

      <h2 id="grey-areas">How do you decide the grey areas?</h2>
      <p>
        Either split the cost, counting the basic version as a need and the rest as a want, or label the whole category by what it mostly is and stay
        consistent. Both work. What matters is deciding once, not every time you pay.
      </p>
      <ul>
        <li>
          <strong>Split by category, not by receipt.</strong> Keep “Food &amp; Groceries” as a need and “Eating Out &amp; Fun” as a want, and record each
          purchase in the right one. You don’t need to split every transaction.
        </li>
        <li>
          <strong>Decide commitments in advance.</strong> For family support, church and harambees, choose a monthly amount before the month starts. Within
          it, the spending is planned. Beyond it, it’s a choice you make knowingly.
        </li>
        <li>
          <strong>Context counts.</strong> A taxi home can be a need at midnight and a want at six in the evening. And if you are borrowing to get through
          the month, set the bar for “need” higher until the loans are cleared.
        </li>
        <li>
          <strong>Be honest, not harsh.</strong> Labelling something a want doesn’t mean you must cut it. It just means you could.
        </li>
      </ul>

      <h2 id="five-kinds">What are the five spending kinds?</h2>
      <p>
        Finfe tags every spending category with one of five kinds: need, want, debt, saving or invest. Taking loan repayments, saving and investing out of
        needs and wants keeps each total honest.
      </p>
      <Table caption="The five spending kinds in Finfe">
        <thead>
          <tr>
            <th>Kind</th>
            <th>What it covers</th>
            <th>Example categories</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Need</td>
            <td>Essentials for living and working</td>
            <td>Rent &amp; Housing, Food &amp; Groceries, Transport, School Fees, Airtime &amp; Data, Health, Family Support</td>
          </tr>
          <tr>
            <td>Want</td>
            <td>Lifestyle spending you could cut or pause</td>
            <td>Eating Out &amp; Fun, Clothes &amp; Personal, Miscellaneous</td>
          </tr>
          <tr>
            <td>Debt</td>
            <td>Loan repayments</td>
            <td>Shamba Loan, Other Loan Repayments</td>
          </tr>
          <tr>
            <td>Saving</td>
            <td>Money set aside for later</td>
            <td>Savings &amp; Emergency Fund</td>
          </tr>
          <tr>
            <td>Invest</td>
            <td>Money put into projects meant to grow your wealth</td>
            <td>Shop Investment, a building project</td>
          </tr>
        </tbody>
      </Table>
      <p>
        Why keep debt apart? If a SACCO repayment were filed under needs, your living costs would look higher than they are. Filed under wants, it would look
        like something you could skip. As its own kind, it shows exactly how much of your pay the loans take. You can change the kind of any category to match
        how you see it.
      </p>

      <h2 id="how-much-on-wants">How much of your spending should go on wants?</h2>
      <p>
        A common guideline is about 30%. Finfe Pro’s “Am I on track?” check measures wants as a share of everything you record going out, including loan
        repayments and savings, and flags anything above 30%.
      </p>
      <Formula label="Wants share equals spending on wants divided by total spending, times 100">
        Wants share = spending on wants ÷ total spending × 100
      </Formula>
      <p>
        This is close to, but not the same as, the 30% for wants in the <A href="/guides/50-30-20-rule">50/30/20 rule</A>, which is a share of take-home pay.
        If you spend most of your pay, the two come out much the same. If you are borrowing to get through the month, aim lower than 30% until the loans are
        cleared.
      </p>

      <h2 id="cutting-wants">How do you cut wants without making life miserable?</h2>
      <p>
        Trim and swap before you cut, keep the one or two wants you value most, and give the rest a monthly limit. Cutting everything at once rarely lasts
        beyond the second week.
      </p>
      <ul>
        <li>
          <strong>Rank your wants.</strong> List them, mark the two you would miss most, and protect those. Cut from the bottom of the list.
        </li>
        <li>
          <strong>Trim before you cut.</strong> Eating out twice a month instead of four times saves half and keeps the treat.
        </li>
        <li>
          <strong>Swap for a cheaper version.</strong> Pack lunch two or three days a week, host a movie night instead of going out, or run with friends
          instead of paying for the gym.
        </li>
        <li>
          <strong>Rotate subscriptions.</strong> Keep one streaming service at a time and switch when you have watched what you wanted.
        </li>
        <li>
          <strong>Wait a day on unplanned buys.</strong> For anything over a set amount, say KSh 2,000, sleep on it first.
        </li>
        <li>
          <strong>Move the savings on payday.</strong> Send the money you freed to savings or a loan straight away, or it will quietly leak into other wants.
          Watch for <A href="/glossary#lifestyle-inflation">lifestyle inflation</A> after a pay rise, too.
        </li>
      </ul>
      <p>
        Limits help most when you record spending as it happens and get a warning, say at 80% of a want category’s limit, while there is still time to slow
        down. See the <A href="/expense-tracker">expense tracker</A> and{' '}
        <A href="/guides/how-to-track-expenses">how to track expenses</A> for the daily habit.
      </p>

      <h2 id="worked-example">Worked example: sorting a month’s spending</h2>
      <p>
        Here is one illustrative month on KSh 90,000 take-home pay, with every shilling recorded and sorted. Lunches at work are split: 22 basic lunches at
        KSh 250 count as a need, and the rest as a want.
      </p>
      <Example title="Illustration: one month on KSh 90,000">
        <Table caption="An illustrative month sorted by kind">
          <thead>
            <tr>
              <th>Item</th>
              <th>Kind</th>
              <th className="num">KSh</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Rent</td>
              <td>Need</td>
              <td className="num">18,000</td>
            </tr>
            <tr>
              <td>Food and groceries</td>
              <td>Need</td>
              <td className="num">9,000</td>
            </tr>
            <tr>
              <td>Matatu to work</td>
              <td>Need</td>
              <td className="num">6,000</td>
            </tr>
            <tr>
              <td>Lunches at work, basic part (22 × 250)</td>
              <td>Need</td>
              <td className="num">5,500</td>
            </tr>
            <tr>
              <td>Agreed support for parents</td>
              <td>Need</td>
              <td className="num">5,000</td>
            </tr>
            <tr>
              <td>Power, water and gas</td>
              <td>Need</td>
              <td className="num">3,000</td>
            </tr>
            <tr>
              <td>Airtime and data</td>
              <td>Need</td>
              <td className="num">2,500</td>
            </tr>
            <tr>
              <td>SACCO loan repayment</td>
              <td>Debt</td>
              <td className="num">6,000</td>
            </tr>
            <tr>
              <td>Emergency fund</td>
              <td>Saving</td>
              <td className="num">3,000</td>
            </tr>
            <tr>
              <td>Eating out and weekend outings</td>
              <td>Want</td>
              <td className="num">11,000</td>
            </tr>
            <tr>
              <td>Snacks and small buys</td>
              <td>Want</td>
              <td className="num">7,500</td>
            </tr>
            <tr>
              <td>Clothes and salon</td>
              <td>Want</td>
              <td className="num">5,500</td>
            </tr>
            <tr>
              <td>Gym</td>
              <td>Want</td>
              <td className="num">3,500</td>
            </tr>
            <tr>
              <td>Lunches at work, extra above basic</td>
              <td>Want</td>
              <td className="num">3,000</td>
            </tr>
            <tr>
              <td>Streaming subscriptions</td>
              <td>Want</td>
              <td className="num">1,500</td>
            </tr>
            <tr>
              <td>
                <strong>Total</strong>
              </td>
              <td></td>
              <td className="num">
                <strong>90,000</strong>
              </td>
            </tr>
          </tbody>
        </Table>
        <p>
          By kind: needs KSh 49,000, debt KSh 6,000, saving KSh 3,000 and wants KSh 32,000. Wants share: 32,000 ÷ 90,000 ≈ 36%, above the 30% line. Thirty
          per cent of KSh 90,000 is KSh 27,000, so about KSh 5,000 a month needs to move.
        </p>
        <p>
          The plan: a basic lunch every working day (KSh 3,000 saved) and one fewer weekend outing (KSh 2,000). The gym and streaming stay, because they are the
          two wants this person values most. The KSh 5,000 goes to the emergency fund on payday, so total spending stays at KSh 90,000 and wants fall to 30%.
        </p>
      </Example>
      <p>
        Try your own split in the <A href="/calculators/budget">budget calculator</A>. A month or two of records, sorted this way, will show you exactly where
        your room is.
      </p>
    </Prose>
  )
}
