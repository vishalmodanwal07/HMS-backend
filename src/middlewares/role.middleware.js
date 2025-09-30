import { ApiError } from "../utils/apiError.js";

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, `Role '${req.user.role}' not allowed to access this resource`);
    }
    next();
  };
};