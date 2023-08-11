export interface IRefreshTokenPayload {
  email: string;
  id: number;
  secretKey: string;
}

export interface IAccessTokenPayload {
  email: string;
}
