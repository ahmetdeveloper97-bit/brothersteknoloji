import { useMemo, useState } from "react";
import Modal from "@/components/base/Modal";
import { Banner, Panel, Pill } from "@/components/base/AdminUI";
import { usePersistentState } from "@/lib/persistent";
import { ADMIN_STORE_KEYS, averageRating, loadReviews } from "@/lib/adminStore";
import { findStaffByEmail, readAdminSessionEmail, staffDirectory } from "@/lib/adminStaffStore";
import { roleLabels } from "@/lib/adminRoles";
import type { AdminReview, ReviewStatus } from "@/types/admin";
import ReviewReplyModal from "@/pages/admin/reviews/ReviewReplyModal";

type StatusFilter = "all" | ReviewStatus;
type ReplyFilter = "all" | "waiting" | "replied";

const replyFilters: Array<{ id: ReplyFilter; label: string; icon: string }> = [
  { id: "all", label: "Tüm Yanıtlar", icon: "ri-list-check-2" },
  { id: "waiting", label: "Yanıt Bekleyen", icon: "ri-question-answer-line" },
  { id: "replied", label: "Yanıtlanmış", icon: "ri-reply-all-line" },
];

const statusMeta: Record<ReviewStatus, { label: string; tone: "success" | "warning" | "neutral" }> = {
  approved: { label: "Yayında", tone: "success" },
  pending: { label: "Onay Bekliyor", tone: "warning" },
  rejected: { label: "Reddedildi", tone: "neutral" },
};

const initialsOf = (name: string): string =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toLocaleUpperCase("tr"))
    .join("");

const formatReplyMoment = (value?: string): string => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <i
          key={star}
          className={`${star <= rating ? "ri-star-fill text-secondary-500" : "ri-star-line text-foreground-300"} text-xs`}
        />
      ))}
    </span>
  );
}

