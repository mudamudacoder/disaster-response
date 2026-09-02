export default function PMReliefFund() {
  const url = process.env.PM_RELIEF_FUND_URL || "";

  return (
    <section className="rounded-lg border-2 border-brand-saffron bg-amber-50 p-4">
      <h2 className="text-lg font-bold text-brand-crimsonDark">
        Official Prime Minister&apos;s Relief Fund
      </h2>

      <div className="mt-3 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <div className="flex h-128 w-128 flex-shrink-0 items-center justify-center rounded-md border border-dashed border-neutral-400 bg-white text-center text-xs text-neutral-400">
          <img src="PMReliefQR.jpeg" alt="PM Relief Fund QR Code" className="h-full w-full object-cover" />
        </div>

        <div>
          {url ? (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-md bg-brand-crimson px-4 py-2 font-semibold text-white hover:bg-brand-crimsonDark"
            >
              Go to official relief fund page
            </a>
          ) : (
            <p className="text-sm italic text-neutral-500">
              Official information has not been added yet. The PM_RELIEF_FUND_URL
              environment variable has not been set.
            </p>
          )}
          <p className="mt-2 max-w-md text-xs text-neutral-600">
            Always verify the destination before sending money. Check the URL
            carefully and confirm it belongs to an official Government of
            Nepal domain before making any donation.
          </p>
        </div>
      </div>
    </section>
  );
}