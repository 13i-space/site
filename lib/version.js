// The site's version (Update 5.56). Bump SITE_VERSION with each update - it
// matches the "Ver x.yy" in commit messages and docs/CHANGELOG.md. The
// commit and deploy details come from Vercel's own environment variables.
export const SITE_VERSION = "5.57";

export function versionInfo() {
  const sha = process.env.VERCEL_GIT_COMMIT_SHA || "";
  return {
    version: SITE_VERSION,
    commit: sha ? sha.slice(0, 7) : null,
    message: (process.env.VERCEL_GIT_COMMIT_MESSAGE || "").split("\n")[0].slice(0, 90) || null,
    branch: process.env.VERCEL_GIT_COMMIT_REF || null,
    env: process.env.VERCEL_ENV || (process.env.NODE_ENV === "production" ? "production" : "development"),
  };
}
