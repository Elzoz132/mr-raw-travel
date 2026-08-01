'use client'

import React from 'react'
import Script from 'next/script'

export const Pixels: React.FC = () => {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID
  const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID

  const shouldLoadGA = Boolean(GA_ID && GA_ID !== 'G-MRRAW12345' && GA_ID !== 'G-XXXXXXXXXX')
  const shouldLoadFB = Boolean(FB_PIXEL_ID && FB_PIXEL_ID !== '1234567890')

  return (
    <>
      {/* Google Analytics 4 */}
      {shouldLoadGA && (
        <>
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            onError={() => {}}
          />
          <Script
            id="gtag-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                try {
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_ID}', { page_path: window.location.pathname });
                } catch(e) {}
              `,
            }}
          />
        </>
      )}

      {/* Meta Facebook Pixel */}
      {shouldLoadFB && (
        <Script
          id="fb-pixel-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              try {
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.onerror=function(){};
                t.src=v;s=b.getElementsByTagName(e)[0];
                if(s&&s.parentNode)s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                if(window.fbq){
                  fbq('init', '${FB_PIXEL_ID}');
                  fbq('track', 'PageView');
                }
              } catch(e) {}
            `,
          }}
        />
      )}
    </>
  )
}
