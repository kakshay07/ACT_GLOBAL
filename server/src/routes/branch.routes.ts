import { Request, Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { branchModel } from "../models/branch.model";
import { ApiResponse } from "../utils/ApiResponse";
import { getId } from "../utils/db";
import { AuthenticatedRequest } from "../middlewares/auth.middlewares";


export const branchRouter = Router();

branchRouter.get(
    '/',
    asyncHandler(
      async (
        req: Request<
          unknown,
          unknown,
          unknown,
          { entity_id: string;}
        >,
        res
      ) => {
        const data = await branchModel.getAllBranches();
        if(data){
          res.json(new ApiResponse(200 , data))
        }else {
          throw new Error('Cannot get all branches')
        }
      }
    )
  );

  branchRouter.put(
    '/',
    asyncHandler(
      async (
        req: AuthenticatedRequest<
          unknown,
          unknown,
          {
            entity_id : number,
            branch_id : number,
            name : string,
            country:string,
            state:string,
            city:string
          }
          
        >,
        res
      ) => {
        const data = req.body;
        const mo_by=req.user.user_id
        const response = await branchModel.updatebranch({...data,mo_by:mo_by})
        if(response){
          res.json(new ApiResponse(200 , {} , 'Updated successfully'))
        }else {
          throw new Error('Could not update')
        }
      }
    )
  );

  branchRouter.post(
    '/',
    asyncHandler(
      async (
        req: AuthenticatedRequest<
          unknown,
          unknown,
          {
            entity_id : string,
            name : string,
            country:string,
            state:string,
            city:string
          }
        >,
        res
      ) => {
        const data = req.body;
        const cr_by=req.user.user_id
        const response = await branchModel.AddBranch({...data,cr_by:cr_by})
        if(response){
          res.json(new ApiResponse(200 , {} , 'Branch added successfully'))
        }else {
          throw new Error('Could not Add')
        }
      }
    )
  )

  branchRouter.get(
    '/getBranchByEntity',
    asyncHandler(
      async (
        req: Request<
          unknown,
          unknown,
          unknown,
          { entity_id: string;}
        >,
        res
      ) => {
        const data = await branchModel.getAllBranches(req.query.entity_id);
        if(data){
          res.json(new ApiResponse(200 , data))
        }else {
          throw new Error('Cannot get all branches')
        }
      }
    )
  );