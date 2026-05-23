export default function robots() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lucas-automation.vercel.app";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/private/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
