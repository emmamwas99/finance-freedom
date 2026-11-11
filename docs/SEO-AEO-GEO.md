# Finfe: SEO, AEO and GEO

Three related but different goals. Treat them separately: they're won by different things and measured differently.

| | **SEO**: search engine optimisation | **AEO**: answer engine optimisation | **GEO**: generative engine optimisation |
|---|---|---|---|
| Goal | Be discovered and **ranked** in traditional search results (Google, Bing) | Structure answers so **answer engines** (featured snippets, AI Overviews, voice assistants) can understand and surface them | Improve the **chances** that Finfe and its content are **referenced** in generative AI responses (ChatGPT, Gemini, Perplexity, Copilot) |
| Unit of success | A ranking URL and a click | An extracted answer (snippet, overview) | A mention or citation of the brand or a page |
| What wins it | Crawlability, relevance to search intent, page quality, links, speed | Clear questions with direct answers, clean structure, structured data | Useful original content, consistent entity information, trust, technical accessibility to AI crawlers |
| How to measure | Google Search Console and Bing Webmaster Tools: impressions, clicks, average position, indexed pages | Search Console search appearance; manual checks for featured snippets and AI Overviews on target queries | Monthly manual prompts in major assistants for target questions ("best budget app in Kenya", "how to get out of mobile loan debt"); referral traffic from AI tools in analytics |
| Guarantees | None, but best practice reliably helps | None: engines choose what to extract | **None.** There is no way to make an AI engine cite a website |

> **Be honest about GEO.** Nothing in this codebase, and nothing any vendor sells, guarantees that a generative engine will cite Finfe. What we can do is make the content worth citing and easy to access, and keep the brand information consistent. Never add content just to "target AI", or anything misleading, fabricated or stuffed with keywords.

## 1. SEO: what's implemented

**Pages built around real tools and real questions.** Visitors can use every tool without an account, which gives them a reason to discover the site, return to it and link to it:
- Free tools hub (`/calculators`): budget, **savings**, savings goal, emergency fund, debt payoff and financial freedom calculators, plus the financial health check (`/financial-health`). Each tool remembers the visitor's last numbers in their own browser, so returning is useful.
- Financial education hub (`/learn`), organised by topic: budgeting, expenses, debt management, saving and financial independence. Each topic has a pillar page, guides and articles, and its tools.
- One canonical URL per search intent. Alternatives 301 to it (e.g. `/budget-calculator` → `/calculators/budget`, `/savings-calculator` → `/calculators/savings`, `/tools` → `/calculators`).

**Technical:**
- Every public page is a static, server-rendered HTML page. Content and links work without JavaScript.
- `buildMetadata()` (`src/lib/seo/metadata.ts`) gives every page a unique title and description, a canonical URL, Open Graph and Twitter cards with a generated image, and robots directives.
- `sitemap.xml` and `robots.txt` are generated from the same registry as the pages (`src/lib/seo/routes.ts`). Private and account routes are excluded and sent with `X-Robots-Tag: noindex`.
- Breadcrumbs, a logical heading hierarchy (one H1, no skipped levels), descriptive link text and internal linking between topic hubs, articles and tools.
- Performance: static generation, inlined CSS, small client islands, a self-hosted font, and no prefetching of the private app from public pages. Measured LCP is 0.9 s under slow-4G throttling, with CLS ≤ 0.02.
- Guarded by tests (`tests/seo.test.tsx`) and a crawl audit (`npm run seo:audit`): unique titles and descriptions, canonicals, one H1, valid JSON-LD, no broken internal links, and noindex on private routes.

**Next steps (outside the codebase):** verify the domain in Google Search Console and Bing Webmaster Tools and submit `/sitemap.xml`; earn links from Kenyan personal-finance communities, SACCOs, employers and media (the free tools are the most linkable assets); watch which queries bring impressions and expand the matching topics.

## 2. AEO: what's implemented

- **Direct answers first.** Every article opens with a "Quick answer" (1–3 sentences) and key takeaways. Every tool opens with what it answers. The section headings are questions ("How much should an emergency fund be?"), each followed by a short direct answer and then the detail.
- **Extractable formats:** numbered steps for processes, comparison tables, formulas written out in full, definitions (`<dfn>` and the glossary with per-term anchors), and worked KSh examples.
- **Structured data that matches visible content:** Article/BlogPosting, BreadcrumbList, FAQPage (from FAQs shown on the page), WebApplication for each tool, DefinedTermSet for the glossary, ItemList for the hubs. No ratings, reviews or prices that aren't on the page. (Google currently shows FAQ rich results only for authoritative government and health sites; the markup is still valid and other engines read it.)

## 3. GEO: what's implemented

- **Clear, consistent entity information.** One name, Finfe, defined once on key pages as short for "financial freedom". Organization and WebSite schema use the same name, description, logo and contact details, and `SITE.sameAs` is ready for official profiles once they exist.
- **Original, useful substance:** calculations an assistant can't make for a specific user (debt-free date with avalanche and roll-over, savings growth, a seven-habit health score), and transparent formulas and assumptions.
- **Trust signals:** author attribution (an organisation author until a named, qualified reviewer is added), published and updated dates, cited primary sources (CBK, CMA, SASRA, KRA, RBA), an editorial policy on the About page, and no unsupported promises (a test fails the build on phrases such as "guaranteed financial freedom").
- **Technical access:** AI crawlers are allowed on public content in `robots.txt`; `/llms.txt` gives a factual plain-Markdown summary of what Finfe is and links the key pages (an emerging convention, not a guarantee of anything).

## What not to do

- Don't promise rankings, snippets or AI citations, to stakeholders or in copy.
- Don't publish thin pages for every keyword variation; extend existing pages instead.
- Don't mark up content that isn't visible, invent reviews, or state rates and fees that can't be sourced.
