"use client";

import Link from "next/link";

interface BannerProps {
  title?: string;
  subtitle?: string;
  image?: string;
  height?: "small" | "medium" | "large";
  ctaText?: string;
  ctaLink?: string;
  variant?: "gradient" | "sale" | "promo" | "brand";
  badge?: string;
}

export default function Banner({
  title = "Werbebanner",
  subtitle,
  image,
  height = "medium",
  ctaText,
  ctaLink,
  variant = "gradient",
  badge,
}: BannerProps) {
  const heightClass = {
    small: "h-32",
    medium: "h-48 sm:h-56",
    large: "h-64 sm:h-80",
  }[height];

  const variantStyles = {
    gradient: "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500",
    sale: "bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500",
    promo: "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500",
    brand: "bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600",
  };

  const content = (
    <div
      className={`${heightClass} ${variantStyles[variant]} rounded-2xl overflow-hidden flex items-center relative group transition-transform duration-300 hover:scale-[1.01]`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Image Background (optional) */}
      {image && (
        <div className="absolute inset-0">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover opacity-30"
          />
        </div>
      )}

      {/* Badge */}
      {badge && (
        <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
          {badge}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 px-6 sm:px-10 py-6 flex flex-col sm:flex-row items-center justify-between w-full gap-4">
        <div className="text-center sm:text-left">
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 drop-shadow-lg">
            {title}
          </h2>
          {subtitle && (
            <p className="text-white/90 text-sm sm:text-lg max-w-md drop-shadow">
              {subtitle}
            </p>
          )}
        </div>

        {ctaText && (
          <div className="shrink-0">
            <span className="inline-block bg-white text-gray-900 font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-sm sm:text-base">
              {ctaText}
            </span>
          </div>
        )}
      </div>

      {/* Decorative Elements */}
      <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
      <div className="absolute -left-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
    </div>
  );

  if (ctaLink) {
    return <Link href={ctaLink}>{content}</Link>;
  }

  return content;
}
