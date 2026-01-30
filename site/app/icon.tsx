import { ImageResponse } from 'next/og'

export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="32" height="32" viewBox="0 0 32 32">
          {/* Left half - gray */}
          <path
            d="M16 2 A14 14 0 0 0 16 30"
            fill="#d4d4d4"
          />
          {/* Right half - blue */}
          <path
            d="M16 2 A14 14 0 0 1 16 30"
            fill="hsl(208, 100%, 66%)"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}
