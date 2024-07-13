import {
  AuthCheck,
  Item,
  ItemUpdate,
  List,
  ListResponse,
  ListUpdate,
} from "../models/models";

const ROOT_URL =
  import.meta.env.VITE_API_ROOT_URL ??
  (import.meta.env.PROD
    ? "/api"
    : "http://localhost:8000/api");

export type HttpMethod =
  | "GET"
  | "PUT"
  | "POST"
  | "DELETE"
  | "PATCH"
  | "OPTIONS";

export class APIError extends Error {
  constructor(private _res: Response) {
    super(
      _res?.status ? `request error: ${_res?.status}` : "unknown request error"
    );
  }

  get response() {
    return this._res;
  }

  get status() {
    return this._res.status;
  }
}

export class HttpClient {
  constructor(private _rootUrl: string) {}

  get rootUrl(): string {
    return this._rootUrl;
  }

  async req<R>(method: HttpMethod, path: string, body?: object): Promise<R> {
    const headers = new Headers();
    headers.append("Accept", "application/json");

    let bodyData = undefined;

    if (body) {
      headers.set("Content-Type", "application/json");
      bodyData = JSON.stringify(body);
    }

    const res = await window.fetch(`${this._rootUrl}/${path}`, {
      method,
      headers,
      body: bodyData,
      credentials: "include",
    });

    if (res.status === 204) {
      return {} as R;
    }

    if (res.status >= 400) {
      throw new APIError(res);
    }

    return (await res.json()) as R;
  }
}

export class APIService extends HttpClient {
  constructor() {
    super(ROOT_URL);
  }

  redirectLogin(redirect: string) {
    window.location.assign(`${this.rootUrl}/auth/login?redirect=${redirect}`);
  }

  authCheck(): Promise<AuthCheck> {
    return this.req("GET", "auth/check");
  }

  lists(): Promise<ListResponse<List>> {
    return this.req("GET", "lists");
  }

  list(id: string): Promise<List> {
    return this.req("GET", `lists/${id}`);
  }

  add_list(list: ListUpdate): Promise<List> {
    return this.req("POST", "lists", list);
  }

  update_list(id: string, list: ListUpdate): Promise<void> {
    return this.req("POST", `lists/${id}`, list);
  }

  delete_list(id: string): Promise<void> {
    return this.req("DELETE", `lists/${id}`);
  }

  items(list_id: string): Promise<ListResponse<Item>> {
    return this.req("GET", `lists/${list_id}/items`);
  }

  add_items(list_id: string, item: ItemUpdate): Promise<Item> {
    return this.req("POST", `lists/${list_id}/items`, item);
  }

  update_items(list_id: string, id: string, item: ItemUpdate): Promise<void> {
    return this.req("POST", `lists/${list_id}/items/${id}`, item);
  }

  delete_items(list_id: string, id: string): Promise<void> {
    return this.req("DELETE", `lists/${list_id}/items/${id}`);
  }
}

export const APIServiceInstance = new APIService();
