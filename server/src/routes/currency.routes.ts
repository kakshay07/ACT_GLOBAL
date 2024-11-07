import { Request, Router } from "express";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { currencyModel } from "../models/currency.model";


export const CurrencyRouter = Router();

CurrencyRouter.get(
    '/',
    asyncHandler(
      async (
        req: Request<
          unknown,
          unknown,
          unknown,{entity_id:string;}
        >,
        res
      ) => {
        const data = await currencyModel.getAllCurrency();
        if(data){
          console.log(data)
          res.json(new ApiResponse(200 , data))
        }else {
          throw new Error('something went wrong!')
        }
      }
    )
  );

CurrencyRouter.post(
    '/',
    asyncHandler(
      async (
        req: Request<
          unknown,
          unknown,
          {
            CURR_CODE?:string  ;
            CURR_NAME?:string ;
            CURR_SHORT_NOTATION?:string;
          }
          ,{entity_id:string;}
        >,
        res
      ) => {
        console.log(req.body,">>>>>>>>>>>>>>>>>>>>>>>>>>>");
        
        const response = await currencyModel.AddCurrency(req.body);
        console.log(response,">>>>>>>>>>>>>>>>>>>>>>>>>>>123");
        if(response){
          res.json(new ApiResponse(200 , {},'Added succesfuly'))
        }else {
          throw new Error('something went wrong!')
        }
      }
    )
  );

  CurrencyRouter.put(
    '/',
    asyncHandler(
      async (
        req: Request<
          unknown,
          unknown,
          {
            CURR_CODE?:string  ;
            CURR_NAME?:string ;
            CURR_SHORT_NOTATION?:string;
          }
          ,unknown
        >,
        res
      ) => {
        const response = await currencyModel.UpdateCurrency(req.body);
        if(response){
          res.json(new ApiResponse(200 , {},'Updated succesfuly'))
        }else {
          throw new Error('something went wrong!')
        }
      }
    )
  );