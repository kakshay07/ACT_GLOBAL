import { Request, Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import {stateModel} from '../models/state.models'
import { ApiResponse } from "../utils/ApiResponse";


export const stateRouter=Router();


stateRouter.get(
    '/',
    asyncHandler(
      async (
        req: Request<
          unknown,
          unknown,
          unknown,
        {country_code:string;}
        >,
        res
      ) => {
        const {country_code}=req.query
        const data = await stateModel.getAllStateWithCountryCode({country_code});
        if(data){
          res.json(new ApiResponse(200 , data))
        }else {
          throw new Error('something went wrong!')
        }
      }
    )
  );

  stateRouter.post(
    '/',
    asyncHandler(
      async (
        req: Request<
          unknown,
          unknown,
          {
            STATE_NAME:string;
           COUNTRY_CODE:number;
           TIN_CODE:number;
           STATE_GST_CODE:number | string;
           GST:number | string
          },
          unknown
       
        >,
        res
      ) => {
        const data = await stateModel.AddState(req.body);
        if(data){
          res.json(new ApiResponse(200 , {},'State added successfully'))
        }else {
          throw new Error('something went wrong!')
        }
      }
    )
  );

  stateRouter.put(
    '/',
    asyncHandler(
      async (
        req: Request<
          unknown,
          unknown,
          {
            STATE_NAME:string;
           COUNTRY_CODE:number;
           TIN_CODE:number;
           STATE_GST_CODE:number | string;
           GST:number | string
          },
          unknown
       
        >,
        res
      ) => {
        const data = await stateModel.UpdateState(req.body);
        if(data){
          res.json(new ApiResponse(200 , {},'State updated successfully'))
        }else {
          throw new Error('something went wrong!')
        }
      }
    )
  );