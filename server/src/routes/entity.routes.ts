import { Request, Response, Router } from 'express';
import { Entity } from '../models/entity.models';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthenticatedRequest } from '../middlewares/auth.middlewares';

export const entityRouter = Router();

entityRouter.get(
  '/',
  asyncHandler(
    async (
      req: Request<unknown, unknown, unknown, { entity_id: number }>,
      res: Response
    ) => {
      
      const data = await Entity.get_entity(req.query.entity_id);
      if (!data) {
        return;
      }
      console.log(data);
      
      res.json(new ApiResponse(200 , data.data , 'success'));
    }
  )
  
);

// entityRouter.get(
//   '/name',
//   async (
//     req: Request<unknown, unknown, unknown, { entity_id: number }>,
//     res: Response
//   ) => {
//     // const data = ;
//     res.json(await Entity.get_name(req.query.entity_id));
//   }
// );

entityRouter.post('/', asyncHandler(async (req: AuthenticatedRequest<
  unknown,
  unknown,
  {
    entity_id:number;
    name:string;
    short_desc:string;
    address:string;
    email:string;
    reg_num:string;
    estab_date:string;
    expiry_date:string;
    bank_ac_num:string;
    bank_ifsc:string;
    bank_name:string;
    bank_location:string;
    gst_no:string;
    country: string;
    state: string;
    city: string;
    pincode: string 
    additional_info:string ;
  }

  >, res) => {
  const data = req.body;
  const cr_by = req.user.user_id
  const e_id = await Entity.add(data,cr_by);
  
  if(e_id){
    res.send(new ApiResponse(200 , {'entity_id' : e_id.toString()} , 'Added successfully'));
  }else{
    res.json(new ApiResponse(400 , {} , 'Failed'));
  }
  
  
  
  // for (const office_bearer of data.office_bearer) {
  //   office_bearer.entity_id = e_id;
  //   await OfficeBearerModel.add(office_bearer);
  // }
  
}));

entityRouter.put('/', asyncHandler(async (req: AuthenticatedRequest<
  unknown,
  unknown,
  {
    entity_id:number;
    name:string;
    short_desc:string;
    address:string;
    email:string;
    reg_num:string;
    estab_date:string;
    expiry_date:string;
    bank_ac_num:string;
    bank_ifsc:string;
    bank_name:string;
    bank_location:string;
    gst_no:string;
    country: string;
    state: string;
    city: string;
    pincode: string 
    additional_info:string;
  }>, res) => {
  const data = req.body;
  const mo_by = req.user.user_id
  const response = await Entity.update(data,mo_by);
  if(response.result){
    res.json(new ApiResponse(200 , {} , 'Updated successfully'));
  }else {
    throw new Error('Failed')
  }
}) );
