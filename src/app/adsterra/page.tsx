// src/app/adsterra/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  robots: 'noindex, nofollow',
};

const ADSTERRA_ID = 'ecb2cd420ef4bb991c56a3f5061b33e7';

export default function AdsterraPage() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Ad</title>
      </head>
      <body>
        <script
          async
          data-cfasync="false"
          src={`https://levitydinerdowny.com/${ADSTERRA_ID}/invoke.js`}
        />
        <div id={`container-${ADSTERRA_ID}`} />
      </body>
    </html>
  );
}