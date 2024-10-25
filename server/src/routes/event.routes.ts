import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { AuthenticatedRequest } from "../middlewares/auth.middlewares";
export const Eventrouter = Router();
import {EventModel} from '../models/event.model'
import { ApiResponse } from "../utils/ApiResponse";

Eventrouter.post(
    '/',
    asyncHandler(
      async (
        req: AuthenticatedRequest<
          unknown,
          unknown,
          {
            name : string,
            coupon_amt : number;
            is_active: 0 | 1;
            bal_amt_add_coupn:number
          },
          { entity_id :number ,branch_id:number}
        >,
        res
      ) => {
        const {name ,coupon_amt ,is_active ,bal_amt_add_coupn} = req.body;
        const cr_by=req.user.user_id;
        const {entity_id ,branch_id} =req.query;
        const response = await EventModel.AddEvents({entity_id:entity_id ,branch_id : branch_id,name :name ,coupon_amt :coupon_amt ,is_active :is_active,bal_amt_add_coupn:bal_amt_add_coupn,cr_by:cr_by})
        if(response){
          res.json(new ApiResponse(200 , {} , 'Event added successfully'))
        }else {
          throw new Error('Could not Add event')
        }
      }
    )
  )

  Eventrouter.get(
    '/',
    asyncHandler(
      async (
        req: AuthenticatedRequest<
          unknown,
          unknown,
         unknown,
          { entity_id :number }
        >,
        res
      ) => {
        const {entity_id} =req.query;
        const response = await EventModel.GetAllEvents(entity_id)
        if(response){
          res.json(new ApiResponse(200 , response , ''))
        }else {
          throw new Error('Could not get all events')
        }
      }
    )
  )
  
  Eventrouter.put(
    '/',
    asyncHandler(
      async (
        req: AuthenticatedRequest<
          unknown,
          unknown,
         {name:string,coupon_amt:number,is_active :0 | 1 ,event_id:number ,bal_amt_add_coupn:number,is_current_event:number},
          { entity_id :number}
        >,
        res
      ) => {
        const {entity_id} =req.query;
        const mo_by=req.user.user_id;
        const {name ,coupon_amt ,is_active,event_id,bal_amt_add_coupn,is_current_event} = req.body;
        const response = await EventModel.UpdateEvents(entity_id ,event_id,name,coupon_amt,is_active,is_current_event,bal_amt_add_coupn,mo_by)
        if(response){
          res.json(new ApiResponse(200 , {} , 'Event updated successfully'))
        }else {
          throw new Error('Could not update  event')
        }
      }
    )
  )

  Eventrouter.post(
    '/changeevent',
    asyncHandler(
      async (
        req: AuthenticatedRequest<
          unknown,
          unknown,
         {currentEvent:number,currentYear:string,drawDate:string},
          { entity_id :number}
        >,
        res
      ) => {
        // const response=true;
        const {entity_id} =req.query;
        const mo_by=req.user.user_id;
        const {currentEvent,currentYear,drawDate} = req.body;
        console.log(req.body ," deeeeeepssssss")
        const response = await EventModel.UpdateCurrentEvent(entity_id ,currentEvent,currentYear,drawDate,mo_by)
        if(response){
          res.json(new ApiResponse(200 , {} , 'Current event updated successfully'))
        }else {
          throw new Error('Could not update current event')
        }
      }
    )
  )


  Eventrouter.post(
    '/endevent',
    asyncHandler(
      async (
        req: AuthenticatedRequest<
          unknown,
          unknown,
         {currentEvent:number},
          { entity_id :number}
        >,
        res
      ) => {
        // const response=true;
        const {entity_id} =req.query;
        const mo_by=req.user.user_id;
        const {currentEvent} = req.body;//CURRENT EVENT WHICH IS ITS EVENT_ID NOT NAME
        console.log(req.body ,"2222222")
        const response = await EventModel.EndCurrentEvent(entity_id ,currentEvent,mo_by)
        if(response){
          res.json(new ApiResponse(200 , {} , 'Current event ended successfully'))
        }else {
          throw new Error('Could not end current event')
        }
      }
    )
  )