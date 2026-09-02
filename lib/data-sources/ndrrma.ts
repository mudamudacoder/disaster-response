import * as cheerio from 'cheerio';

const BASE_URL = 'https://ndrrma.gov.np';

/**
 * NDRRMA Situation Reports are issued twice daily:
 *   - 9:00 AM
 *   - 6:00 PM
 *
 * IMPORTANT:
 * REPORT_BASE_ID must correspond to a known report.
 *
 * If report #395 was the 9 AM report on REPORT_BASE_DATE,
 * the ID increases by:
 *   +2 per day
 *   +0 for the 9 AM report
 *   +1 for the 6 PM report
 */
const REPORT_BASE_ID = 395;
const REPORT_BASE_DATE = '2026-09-01';

type ReportEdition = 'morning' | 'evening';

function getNepalDateTime() {
  return new Date(
    new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Kathmandu',
    })
  );
}

/**
 * Calculate the expected NDRRMA situation-report number.
 *
 * Assumption:
 * #395 = morning report on 2026-09-02.
 */
export function getExpectedReportId(
  date = getNepalDateTime()
): {
  id: number;
  edition: ReportEdition;
  reportDate: string;
} {
  const baseDate = new Date(`${REPORT_BASE_DATE}T09:00:00+05:45`);

  const currentDate = new Date(
    date.toISOString().split('T')[0] + 'T09:00:00+05:45'
  );

  const millisecondsPerDay = 24 * 60 * 60 * 1000;

  const daysSinceBase = Math.floor(
    (currentDate.getTime() - baseDate.getTime()) / millisecondsPerDay
  );

  const hours = date.getHours();

  // Before the 9 AM report, use the previous day's evening report.
  if (hours < 9) {
    return {
      id: REPORT_BASE_ID + daysSinceBase * 2 - 1,
      edition: 'evening',
      reportDate: new Date(
        currentDate.getTime() - millisecondsPerDay
      )
        .toISOString()
        .split('T')[0],
    };
  }

  // Between 9 AM and 6 PM = today's morning report.
  if (hours < 18) {
    return {
      id: REPORT_BASE_ID + daysSinceBase * 2,
      edition: 'morning',
      reportDate: currentDate.toISOString().split('T')[0],
    };
  }

  // 6 PM onwards = today's evening report.
  return {
    id: REPORT_BASE_ID + daysSinceBase * 2 + 1,
    edition: 'evening',
    reportDate: currentDate.toISOString().split('T')[0],
  };
}

/**
 * Fetch a situation report page.
 */
export async function getBulletin(
  reportId?: number
) {
  const { id } = getExpectedReportId();

  const actualId = reportId ?? id;

  const url = `${BASE_URL}/en/situation-report/${actualId}`;

  const response = await fetch(url, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch NDRRMA situation report #${actualId}`
    );
  }

  const html = await response.text();

  return {
    id: actualId,
    url,
    html,
  };
}

/**
 * Extract the PDF URL from an NDRRMA situation-report page.
 */
export async function getPdfUrl(
  bulletinUrl: string
): Promise<string> {
  const response = await fetch(bulletinUrl, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch bulletin page: ${bulletinUrl}`
    );
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  let pdfUrl: string | null = null;

  $('a').each((_, element) => {
    const href = $(element).attr('href');

    if (!href) return;

    if (
      href.toLowerCase().includes('.pdf') ||
      href.toLowerCase().includes('mediafiles')
    ) {
      pdfUrl = new URL(href, BASE_URL).toString();
      return false;
    }
  });

  // Some PDF viewers/embed elements may use src instead of href.
  if (!pdfUrl) {
    $('iframe, embed').each((_, element) => {
      const src = $(element).attr('src');

      if (
        src &&
        (src.toLowerCase().includes('.pdf') ||
          src.toLowerCase().includes('mediafiles'))
      ) {
        pdfUrl = new URL(src, BASE_URL).toString();
        return false;
      }
    });
  }

  if (!pdfUrl) {
    throw new Error(
      `No PDF found on bulletin page: ${bulletinUrl}`
    );
  }

  return pdfUrl;
}

/**
 * Download the PDF into memory.
 */
export async function downloadPdf(
  pdfUrl: string
): Promise<Buffer> {
  const response = await fetch(pdfUrl, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(
      `Failed to download PDF: ${pdfUrl}`
    );
  }

  const contentType = response.headers.get('content-type');

  if (
    contentType &&
    !contentType.includes('pdf') &&
    !pdfUrl.toLowerCase().includes('.pdf')
  ) {
    console.warn(
      `Unexpected PDF content type: ${contentType}`
    );
  }

  const arrayBuffer = await response.arrayBuffer();

  return Buffer.from(arrayBuffer);
}

/**
 * Complete pipeline:
 *
 * Determine current report
 *       ↓
 * Fetch report page
 *       ↓
 * Find PDF
 *       ↓
 * Download PDF
 *
 * PDF parsing is deliberately kept separate.
 */
export async function getLatestBulletinPdf() {
  const report = getExpectedReportId();

  const bulletinUrl =
    `${BASE_URL}/en/situation-report/${report.id}`;

  const pdfUrl = await getPdfUrl(bulletinUrl);

  const pdfBuffer = await downloadPdf(pdfUrl);

  return {
    reportId: report.id,
    edition: report.edition,
    reportDate: report.reportDate,
    bulletinUrl,
    pdfUrl,
    pdfBuffer,
  };
}