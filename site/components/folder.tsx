// Shared constants for folder dimensions
const FOLDER_VIEWBOX = "0 0 512 420"
const FOLDER_ASPECT_RATIO = 0.82

// Shared gradient/filter definitions - call this in your SVG defs
export function FolderDefs({ id }: { id: string }) {
  return (
    <>
      {/* Back folder gradient - darker blue */}
      <linearGradient id={`${id}-backGradient`} x1="256" y1="0" x2="256" y2="420" gradientUnits="userSpaceOnUse">
        <stop offset="0" style={{ stopColor: "var(--folder-back-top)" }} />
        <stop offset="0.5" style={{ stopColor: "var(--folder-back-mid)" }} />
        <stop offset="1" style={{ stopColor: "var(--folder-back-bottom)" }} />
      </linearGradient>

      {/* Front folder gradient - lighter cyan-blue aqua with darker bottom */}
      <linearGradient id={`${id}-frontGradient`} x1="256" y1="70" x2="256" y2="420" gradientUnits="userSpaceOnUse">
        <stop offset="0" style={{ stopColor: "var(--folder-front-top)" }} />
        <stop offset="0.5" style={{ stopColor: "var(--folder-front-mid)" }} />
        <stop offset="0.85" style={{ stopColor: "var(--folder-front-mid2)" }} />
        <stop offset="1" style={{ stopColor: "var(--folder-front-bottom)" }} />
      </linearGradient>

      {/* Circle gradient - medium blue, darker than front */}
      <linearGradient id={`${id}-circleGradient`} x1="256" y1="180" x2="256" y2="340" gradientUnits="userSpaceOnUse">
        <stop offset="0" style={{ stopColor: "var(--folder-circle-top)" }} />
        <stop offset="1" style={{ stopColor: "var(--folder-circle-bottom)" }} />
      </linearGradient>

      {/* Noise texture filter for subtle grain */}
      <filter id={`${id}-noise`} x="0%" y="0%" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" result="noise" />
        <feColorMatrix type="saturate" values="0" />
        <feBlend in="SourceGraphic" in2="noise" mode="multiply" result="blend" />
        <feComposite in="blend" in2="SourceGraphic" operator="in" />
      </filter>

      {/* Clip path for front folder shape */}
      <clipPath id={`${id}-frontClip`}>
        <rect x="21" y="68" width="470" height="352" rx="32" />
      </clipPath>
    </>
  )
}

// Back panel of the folder (can be used separately for layering)
export function FolderBack({ id }: { id: string }) {
  return (
    <g className="folder-back">
      {/* Back of folder - visible along top edge */}
      <path
        d="M78.6 420
           H433.4
           C453.5 420 463.6 420 471.3 416.1
           C478.1 412.6 483.6 407.1 487.1 400.3
           C491 392.6 491 382.5 491 362.4
           V110
           C491 90 491 80 487.1 72.3
           C483.6 65.5 478.1 60 471.3 56.5
           C463.6 52.6 453.5 52.6 433.4 52.6
           H238.75
           C228 52.6 214.25 51.6 200.75 41.35
           C187.25 31.1 198.75 39.85 184.5 28.85
           C170.25 17.85 162.98 15.6 150.5 15.6
           H78.6
           C58.4 15.6 48.4 15.6 40.7 19.5
           C33.9 23 28.4 28.5 24.9 35.3
           C21 43 21 53 21 73.2
           V362.4
           C21 382.5 21 392.6 24.9 400.3
           C28.4 407.1 33.9 412.6 40.7 416.1
           C48.4 420 58.4 420 78.6 420
           Z"
        fill={`url(#${id}-backGradient)`}
      />

      {/* Top edge highlight on back */}
      <path
        d="M78.6 15.6 H150.5 C162.98 15.6 170.25 17.85 184.5 28.85 C198.75 39.85 187.25 31.1 200.75 41.35 C214.25 51.6 228 52.6 238.75 52.6 H433.4 C453.5 52.6 463.6 52.6 471.3 56.5 C478.1 60 483.6 65.5 487.1 72.3 C491 80 491 90 491 110"
        fill="none"
        style={{ stroke: "var(--folder-highlight)" }}
        strokeWidth="1.5"
        strokeOpacity="0.25"
      />
    </g>
  )
}

// Front panel of the folder with circle and arrow (can be used separately for layering)
export function FolderFront({ id }: { id: string }) {
  return (
    <g className="folder-front">
      {/* Front of folder */}
      <rect
        x="21"
        y="68"
        width="470"
        height="352"
        rx="32"
        fill={`url(#${id}-frontGradient)`}
      />

      {/* Subtle texture overlay on front for grain effect */}
      <rect
        x="21"
        y="68"
        width="470"
        height="352"
        rx="32"
        fill="#ffffff"
        fillOpacity="0.10"
        filter={`url(#${id}-noise)`}
        style={{ mixBlendMode: 'multiply' }}
      />

      {/* Elements clipped to front folder shape */}
      <g clipPath={`url(#${id}-frontClip)`}>
        {/* Top highlight on front panel - now clipped */}
        <rect
          x="21"
          y="68"
          width="470"
          height="5"
          fill="#ffffff"
          fillOpacity="0.20"
        />

        {/* Bottom edge ridge lines - getting darker toward bottom */}
        <rect x="21" y="385" width="470" height="5" fill="#ffffff" fillOpacity="0.10" />
        <rect x="21" y="396" width="470" height="6" fill="#ffffff" fillOpacity="0.12" />
        <rect x="21" y="408" width="470" height="12" fill="#3A8FC3" fillOpacity="0.08" />
      </g>

      {/* Circle badge - centered on front panel (shifted down for visual centering) */}
      <circle
        cx="256"
        cy="255"
        r="82"
        fill={`url(#${id}-circleGradient)`}
      />

      {/* Download arrow icon - shifted down to center in circle */}
      <path
        d="M256 214 L256 284 M228 258 L256 286 L284 258"
        fill="none"
        style={{ stroke: "var(--folder-arrow)" }}
        strokeOpacity="0.85"
        strokeWidth="20"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  )
}

// Complete composed folder icon
export function Folder({ size = 220 }: { size?: number }) {
  const height = Math.round(size * FOLDER_ASPECT_RATIO)
  // Unique ID prefix to avoid conflicts when multiple instances render
  const id = `folder-${size}-${Math.random().toString(36).slice(2, 7)}`

  return (
    <div className="relative" style={{ width: size, height }}>
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox={FOLDER_VIEWBOX}
        fill="none"
        style={{ filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.12))" }}
      >
        <defs>
          <FolderDefs id={id} />
        </defs>
        <FolderBack id={id} />
        <FolderFront id={id} />
      </svg>
    </div>
  )
}

// Composable folder that allows inserting children between back and front layers
export function ComposableFolder({
  size = 220,
  children
}: {
  size?: number
  children?: React.ReactNode
}) {
  const height = Math.round(size * FOLDER_ASPECT_RATIO)
  const id = `folder-${size}-${Math.random().toString(36).slice(2, 7)}`

  return (
    <div className="relative" style={{ width: size, height }}>
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox={FOLDER_VIEWBOX}
        fill="none"
        style={{ filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.12))" }}
      >
        <defs>
          <FolderDefs id={id} />
        </defs>
        <FolderBack id={id} />
        {/* Children rendered between back and front layers */}
        {children}
        <FolderFront id={id} />
      </svg>
    </div>
  )
}
