import { APIError, APIService, APIServiceInstance } from "../services/api";

import { useNavigate } from "react-router";
import { useStore } from "../services/store";

const apiServiceInstance = APIServiceInstance;

const useApi = () => {
  const setLoggedIn = useStore((s) => s.setLoggedIn);
  const nav = useNavigate();

  async function fetch<R>(
    req: (c: APIService) => Promise<R>
  ): Promise<R | undefined> {
    try {
      return await req(apiServiceInstance);
    } catch (e) {
      if (e instanceof APIError) {
        if (e.status === 401) {
          nav("/login");
          setLoggedIn(false);
          return undefined;
        }

        // TODO: Dispaly error snackbar or whatever
        // return null;
      }

      throw e;
    }
  }

  return fetch;
};

export default useApi;
