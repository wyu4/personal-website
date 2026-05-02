import { GITHUB_LOGIN } from "./environment";

/**
 * Create a default cache header for API returns
 * @param maxAge Maximum age of cache in seconds
 * @param staleAge Maximum stale state of cache in seconds (continue returning old cache while retrieving new one)
 * @returns Header object with `Cache-Control` header
 */
export function createCacheHeaders(maxAge: number = 60, staleAge: number = 30): HeadersInit {
  return {
    "Cache-Control": `public, max-age=${maxAge}, stale-while-revalidate=${staleAge}`,
  };
}

/**
 * Send a GET request to the server
 * @param api API to connect to
 * @returns Promise for the GET request
 */
export function getFromServer(api: Endpoint) {
  return fetch(api, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
}

let repositories: Repository[] | undefined = undefined;
/**
 * Get the user's repositories. If this is the first time this method is called, it will fetch the data using {@link getFromServer}. Otherwise, a cached result is returned.
 * @returns Repositories
 */
export async function getRepositories() {
  if (!repositories) {
    const response = await getFromServer("/api/repositories");
    if (!response.ok) {
      return;
    }

    const parsed = (await response.json()) as Repository[] | undefined;
    if (parsed) {
      repositories = parsed;
    }
  }

  return repositories;
}

let languages: LanguageMetadata[] | undefined = undefined;
/**
 * Get the user's languages. If this is the first time this method is called, it will fetch the data using {@link getFromServer}. Otherwise, a cached result is returned.
 * @returns Languages
 */
export async function getLanguages() {
  if (!languages) {
    const response = await getFromServer("/api/repositories/languages");
    if (!response.ok) {
      return;
    }

    const parsed = (await response.json()) as LanguageMetadata[] | undefined;
    if (parsed) {
      languages = parsed;
    }
  }

  return languages;
}

let contributions: GithubContributionAPIResponse | undefined = undefined;
export async function getContributions() {
  if (!contributions) {
    const response = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${GITHUB_LOGIN}?y=last`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      },
    );
    if (!response.ok) {
      return undefined;
    }
    contributions = (await response.json()) as GithubContributionAPIResponse;
  }

  return contributions;
}
