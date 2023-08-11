export interface IApiResponse<T = any> {
  code: string;
  message: string;
  data?: T | T[];
  accessToken?: string;
  refreshToken?: string;
}
