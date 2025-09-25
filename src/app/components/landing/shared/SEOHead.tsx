import Head from "next/head";

export const SEOHead = () => {
  return (
    <Head>
      <title>
        Kalam AI - Enterprise Cultural Intelligence Platform | Prevent $80B
        Communication Losses
      </title>
      <meta
        name="description"
        content="AI-powered cross-cultural communication platform for Fortune 500 enterprises. Prevent cultural miscommunication, ensure compliance, accelerate knowledge transfer with measurable ROI."
      />
      <meta
        name="keywords"
        content="enterprise cultural intelligence, cross-cultural communication AI, cultural risk management, compliance automation, knowledge transfer, nationalization programs, GCC compliance, multinational corporations"
      />

      {/* Open Graph */}
      <meta
        property="og:title"
        content="Kalam AI - Eliminate $80B in Enterprise Communication Losses"
      />
      <meta
        property="og:description"
        content="Enterprise-grade cultural intelligence platform that prevents costly miscommunication and ensures regulatory compliance with measurable ROI."
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://kalamAI.com" />
      <meta
        property="og:image"
        content="https://kalamAI.com/og-enterprise.jpg"
      />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta
        name="twitter:title"
        content="Kalam AI - Enterprise Cultural Intelligence Platform"
      />
      <meta
        name="twitter:description"
        content="Prevent cultural miscommunication incidents and ensure compliance with AI-powered cultural intelligence for Fortune 500 enterprises."
      />
      <meta
        name="twitter:image"
        content="https://kalamAI.com/twitter-enterprise.jpg"
      />

      {/* Technical */}
      <link rel="canonical" href="https://kalamAI.com" />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Business Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Kalam AI",
            applicationCategory: "BusinessApplication",
            description:
              "Enterprise cultural intelligence platform for preventing cross-cultural miscommunication and ensuring compliance",
            offers: {
              "@type": "Offer",
              price: "Custom",
              priceCurrency: "USD",
            },
            operatingSystem: "Web-based",
          }),
        }}
      />

      {/* Favicon */}
      <link rel="icon" href="/favicon-enterprise.ico" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon-enterprise.png"
      />

      <html lang="en" dir="ltr" />
    </Head>
  );
};
