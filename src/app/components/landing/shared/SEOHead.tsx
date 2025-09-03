import Head from "next/head";
export const SEOHead = () => {
  return (
    <Head>
      <title>
        KalamAI - AI English Learning for Arabic Speakers | Cultural Context &
        Real Scenarios
      </title>
      <meta
        name="description"
        content="Master English conversation with KalamAI - AI-powered learning designed for Arabic speakers. Real mosque & business scenarios, cultural context, prayer-respectful timing. Start free today!"
      />
      <meta
        name="keywords"
        content="English learning Arabic speakers, AI English tutor, mosque English training, Arabic English conversation, cultural English learning, Islamic English education"
      />

      {/* Open Graph */}
      <meta
        property="og:title"
        content="KalamAI - AI English Learning Built for Arabic Speakers"
      />
      <meta
        property="og:description"
        content="Bridge languages, build connections. AI-powered English learning with cultural understanding and real-world scenarios for Arabic speakers."
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://kalamAI.com" />
      <meta property="og:image" content="https://kalamAI.com/og-image.jpg" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta
        name="twitter:title"
        content="KalamAI - AI English Learning for Arabic Speakers"
      />
      <meta
        name="twitter:description"
        content="Master English conversation with cultural context. Real scenarios, prayer-respectful timing, built for Arabic speakers."
      />
      <meta
        name="twitter:image"
        content="https://kalamAI.com/twitter-image.jpg"
      />

      {/* Technical */}
      <link rel="canonical" href="https://kalamAI.com" />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Performance */}
      <link
        rel="preload"
        href="/fonts/arabic-font.woff2"
        as="font"
        type="font/woff2"
        crossOrigin=""
      />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />

      {/* Additional for Arabic/RTL support */}
      <html lang="en" dir="ltr" />
    </Head>
  );
};
