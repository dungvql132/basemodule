import i18n from "i18next";
import { type Request, type Response, type NextFunction } from "express";
import { asyncHandler } from "@src/base/utils";
import { ApiNotFoundError } from "@src/base/interface/ApiError";

export const changeLanguageMiddleware = asyncHandler(async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const language = req.query.lang ? req.query.lang : "english";
  i18n.changeLanguage(String(language), (err, t) => {
    console.log("language: ", language);
    if (err) next(new ApiNotFoundError("Lang", err.message));
    next();
  });
});
