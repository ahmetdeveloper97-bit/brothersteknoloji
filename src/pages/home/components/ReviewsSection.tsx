import { ratingBreakdown, reviews } from "@/mocks/store";

export default function ReviewsSection() {
  return (
    <section className="bg-background-50 py-10 md:py-14">
      <div className="mx-auto w-full max-w-[1320px] px-4">
        <div className="mb-8 text-center">
          <h2 className="font-heading text-2xl font-bold text-foreground-950 md:text-3xl">Müşteri Yorumları</h2>
          <div className="mx-auto mt-2 h-1 w-24 rounded-full bg-gradient-to-r from-primary-800 to-primary-500" />
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
          <div className="rounded-2xl border border-background-200 bg-background-100 p-6">
            <div className="flex items-end gap-3">
              <span className="font-heading text-5xl font-extrabold text-foreground-950">4,2</span>
              <div className="pb-1">
                <div className="flex text-accent-500">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <i key={star} className="ri-star-fill text-sm" />
                  ))}
                </div>
                <p className="mt-1 text-xs text-foreground-500">2.417 değerlendirme</p>
              </div>
            </div>

            <div className="mt-5 space-y-2">
              {ratingBreakdown.map((row) => (
                <div key={row.stars} className="flex items-center gap-2 text-xs text-foreground-600">
                  <span className="flex w-8 items-center gap-0.5">
                    {row.stars}
                    <i className="ri-star-fill text-[10px] text-accent-500" />
                  </span>
                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-background-300">
                    <span className="block h-full rounded-full bg-accent-500" style={{ width: `${row.percent}%` }} />
                  </span>
                  <span className="w-8 text-right text-[11px] text-foreground-500">{row.percent}%</span>
                </div>
              ))}
            </div>

            <p className="mt-5 text-xs leading-relaxed text-foreground-500">
              Yorumlar, siparişini tamamlayan doğrulanmış müşteriler tarafından yazılmaktadır.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-3 lg:grid-cols-3">
            {reviews.map((review) => (
              <article key={review.id} className="flex flex-col rounded-xl border border-background-200 bg-background-50 p-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-800">
                    {review.initials}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground-900">{review.name}</p>
                    <p className="text-[11px] text-foreground-500">{review.date}</p>
                  </div>
                  <span className="ml-auto flex text-accent-500">
                    {Array.from({ length: review.rating }).map((_, starIndex) => (
                      <i key={starIndex} className="ri-star-fill text-[11px]" />
                    ))}
                  </span>
                </div>
                <h3 className="mt-3 text-sm font-semibold text-foreground-900">{review.title}</h3>
                <p className="mt-1 line-clamp-4 flex-1 text-xs leading-relaxed text-foreground-600">{review.body}</p>
                <div className="mt-3 flex items-center gap-1.5 border-t border-background-200 pt-3 text-[11px] text-foreground-500">
                  <i className="ri-shopping-bag-3-line" />
                  <span className="truncate">{review.product}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}