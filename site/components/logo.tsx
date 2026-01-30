export function Logo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className ?? ""}`}>
      <span
        className="font-[family-name:var(--font-vanilla-cream)] text-xl leading-none tracking-wide"
        style={{ WebkitTextStroke: "0.5px #525252" }}
      >
        before
      </span>
      <span className="font-normal text-neutral-600">and</span>
      <span className="relative font-medium">
        {/* top-left, larger */}
        <svg
          className="absolute -left-1 -top-1 w-2 h-2 text-neutral-400"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          style={{ animation: "sparkle 2s ease-in-out infinite", animationDelay: "0s" }}
        >
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
        {/* top-right, small */}
        <svg
          className="absolute -right-0.5 -top-0.5 w-1 h-1 text-neutral-300"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          style={{ animation: "sparkle 2.5s ease-in-out infinite", animationDelay: "0.7s" }}
        >
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
        {/* right side, medium */}
        <svg
          className="absolute -right-1.5 top-1 w-1.5 h-1.5 text-neutral-400"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          style={{ animation: "sparkle 1.8s ease-in-out infinite", animationDelay: "1.2s" }}
        >
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
        {/* bottom-left, medium */}
        <svg
          className="absolute -left-0.5 -bottom-0.5 w-1.5 h-1.5 text-neutral-300"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          style={{ animation: "sparkle 2.2s ease-in-out infinite", animationDelay: "0.4s" }}
        >
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
        {/* bottom-right, tiny */}
        <svg
          className="absolute right-2 -bottom-1 w-[5px] h-[5px] text-neutral-400"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          style={{ animation: "sparkle 2.8s ease-in-out infinite", animationDelay: "0.9s" }}
        >
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
        After
      </span>
    </div>
  )
}
