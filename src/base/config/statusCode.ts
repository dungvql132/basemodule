export interface IStatusCode {
  SUCCESS: string;
  BAD_REQUEST: string;
  BAD_REQUEST_REQUIRED: string;
  BAD_REQUEST_INVALID_FORMAT: string;
  UNAUTHORIZED: string;
  FORBIDDEN: string;
  FORBIDDEN_TOKEN_EXPIRED: string;
  NOT_FOUND: string;
  DUPLICATE: string;
  INTERNAL_SERVER_ERROR: string;
}

export const StatusCode: IStatusCode = {
  SUCCESS: "200000",
  // Bad Request
  BAD_REQUEST: "400000",
  BAD_REQUEST_REQUIRED: "400001",
  BAD_REQUEST_INVALID_FORMAT: "400002",
  // Unauthorized
  UNAUTHORIZED: "401000",
  // Forbidden
  FORBIDDEN: "403000",
  FORBIDDEN_TOKEN_EXPIRED: "403001",
  // Not Found
  NOT_FOUND: "404000",
  // DUPLICATE
  DUPLICATE: "409000",
  // Internal Server Error
  INTERNAL_SERVER_ERROR: "500000",
};
