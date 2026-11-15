import { useFavorites } from "@/context/FavoritesContext";

interface FavoriteButtonProps {
  productId: string;
  className?: string;
  size?: "sm" | "md";
}

export default function FavoriteButton({ productId, className = "", size = "sm" }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(productId);

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleFavorite(productId);
      }}
      aria-label={active ? "Favorilerden çıkar" : "Favorilere ekle"}
      aria-pressed={active}
      title={active ? "Favorilerden çıkar" : "Favorilere ekle"}
      className={`flex cursor-pointer items-center justify-center rounded-full border backdrop-blur transition-all duration-300 ${
        size === "sm" ? "h-8 w-8" : "h-11 w-11"
      } ${
        active
          ? "border-accent-500 bg-accent-50 text-accent-700"
          : "border-background-200 bg-background-50/90 text-foreground-600 hover:border-accent-400 hover:text-accent-700"
      } ${className}`}
    >
      <i className={`${active ? "ri-heart-3-fill" : "ri-heart-3-line"} ${size === "sm" ? "text-sm" : "text-base"}`} />
    </button>
  );
}