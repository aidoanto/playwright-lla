## Lifeline search monitoring (Playwright)

This repo adds a simple Playwright check for Lifeline Australia’s site search so you can catch indexing problems early. The first check uses a common query (`depression`) and verifies there are at least 7 results.

### What’s included

- A Playwright test in `tests/search.spec.ts`
- A minimal Playwright config in `playwright.config.ts`
- npm scripts for running tests

### Quick start (local)

1. Install dependencies
   - `npm install`
2. Install Playwright browsers
   - `npx playwright install`
3. Run the test
   - `npm test`

### What the test does (plain English)

The test opens the Lifeline search page with this query:

`https://www.lifeline.org.au/search?search=depression`

Then it waits for the search API response (Algolia) and checks the total hit count. If the count is **7 or more**, the test passes.

### Adjusting the query or threshold

In `tests/search.spec.ts`, you can change:

- `SEARCH_URL` to test a different term
- `MIN_RESULTS` to raise or lower the threshold

### Next step (Better Stack)

Once the local test is stable, you can copy the same Playwright test into Better Stack’s Playwright monitor and run it on a schedule.