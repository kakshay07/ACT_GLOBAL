import { Request, Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import {cityModel} from '../models/cities.models'
import { ApiResponse } from "../utils/ApiResponse";


export const cityRouter=Router();


cityRouter.get(
    '/',
    asyncHandler(
      async (
        req: Request<
          unknown,
          unknown,
          unknown,
          {state_code:string;}
        >,
        res
      ) => {
        const {state_code}=req.query;
        const data = await cityModel.getAllCityWithStateCode({state_code});
        if(data){
          res.json(new ApiResponse(200 , data))
        }else {
          throw new Error('something went wrong!')
        }
      }
    )
  );

  cityRouter.post(
    '/',
    asyncHandler(
      async (
        req: Request<
          unknown,
          unknown,
          {
            CITY_NAME?:number;
            STATE_CODE?:number;
          },
          unknown
        >,
        res
      ) => {
        const data = await cityModel.AddCity(req.body);
        if(data){
          res.json(new ApiResponse(200 , {},'City added successfully'))
        }else {
          throw new Error('something went wrong!')
        }
      }
    )
  );

  cityRouter.put(
    '/',
    asyncHandler(
      async (
        req: Request<
          unknown,
          unknown,
          { CITY_CODE?:number;
            CITY_NAME?:number;
            STATE_CODE?:number;
          },
          unknown
        >,
        res
      ) => {
        const data = await cityModel.UpdateCity(req.body);
        if(data){
          res.json(new ApiResponse(200 , {},'City updated successfully'))
        }else {
          throw new Error('something went wrong!')
        }
      }
    )
  );