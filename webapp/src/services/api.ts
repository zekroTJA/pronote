import { AuthCheck } from "../models/models";

const ROOT_URL =
  import.meta.env.REACT_APP_API_ROOT_URL ??
  (import.meta.env.NODE_ENV === "production"
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
}

export const APIServiceInstance = new APIService();
