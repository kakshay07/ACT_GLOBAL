import { Request, Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import {countryModel} from '../models/country.models'
import { ApiResponse } from "../utils/ApiResponse";


export const countryRouter=Router();


countryRouter.get(
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
        const data = await countryModel.getAllCountryWithCode();
        if(data){
          console.log(data)
          res.json(new ApiResponse(200 , data))
        }else {
          throw new Error('something went wrong!')
        }
      }
    )
  );
  countryRouter.post(
    '/',
    asyncHandler(
      async (
        req: Request<
          unknown,
          unknown,
          {
            country_code?:string  ;
            country_iso?:string ;
            country_name?:string;
            country_phone?:number;
          }
          ,{entity_id:string;}
        >,
        res
      ) => {
        const response = await countryModel.AddCountry(req.body);
        if(response){
          res.json(new ApiResponse(200 , {},'Added succesfuly'))
        }else {
          throw new Error('something went wrong!')
        }
      }
    )
  );

  countryRouter.put(
    '/',
    asyncHandler(
      async (
        req: Request<
          unknown,
          unknown,
          {
            country_code?:string;
            country_iso?:string ;
            country_name?:string;
            country_phone?:number;
          }
          ,unknown
        >,
        res
      ) => {
        const response = await countryModel.UpdateCountry(req.body);
        if(response){
          res.json(new ApiResponse(200 , {},'Updated succesfuly'))
        }else {
          throw new Error('something went wrong!')
        }
      }
    )
  );