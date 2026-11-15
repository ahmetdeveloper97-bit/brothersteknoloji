import { Link } from "react-router-dom";

interface ShowcaseHeroProps {
  title: string;
  description: string;
  imageUrl: string;
  count: number;
  icon: string;
}

export default function ShowcaseHero({ title, description, imageUrl, count, icon }: ShowcaseHeroProps) {
  return (
    <section className="relative w-full overflow-hidden rounded-2xl border border-background-200 bg-foreground-950">
      {imageUrl && (
        <div className="absolute inset-0">
          <img
            src={imageUrl}
            alt={title}
            title={`${title} vitrini`}
            className="h-full w-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground-950/95 via-foreground-950/75 to-foreground-950/15" />
        </div>
      )}

      <div className="relative flex h-[230px] w-full flex-col justify-center gap-2.5 px-5 py-6 md:h-[280px] md:px-9">
        <span className="flex w-fit items-center gap-1.5 rounded-full bg-background-50/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-background-50">
          <i className={`${icon} text-sm`} />
          Vitrin
        </span>
        <h1 className="font-heading text-2xl font-bold leading-tight text-background-50 md:text-4xl">{title}</h1>
        <p className="max-w-xl text-sm leading-relaxed text-background-200 md:text-base">{description}</p>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 whitespace-nowrap rounded-full bg-background-50 px-3 py-1.5 text-xs font-semibold text-foreground-950">
            <i className="ri-shopping-bag-3-line text-sm" />
            {count} ürün
          </span>
          <Link
            to="/kategoriler"
            className="flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-full border border-background-50/40 px-3 py-1.5 text-xs font-semibold text-background-50 transition-colors hover:bg-background-50/10"
          >
            Tüm ürünler
            <i className="ri-arrow-right-line text-sm" />
          </Link>
        </div>
      </div>
    </section>
  );
}