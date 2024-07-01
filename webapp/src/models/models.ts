export type AuthCheck = {
  iss: string;
  exp: number;
  iat: number;
  name: string;
  nickname: string;
  picture: string;
  email_verified: boolean;
  updated_at: string;
};
