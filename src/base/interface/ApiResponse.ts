import { Response } from "express";

export interface IApiResponse<T = any> {
  responseStatus: number;
  message: string;
  data?: T | T[];
  accessToken?: string;
  refreshToken?: string;
}

// create Response for API
export class ApiResponse {
  apiResponse: IApiResponse<any>;
  constructor(res, apiResponse: IApiResponse) {
    this.apiResponse = apiResponse;
  }

  send(res: Response): void {
    res.status(this.apiResponse.responseStatus).json(this.apiResponse);
  }
}
