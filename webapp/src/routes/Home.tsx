import { useEffect, useState } from "react";

import { AuthCheck } from "../models/models";
import useApi from "../hooks/useApi";

const Home: React.FC = () => {
  const fetch = useApi();

  const [me, setMe] = useState<AuthCheck | undefined>(undefined);

  useEffect(() => {
    fetch((c) => c.authCheck()).then((v) => setMe(v));
  }, []);

  return <>{(me && <p>Welcome, {me.nickname}!</p>) || <p>Loading ...</p>}</>;
};

export default Home;
