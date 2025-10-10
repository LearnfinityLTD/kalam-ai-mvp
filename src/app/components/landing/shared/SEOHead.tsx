import Head from "next/head";

export const SEOHead = () => {
  return (
    <Head>
      <title>
        VerifyLearn - Independent Course Quality Verification | Trust Scores for
        Online Education
      </title>
      <meta
        name="description"
        content="Independent third-party verification for online courses. Get honest quality scores, plagiarism checks, and credential verification before you buy. Stop wasting money on bad courses."
      />
      <meta
        name="keywords"
        content="course verification, online course quality, course reviews, independent course rating, plagiarism check, instructor credentials, Udemy verification, Coursera quality, online learning trust"
      />

      {/* Open Graph */}
      <meta
        property="og:title"
        content="VerifyLearn - Stop Buying Bad Online Courses"
      />
      <meta
        property="og:description"
        content="Independent verification catches what student reviews miss: plagiarism, fake credentials, and outdated content. Get honest VerifyScores before you buy."
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://verifylearn.com" />
      <meta
        property="og:image"
        content="https://verifylearn.com/og-image.jpg"
      />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta
        name="twitter:title"
        content="VerifyLearn - Independent Course Quality Verification"
      />
      <meta
        name="twitter:description"
        content="We verify online courses for plagiarism, accuracy, and teaching quality. Stop wasting money on bad courses - check VerifyScores first."
      />
      <meta
        name="twitter:image"
        content="https://verifylearn.com/twitter-card.jpg"
      />

      {/* Technical */}
      <link rel="canonical" href="https://verifylearn.com" />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Schema Markup - Rating/Review Service */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "VerifyLearn",
            description:
              "Independent third-party verification service for online courses. We provide honest quality scores, plagiarism detection, and credential verification.",
            url: "https://verifylearn.com",
            logo: "https://verifylearn.com/logo.png",
            sameAs: [
              "https://twitter.com/verifylearn",
              "https://linkedin.com/company/verifylearn",
            ],
            contactPoint: {
              "@type": "ContactPoint",
              contactType: "Customer Support",
              email: "hello@verifylearn.com",
            },
          }),
        }}
      />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />

      {/* Language */}
      <meta httpEquiv="content-language" content="en" />
    </Head>
  );
};