export default function ReviewsPanel() {
  const [reviews, setReviews] = usePersistentState<AdminReview[]>(ADMIN_STORE_KEYS.reviews, loadReviews());
  const [status, setStatus] = useState<StatusFilter>("all");
  const [replyFilter, setReplyFilter] = useState<ReplyFilter>("all");
  const [ratingFilter, setRatingFilter] = useState<number | 0>(0);
  const [search, setSearch] = useState("");
  const [replyTarget, setReplyTarget] = useState<AdminReview | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminReview | null>(null);

  const stats = useMemo(() => {
    const total = reviews.length;
    const pending = reviews.filter((review) => review.status === "pending").length;
    const approved = reviews.filter((review) => review.status === "approved").length;
    const replied = reviews.filter((review) => Boolean(review.reply)).length;
    return { total, pending, approved, replied, avg: averageRating(reviews) };
  }, [reviews]);

  const distribution = useMemo(
    () =>
      [5, 4, 3, 2, 1].map((star) => {
        const count = reviews.filter((review) => review.rating === star).length;
        return { star, count, percent: reviews.length ? (count / reviews.length) * 100 : 0 };
      }),
    [reviews]
  );

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: reviews.length };
    reviews.forEach((review) => {
      map[review.status] = (map[review.status] ?? 0) + 1;
    });
    return map;
  }, [reviews]);

  const visible = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("tr");
    return reviews.filter((review) => {
      if (status !== "all" && review.status !== status) return false;
      if (replyFilter === "waiting" && review.reply) return false;
      if (replyFilter === "replied" && !review.reply) return false;
      if (ratingFilter && review.rating !== ratingFilter) return false;
      if (!term) return true;
      return `${review.customer} ${review.product} ${review.title} ${review.body}`
        .toLocaleLowerCase("tr")
        .includes(term);
    });
  }, [reviews, status, ratingFilter, search, replyFilter]);

  const replyCounts = useMemo(() => {
    const replied = reviews.filter((review) => Boolean(review.reply)).length;
    return { all: reviews.length, waiting: reviews.length - replied, replied };
  }, [reviews]);

  const setReviewStatus = (id: string, next: ReviewStatus) => {
    setReviews((current) => current.map((review) => (review.id === id ? { ...review, status: next } : review)));
  };

  const saveReply = (id: string, reply: string) => {
    const member = findStaffByEmail(readAdminSessionEmail());
    setReviews((current) =>
      current.map((review) =>
        review.id === id
          ? {
              ...review,
              reply,
              repliedBy: review.repliedBy ?? member?.name ?? "Mağaza",
              repliedByEmail: review.repliedByEmail ?? member?.email,
              repliedByRole: review.repliedByRole ?? (member ? roleLabels(member.roles).join(" + ") : "Mağaza"),
              repliedAt: new Date().toISOString(),
              status: review.status === "pending" ? "approved" : review.status,
            }
          : review,
      ),
    );
    setReplyTarget(null);
  };

  const directory = staffDirectory();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <div className="rounded-xl border border-background-200 bg-background-50 p-4">
          <p className="text-xs text-foreground-500">Toplam Yorum</p>
          <p className="mt-1 font-heading text-xl font-bold text-foreground-950">{stats.total}</p>
          <p className="mt-0.5 text-[11px] text-foreground-500">{stats.replied} tanesi yanıtlandı</p>
        </div>
        <div className="rounded-xl border border-background-200 bg-background-50 p-4">
          <p className="text-xs text-foreground-500">Ortalama Puan</p>
          <div className="mt-1 flex items-center gap-1.5">
            <p className="font-heading text-xl font-bold text-foreground-950">{stats.avg.toFixed(1)}</p>
            <Stars rating={Math.round(stats.avg)} />
          </div>
          <p className="mt-0.5 text-[11px] text-foreground-500">5 üzerinden</p>
        </div>
        <div className="rounded-xl border border-background-200 bg-background-50 p-4">
          <p className="text-xs text-foreground-500">Onay Bekleyen</p>
          <p className="mt-1 font-heading text-xl font-bold text-secondary-800">{stats.pending}</p>
          <p className="mt-0.5 text-[11px] text-foreground-500">Yayına alınmayı bekliyor</p>
        </div>
        <div className="rounded-xl border border-background-200 bg-background-50 p-4">
          <p className="text-xs text-foreground-500">Yayında</p>
          <p className="mt-1 font-heading text-xl font-bold text-accent-700">{stats.approved}</p>
          <p className="mt-0.5 text-[11px] text-foreground-500">Ürün sayfalarında görünüyor</p>
        </div>
      </div>

      <Banner tone={stats.pending > 0 ? "warning" : "info"}>
        {stats.pending > 0
          ? `${stats.pending} yorum onay bekliyor. Onaylamadan önce içeriği kontrol edin; uygunsuz yorumları reddedin.`
          : "Tüm yorumlar incelendi. Yeni yorumlar geldiğinde burada onay bekleyen olarak listelenir."}
      </Banner>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
        <div className="xl:col-span-3">
          <Panel
            title="Yorumlar"
            subtitle={`${visible.length} yorum gösteriliyor`}
            icon="ri-chat-3-line"
            padded={false}
          >
            <div className="flex flex-wrap items-center gap-2 border-b border-background-200 px-4 py-3">
              <div className="relative min-w-0 flex-1">
                <i className="ri-search-line pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-foreground-500" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Müşteri, ürün veya yorum ara..."
                  className="h-9 w-full rounded-lg border border-background-300 bg-background-50 pl-8 pr-3 text-sm text-foreground-900 outline-none placeholder:text-foreground-400 focus:border-primary-500"
                />
              </div>
              <select
                value={ratingFilter}
                onChange={(event) => setRatingFilter(Number(event.target.value))}
                className="h-9 cursor-pointer rounded-lg border border-background-300 bg-background-50 px-2 text-xs text-foreground-700 outline-none focus:border-primary-500"
              >
                <option value={0}>Tüm puanlar</option>
                {[5, 4, 3, 2, 1].map((star) => (
                  <option key={star} value={star}>
                    {star} yıldız
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap gap-1 border-b border-background-200 px-4 py-2.5">
              {([
                { id: "all", label: "Tümü" },
                { id: "pending", label: "Onay Bekleyen" },
                { id: "approved", label: "Yayında" },
                { id: "rejected", label: "Reddedildi" },
              ] as Array<{ id: StatusFilter; label: string }>).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setStatus(item.id)}
                  className={`h-8 cursor-pointer whitespace-nowrap rounded-full px-3 text-xs font-medium transition-colors ${
                    status === item.id
                      ? "bg-primary-800 text-background-50"
                      : "bg-background-100 text-foreground-600 hover:bg-background-200"
                  }`}
                >
                  {item.label}
                  <span className="ml-1 opacity-70">{counts[item.id] ?? 0}</span>
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-1.5 border-b border-background-200 px-4 py-2.5">
              <span className="mr-0.5 flex items-center gap-1 whitespace-nowrap text-[11px] font-semibold text-foreground-500">
                <i className="ri-filter-3-line" />
                Yanıt durumu
              </span>
              {replyFilters.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setReplyFilter(item.id)}
                  className={`flex h-8 cursor-pointer items-center gap-1 whitespace-nowrap rounded-full px-2.5 text-xs font-medium transition-colors ${
                    replyFilter === item.id
                      ? "bg-accent-700 text-background-50"
                      : "bg-background-100 text-foreground-600 hover:bg-background-200"
                  }`}
                >
                  <i className={item.icon} />
                  {item.label}
                  <span
                    className={`rounded-full px-1.5 text-[10px] font-bold ${
                      replyFilter === item.id
                        ? "bg-background-50/25 text-background-50"
                        : "bg-background-50 text-foreground-600"
                    }`}
                  >
                    {replyCounts[item.id]}
                  </span>
                </button>
              ))}
              {replyFilter !== "all" && (
                <button
                  type="button"
                  onClick={() => setReplyFilter("all")}
                  className="ml-auto flex h-8 cursor-pointer items-center gap-1 whitespace-nowrap rounded-full px-2.5 text-[11px] font-medium text-foreground-500 hover:bg-background-100"
                >
                  <i className="ri-close-line" />
                  Filtreyi temizle
                </button>
              )}
            </div>

            <div className="divide-y divide-background-100">
              {visible.map((review) => (
                <article key={review.id} className="p-4">
                  <div className="flex flex-wrap items-start gap-2.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-[11px] font-bold text-primary-900">
                      {initialsOf(review.customer)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <p className="text-sm font-semibold text-foreground-950">{review.customer}</p>
                        {review.verified && (
                          <Pill tone="success">
                            <i className="ri-verified-badge-line" />
                            Doğrulanmış
                          </Pill>
                        )}
                        <Pill tone={statusMeta[review.status].tone}>{statusMeta[review.status].label}</Pill>
                        {review.reply ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-accent-100 px-2 py-0.5 text-[10px] font-semibold text-accent-900">
                            <i className="ri-reply-line" />
                            {review.repliedBy ? `Yanıtlayan: ${review.repliedBy}` : "Yanıtlandı"}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-secondary-100 px-2 py-0.5 text-[10px] font-semibold text-secondary-950">
                            <i className="ri-time-line" />
                            Yanıt bekliyor
                          </span>
                        )}
                      </div>
                      <p className="truncate text-[11px] text-foreground-500">
                        {review.product} · {review.date}
                      </p>
                    </div>
                    <Stars rating={review.rating} />
                  </div>

                  <div className="mt-2 pl-0 sm:pl-11">
                    <p className="text-sm font-semibold text-foreground-900">{review.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-foreground-600">{review.body}</p>

                    {review.reply && (
                      <div className="mt-2 rounded-lg border-l-2 border-primary-400 bg-background-100 px-3 py-2">
                        <div className="flex items-center gap-1.5">
                          {(() => {
                            const avatar = review.repliedByEmail
                              ? directory[review.repliedByEmail.toLowerCase()]?.avatarUrl
                              : undefined;
                            return (
                              <span className="flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-100 text-[9px] font-bold text-primary-900">
                                {avatar ? (
                                  <img
                                    src={avatar}
                                    alt={`${review.repliedBy ?? "Mağaza"} profil fotoğrafı`}
                                    className="h-full w-full object-cover object-top"
                                  />
                                ) : (
                                  initialsOf(review.repliedBy ?? "Mağaza")
                                )}
                              </span>
                            );
                          })()}
                          <p className="flex items-center gap-1 text-[11px] font-semibold text-primary-900">
                            <i className="ri-store-2-line" />
                            Mağaza yanıtı{review.repliedBy ? ` · ${review.repliedBy}` : ""}
                          </p>
                        </div>
                        <p className="mt-1 pl-7 text-xs leading-relaxed text-foreground-600">{review.reply}</p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 pl-7">
                          {review.repliedByRole && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-primary-100 px-2 py-0.5 text-[10px] font-semibold text-primary-900">
                              <i className="ri-user-star-line" />
                              {review.repliedByRole}
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1 whitespace-nowrap font-mono text-[10px] text-foreground-500">
                            <i className="ri-time-line" />
                            {review.repliedAt ? formatReplyMoment(review.repliedAt) : "Tarih kaydedilmedi"}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                      {review.status !== "approved" && (
                        <button
                          type="button"
                          onClick={() => setReviewStatus(review.id, "approved")}
                          className="flex h-7 cursor-pointer items-center gap-1 whitespace-nowrap rounded-md bg-accent-100 px-2 text-[11px] font-semibold text-accent-900 hover:bg-accent-200"
                        >
                          <i className="ri-check-line" />
                          Onayla
                        </button>
                      )}
                      {review.status !== "rejected" && (
                        <button
                          type="button"
                          onClick={() => setReviewStatus(review.id, "rejected")}
                          className="flex h-7 cursor-pointer items-center gap-1 whitespace-nowrap rounded-md bg-background-100 px-2 text-[11px] font-medium text-foreground-700 hover:bg-background-200"
                        >
                          <i className="ri-close-line" />
                          Reddet
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setReplyTarget(review)}
                        className="flex h-7 cursor-pointer items-center gap-1 whitespace-nowrap rounded-md bg-primary-50 px-2 text-[11px] font-semibold text-primary-900 hover:bg-primary-100"
                      >
                        <i className="ri-reply-line" />
                        {review.reply ? "Yanıtı Düzenle" : "Yanıtla"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(review)}
                        aria-label="Yorumu sil"
                        className="ml-auto flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-foreground-500 hover:bg-background-200 hover:text-accent-700"
                      >
                        <i className="ri-delete-bin-6-line text-xs" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {!visible.length && (
              <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
                <i className="ri-chat-off-line text-2xl text-foreground-400" />
                <p className="text-sm text-foreground-600">Bu filtreye uygun yorum bulunamadı.</p>
              </div>
            )}
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel title="Puan Dağılımı" icon="ri-bar-chart-horizontal-line">
            <div className="space-y-2">
              {distribution.map((item) => (
                <div key={item.star} className="flex items-center gap-2">
                  <span className="flex w-8 items-center gap-0.5 text-[11px] text-foreground-600">
                    {item.star}
                    <i className="ri-star-fill text-[9px] text-secondary-500" />
                  </span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-background-200">
                    <div className="h-full rounded-full bg-secondary-500" style={{ width: `${item.percent}%` }} />
                  </div>
                  <span className="w-6 text-right text-[11px] text-foreground-600">{item.count}</span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Onay Kuralları" icon="ri-shield-check-line">
            <ul className="space-y-2 text-xs leading-relaxed text-foreground-600">
              <li className="flex items-start gap-1.5">
                <i className="ri-checkbox-circle-line mt-0.5 text-accent-600" />
                Yalnızca satın alma doğrulanmış yorumlar "Doğrulanmış" etiketi alır.
              </li>
              <li className="flex items-start gap-1.5">
                <i className="ri-checkbox-circle-line mt-0.5 text-accent-600" />
                Küfür, kişisel bilgi veya reklam içeren yorumlar reddedilir.
              </li>
              <li className="flex items-start gap-1.5">
                <i className="ri-checkbox-circle-line mt-0.5 text-accent-600" />
                Yanıtlanan yorumlar otomatik olarak yayına alınır.
              </li>
            </ul>
          </Panel>
        </div>
      </div>

      {replyTarget && (
        <ReviewReplyModal
          key={replyTarget.id}
          open
          review={replyTarget}
          onClose={() => setReplyTarget(null)}
          onSave={saveReply}
        />
      )}

      <Modal
        open={Boolean(deleteTarget)}
        title="Yorumu sil"
        subtitle={deleteTarget?.product}
        icon="ri-delete-bin-6-line"
        onClose={() => setDeleteTarget(null)}
        footer={
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setDeleteTarget(null)}
              className="h-9 cursor-pointer whitespace-nowrap rounded-lg border border-background-300 px-4 text-xs font-medium text-foreground-700 hover:bg-background-100"
            >
              Vazgeç
            </button>
            <button
              type="button"
              onClick={() => {
                if (!deleteTarget) return;
                setReviews((current) => current.filter((item) => item.id !== deleteTarget.id));
                setDeleteTarget(null);
              }}
              className="h-9 cursor-pointer whitespace-nowrap rounded-lg bg-accent-700 px-4 text-xs font-semibold text-background-50 hover:bg-accent-600"
            >
              Yorumu Sil
            </button>
          </div>
        }
      >
        <p className="text-sm leading-relaxed text-foreground-700">
          <strong className="text-foreground-950">{deleteTarget?.customer}</strong> tarafından yazılan yorum kalıcı
          olarak silinecek ve ürün sayfasından kaldırılacak.
        </p>
      </Modal>
    </div>
  );
}