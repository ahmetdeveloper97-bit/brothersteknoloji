import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { ratingBreakdown } from "@/mocks/store";
import type { StoreReview } from "@/types/store";

interface ReviewsPanelProps {
  productId: string;
  productName: string;
  baseReviews: StoreReview[];
  baseRating: number;
  baseReviewCount: number;
}

const storageKey = (productId: string) => `eticaretv8_product_reviews_${productId}`;

const readStoredReviews = (productId: string): StoreReview[] => {
  try {
    const raw = window.localStorage.getItem(storageKey(productId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StoreReview[]) : [];
  } catch {
    return [];
  }
};

export default function ReviewsPanel({
  productId,
  productName,
  baseReviews,
  baseRating,
  baseReviewCount,
}: ReviewsPanelProps) {
  const [userReviews, setUserReviews] = useState<StoreReview[]>([]);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setUserReviews(readStoredReviews(productId));
  }, [productId]);

  const reviews = useMemo(() => [...userReviews, ...baseReviews], [userReviews, baseReviews]);
  const totalCount = baseReviewCount + userReviews.length;
  const average =
    (baseRating * baseReviewCount + userReviews.reduce((sum, review) => sum + review.rating, 0)) /
    Math.max(totalCount, 1);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) {
      setError("Lütfen adınızı yazın.");
      return;
    }
    if (body.trim().length < 10) {
      setError("Yorumunuz en az 10 karakter olmalı.");
      return;
    }

    const initials = name
      .trim()
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toLocaleUpperCase("tr");

    const review: StoreReview = {
      id: `ur-${Date.now()}`,
      name: name.trim(),
      initials,
      rating,
      date: new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" }),
      title: title.trim() || "Değerlendirme",
      body: body.trim(),
      product: productName,
    };

    const next = [review, ...userReviews];
    setUserReviews(next);
    try {
      window.localStorage.setItem(storageKey(productId), JSON.stringify(next));
    } catch {
      /* storage might be unavailable */
    }

    setName("");
    setTitle("");
    setBody("");
    setRating(5);
    setError("");
    setSuccess(true);
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-5 rounded-xl border border-background-200 bg-background-100 p-4 sm:grid-cols-[180px_1fr] sm:p-5">
        <div className="text-center sm:border-r sm:border-background-200 sm:text-left">
          <p className="font-heading text-4xl font-extrabold text-foreground-950">{average.toFixed(1)}</p>
          <div className="mt-1 flex justify-center gap-0.5 text-accent-500 sm:justify-start">
            {Array.from({ length: 5 }).map((_, index) => (
              <i key={index} className={index < Math.round(average) ? "ri-star-fill" : "ri-star-line"} />
            ))}
          </div>
          <p className="mt-1 text-xs text-foreground-500">{totalCount} değerlendirme</p>
        </div>
        <div className="space-y-1.5">
          {ratingBreakdown.map((row) => (
            <div key={row.stars} className="flex items-center gap-2">
              <span className="w-8 shrink-0 text-[11px] text-foreground-600">{row.stars} yıldız</span>
              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-background-200">
                <span className="block h-full rounded-full bg-accent-500" style={{ width: `${row.percent}%` }} />
              </span>
              <span className="w-9 shrink-0 text-right text-[11px] text-foreground-500">%{row.percent}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
        <form
          onSubmit={submit}
          className="h-fit rounded-xl border border-background-200 bg-background-50 p-4 sm:p-5"
        >
          <h3 className="font-heading text-base font-bold text-foreground-950">Yorum Yaz</h3>
          <p className="mt-0.5 text-xs text-foreground-500">
            {productName} hakkındaki deneyiminizi paylaşın.
          </p>

          <div className="mt-4 space-y-3">
            <div>
              <label htmlFor="review-name" className="mb-1 block text-xs font-medium text-foreground-700">
                Adınız
              </label>
              <input
                id="review-name"
                name="reviewName"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Örn. Ayşe K."
                className="h-9 w-full rounded-md border border-background-300 bg-background-50 px-3 text-sm text-foreground-900 outline-none placeholder:text-foreground-400 focus:border-primary-500"
              />
            </div>

            <div>
              <span className="mb-1 block text-xs font-medium text-foreground-700">Puanınız</span>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, index) => {
                  const value = index + 1;
                  const active = value <= (hoverRating || rating);
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        setRating(value);
                        setSuccess(false);
                      }}
                      onMouseEnter={() => setHoverRating(value)}
                      onMouseLeave={() => setHoverRating(0)}
                      aria-label={`${value} yıldız`}
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md transition-colors hover:bg-background-100"
                    >
                      <i className={`${active ? "ri-star-fill text-accent-500" : "ri-star-line text-foreground-300"} text-lg`} />
                    </button>
                  );
                })}
                <span className="ml-1 text-xs text-foreground-500">{rating} / 5</span>
              </div>
            </div>

            <div>
              <label htmlFor="review-title" className="mb-1 block text-xs font-medium text-foreground-700">
                Başlık (opsiyonel)
              </label>
              <input
                id="review-title"
                name="reviewTitle"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Örn. Beklentimin üzerinde"
                className="h-9 w-full rounded-md border border-background-300 bg-background-50 px-3 text-sm text-foreground-900 outline-none placeholder:text-foreground-400 focus:border-primary-500"
              />
            </div>

            <div>
              <label htmlFor="review-body" className="mb-1 block text-xs font-medium text-foreground-700">
                Yorumunuz
              </label>
              <textarea
                id="review-body"
                name="reviewBody"
                value={body}
                onChange={(event) => {
                  setBody(event.target.value.slice(0, 500));
                  setSuccess(false);
                }}
                maxLength={500}
                rows={4}
                placeholder="Ürünün kargo, paketleme ve performansı hakkında düşünceleriniz..."
                className="w-full resize-none rounded-md border border-background-300 bg-background-50 px-3 py-2 text-sm text-foreground-900 outline-none placeholder:text-foreground-400 focus:border-primary-500"
              />
              <p className="mt-1 text-right text-[11px] text-foreground-400">{body.length} / 500</p>
            </div>

            {error && (
              <p className="flex items-center gap-1.5 rounded-md bg-secondary-100 px-3 py-2 text-xs text-foreground-800">
                <i className="ri-error-warning-line" />
                {error}
              </p>
            )}

            {success && (
              <p className="flex items-center gap-1.5 rounded-md bg-accent-50 px-3 py-2 text-xs font-medium text-accent-800">
                <i className="ri-checkbox-circle-fill" />
                Yorumunuz yayınlandı. Teşekkürler!
              </p>
            )}

            <button
              type="submit"
              className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-gradient-to-r from-primary-800 to-primary-600 text-sm font-semibold text-background-50 transition-all hover:from-primary-700 hover:to-primary-500"
            >
              <i className="ri-send-plane-line" />
              Yorumu Gönder
            </button>
          </div>
        </form>

        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="rounded-xl border border-background-200 bg-background-50 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-[11px] font-bold text-primary-800">
                  {review.initials}
                </span>
                <span className="text-sm font-semibold text-foreground-900">{review.name}</span>
                <span className="flex text-accent-500">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <i key={index} className={`${index < review.rating ? "ri-star-fill" : "ri-star-line"} text-[11px]`} />
                  ))}
                </span>
                <span className="ml-auto text-xs text-foreground-500">{review.date}</span>
              </div>
              <p className="mt-2.5 text-sm font-semibold text-foreground-900">{review.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-foreground-700">{review.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}