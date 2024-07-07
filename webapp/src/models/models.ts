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

export type ListResponse<I> = {
  count: number;
  items: I[];
};

export type ListUpdate = {
  name: string;
  description?: string;
  timeout_seconds?: number;
};

export type List = ListUpdate & {
  id: string;
  owner_id: string;
  created_at: string;
};

export enum Part {
  Top = "top",
  Bottom = "bottom",
  Expired = "expired",
}

export type ItemUpdate = {
  title: string;
  description?: string;
  part: Part;
};

export type Item = ItemUpdate & {
  id: string;
  list_id: string;
  created_at: string;
  edited_at: string;
  expires_in_seconds?: number;
  expires_at?: string;
};
