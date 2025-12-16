'use client'

import { useEffect, useRef } from 'react'
import Script from 'next/script'

interface FacebookPostProps {
  url: string
  width?: number
}

export function FacebookPost({
  url,
  width = 500,
}: FacebookPostProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.FB && containerRef.current) {
      window.FB.XFBML.parse(containerRef.current)
    }
  }, [url])

  return (
    <div ref={containerRef}>
      <div
        className="fb-post"
        data-href={url}
        data-width={width}
      />

      <Script
        src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0"
        strategy="lazyOnload"
        onLoad={() => {
          if (window.FB && containerRef.current) {
            window.FB.XFBML.parse(containerRef.current)
          }
        }}
      />
    </div>
  )
}
