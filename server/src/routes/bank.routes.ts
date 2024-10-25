import { Request, Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import {bankModel} from '../models/bank.models'


export const bankRouter=Router();

// bank name
bankRouter.get(
    '/',
    asyncHandler(
      async (
        req: Request<
          unknown,
          unknown,
          unknown,
          unknown
        //   {}
        >,
        res
      ) => {
        const data = await bankModel.getBankName();
        if(data){
          res.json(new ApiResponse(200 , data))
        }else {
          throw new Error('something went wrong!')
        }
      }
    )
  );

//   bank account type
  bankRouter.get('/accounttype',
    asyncHandler(
        async (
          req: Request<
            unknown,
            unknown,
            unknown,
            unknown
          //   {}
          >,
          res
        ) => {
          const data = await bankModel.getBankType();
          if(data){
            res.json(new ApiResponse(200 , data))
          }else {
            throw new Error('something went wrong!')
          }
        }
      )

  )


  bankRouter.post(
    '/',
    asyncHandler(
      async (
        req: Request<
          unknown,
          unknown,
         {
          BANK_CODE?:string;
          BANK_DESC?:string;
         },
          unknown
        //   {}
        >,
        res
      ) => {
        const data = await bankModel.AddBank(req.body);
        if(data){
          res.json(new ApiResponse(200 , {},"Added succesfully"))
        }else {
          throw new Error('something went wrong!')
        }
      }
    )
  );

  bankRouter.put(
    '/',
    asyncHandler(
      async (
        req: Request<
          unknown,
          unknown,
         {ORDER_SL?:number;
          BANK_CODE?:string;
          BANK_DESC?:string;
         },
          unknown
        //   {}
        >,
        res
      ) => {
        const data = await bankModel.UpdateBank(req.body);
        if(data){
          res.json(new ApiResponse(200 , {},"Updated succesfully"))
        }else {
          throw new Error('something went wrong!')
        }
      }
    )
  );