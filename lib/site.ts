export const getSiteUrl = (): string | undefined => {
  const value = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  return value || undefined;
};
