export const apiFetch = async <T>(
  url: string,
  { json, method }: { json?: Record<string, unknown>; method?: string } = {}
) => {
  method ??= json ? "POST" : "GET";

  const body = json ? JSON.stringify(json) : undefined;
  const res = await fetch("http://localhost:5000/api" + url, {
    method,
    credentials: "include",
    body,
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
  });

  if (res.ok) {
    return res.json() as Promise<T>;
  }
  throw new ApiError(res.status, await res.json());
};
class ApiError extends Error {
  constructor(public status: number, public data: Record<string, unknown>) {
    if (status === 401) {
      window.location.reload();
    }
    super();
  }
}
