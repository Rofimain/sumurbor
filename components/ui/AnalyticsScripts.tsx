"use client";

import Script from "next/script";

interface AnalyticsScriptsProps {
  ga4Id?: string;
  gtmId?: string;
}

/**
 * Injects GA4 and/or GTM. IDs come from CMS settings (server-rendered props).
 * Not loaded on /admin routes.
 */
export function AnalyticsScripts({ ga4Id, gtmId }: AnalyticsScriptsProps) {
  if (!ga4Id && !gtmId) return null;

  return (
    <>
      {gtmId && (
        <Script id="gtm-init" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`}
        </Script>
      )}

      {ga4Id && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-config" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${ga4Id}', {
                anonymize_ip: true,
                send_page_view: true
              });
            `}
          </Script>
        </>
      )}
    </>
  );
}

/** GTM noscript fallback — place immediately after <body> */
export function GtmNoScript({ gtmId }: { gtmId?: string }) {
  if (!gtmId) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}
