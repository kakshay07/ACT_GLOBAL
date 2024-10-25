import { Router, Response } from 'express';
import { pincodeModel } from '../models/pincode.models';
import { AuthenticatedRequest, authMiddleware } from '../middlewares/auth.middlewares';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';

export const pincodeRouter = Router();

pincodeRouter.use(authMiddleware);

pincodeRouter.get(
    '/',
    asyncHandler(
        async (
        req: AuthenticatedRequest<
          unknown,
          unknown,
          unknown,
          { state_code: string; city_code: string; limit: number; page: number }
        >,
        res: Response
      ) => {
        const data = await pincodeModel.getPincodeMaster(
          req.query.state_code,
          req.query.city_code,
          req.query.page || 0,
          req.query.limit || 15,
        );
        const modifiedResults = data.data.map((row: { sl: { toString: () => any; }; }) => ({
          ...row,
          sl: row.sl ? row.sl.toString() : row.sl  // Convert sl to string if it's a BigInt
        }));
        console.log(modifiedResults,"sasaskfufjfy")
        res.json(new ApiResponse(200 , modifiedResults));
      }
    )
);

//  THIS IS USED ONLY FOR GETTING STATE AND CITY BASED ON PINCODE
pincodeRouter.get(
  '/getdata',
  asyncHandler(
      async (
      req: AuthenticatedRequest<
        unknown,
        unknown,
        unknown,
        { pincode: number}
      >,
      res: Response
    ) => {
      const data = await pincodeModel.getDataUsingPincodeParam(req.query.pincode
      );
      res.json(new ApiResponse(200 , data.data));
    }
  )
);

pincodeRouter.post('/', asyncHandler(async (req: AuthenticatedRequest<
    unknown,
    unknown,
    {
        pincode: number,
        country_code: string,
        state_code: string,
        city_code: string,
        district: string,
        area: string,
    },
    unknown
    
  >, res: Response) => {
    const data = await pincodeModel.addPincodeMaster(req.body);
    if(data){
      res.json(new ApiResponse(200 , {} , 'Pincode added successfully'));
    }
}));

pincodeRouter.put('/', asyncHandler(async (req: AuthenticatedRequest<
    unknown,
    unknown,
    {
        sl: string,
        pincode: number,
        country_code: string,
        state_code: string,
        city_code: string,
        district: string,
        area: string,
        is_active: string
    },
    unknown
    
  >, res: Response) => {
    const data = await pincodeModel.updatePincodeMaster(req.body);
    if(data){
      res.json(new ApiResponse(200 , {} , 'Pincode updated successfully'));
    }
}));
