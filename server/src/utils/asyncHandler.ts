import { Request, Response, NextFunction } from 'express';


const asyncHandler = (
  requestHandler: (
    req: Request<any , any ,any , any>,
    res: Response,
    next: NextFunction
  ) => void
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) =>
      next(err)
    );
  };
};

export { asyncHandler };