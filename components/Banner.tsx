"use client";

interface BannerProps {
  title?: string;
  subtitle?: string;
  image?: string;
  height?: "small" | "medium" | "large";
}

export default function Banner({
  title = "Werbebanner",
  subtitle,
  image,
  height = "medium",
}: BannerProps) {
  const heightClass = {
    small: "h-32",
    medium: "h-48",
    large: "h-64",
  }[height];

  return (
    <div
      className={`${heightClass} bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700 rounded-2xl overflow-hidden flex items-center justify-center relative`}
    >
      {image ? (
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">
            {title}
          </h2>
          {subtitle && (
            <p className="text-gray-600 dark:text-gray-400">{subtitle}</p>
          )}
        </div>
      )}
    </div>
  );
}
