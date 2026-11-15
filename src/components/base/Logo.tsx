import { Link } from "react-router-dom";

interface LogoProps {
  dark?: boolean;
  compact?: boolean;
}

const BT_MARK =
  "https://public.readdy.ai/ai/img_res/edited_02064cb7465cc4c3d736643c25eca29b_1ffb1d29.jpg";

export default function Logo({ dark = false, compact = false }: LogoProps) {
  return (
    <Link to="/" className="flex items-center gap-2.5 group whitespace-nowrap">
      <span className="block h-10 w-10 shrink-0 overflow-hidden rounded-full ring-1 ring-background-200 transition-transform duration-200 group-hover:scale-105 dark:ring-background-700">
        <img
          src={BT_MARK}
          alt="Brothers Teknoloji logosu"
          title="Brothers Teknoloji"
          className="h-full w-full object-cover object-center"
        />
      </span>
      {!compact && (
        <span
          className={`font-heading text-xl font-extrabold tracking-tight ${
            dark ? "text-background-50" : "text-foreground-950"
          }`}
        >
          Brothers<span className="logo-blue-text"> Teknoloji</span>
        </span>
      )}
    </Link>
  );
}