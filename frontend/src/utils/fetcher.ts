import { type paths } from "../../types/generated-shema";

type FetchOption<Method = "get"> = RequestInit & { method: Method };
type ResponseWithStatus<Status extends number> = {
  responses: Record<Status, { content: { "application/json": any } }>;
};
type SuccessRespose<Endpoint> = Endpoint extends ResponseWithStatus<200>
  ? Endpoint["responses"][200]["content"]["application/json"]
  : Endpoint extends ResponseWithStatus<201>
  ? Endpoint["responses"][201]["content"]["application/json"]
  : null;

export const fetcher = async <
  Paths extends keyof paths,
  Method extends keyof paths[Paths]
>(
  path: Paths,
  option?: FetchOption<Method>
): Promise<SuccessRespose<paths[Paths]>> => {
  return await fetch(path, option).then((res) => res.json());
};
export async function Demo() {
  const data = await fetcher("/auth/login");
  data;
}
