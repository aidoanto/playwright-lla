import { expect, test } from '@playwright/test';

const SEARCH_URL = 'https://www.lifeline.org.au/search?search=depression';
const MIN_RESULTS = 7;

test('search returns at least 7 results for depression', async ({ page }) => {
  const responsePromise = page.waitForResponse(
    (res) => {
      const req = res.request();
      const url = res.url().toLowerCase();
      const postData = (req.postData() || '').toLowerCase();

      return (
        req.method() === 'POST' &&
        (url.includes('algolia') || url.includes('algolianet')) &&
        postData.includes('depression')
      );
    },
    { timeout: 15_000 },
  );

  await page.goto(SEARCH_URL, { waitUntil: 'networkidle' });

  const response = await responsePromise.catch(() => null);

  if (response) {
    const json = await response.json();
    const result = json?.results?.[0] ?? {};
    const nbHits = result?.nbHits ?? 0;
    const hits = Array.isArray(result?.hits) ? result.hits : [];
    const titles = hits
      .slice(0, MIN_RESULTS)
      .map((hit) => hit?.title ?? hit?.name ?? hit?.label ?? hit?.heading ?? '')
      .filter(Boolean);

    console.log(`Total hits reported by search API: ${nbHits}`);
    console.log(`First ${Math.min(MIN_RESULTS, titles.length)} titles:`, titles);

    expect(nbHits).toBeGreaterThanOrEqual(MIN_RESULTS);
    return;
  }

  const resultItems = page.locator(
    'main [data-search-result], main .ais-Hits-item, main .search-result, main article',
  );

  await expect(resultItems.first()).toBeVisible();
  const count = await resultItems.count();
  const titles = await resultItems
    .locator('h1, h2, h3, a')
    .allTextContents();
  const cleanedTitles = titles
    .map((title) => title.trim())
    .filter(Boolean)
    .slice(0, MIN_RESULTS);

  console.log(`Total results found in DOM: ${count}`);
  console.log(
    `First ${Math.min(MIN_RESULTS, cleanedTitles.length)} titles:`,
    cleanedTitles,
  );

  expect(count).toBeGreaterThanOrEqual(MIN_RESULTS);
});
