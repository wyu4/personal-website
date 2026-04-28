export function getFromServer(api: Endpoint) {
  return fetch(api, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  }) as Promise<unknown>;
}

let repositories: Repository[] | undefined = undefined;
export async function getRepositories() {
  if (!repositories) {
    const data = (await getFromServer("/api/repositories")) as Repository[];
    if (data) {
      repositories = data;
    }
  }

  return repositories;
}
