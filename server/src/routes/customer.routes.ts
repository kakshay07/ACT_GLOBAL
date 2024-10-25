import { Router } from 'express';
import { customerModel } from '../models/customer.model';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthenticatedRequest } from '../middlewares/auth.middlewares';

export const customerRouter = Router();

customerRouter.post(
    '/',
    asyncHandler(
        async (
            req: AuthenticatedRequest<
                unknown,
                unknown,
                {
                    cust_phone_num: number;
                    invoice_num: number;
                    invoice_amt: number;
                },
                { 
                    entity_id: number; 
                    branch_id: number 
                }
            >,
            res
        ) => {
            const result = await customerModel.addCustomerEntry({
                ...req.body,
                ...req.query,
                user_id: req.user.user_id,
            });
            res.send(new ApiResponse(200, result , `Added Customer with ${result.no_of_coupons} coupons`));
        }
    )
);

customerRouter.get(
    '/',
    asyncHandler(
        async (
            req: AuthenticatedRequest<
                unknown,
                unknown,
                unknown,
                { 
                    entity_id: number; 
                    branch_id: number;
                    cal_year : number;
                    limit : number;
                    page : number;
                    phone : number;
                    invoice_num : number;
                }
            >,
            res
        ) => {
            const {user_id, is_staff} = req.user;

            const result = await customerModel.getCustomerDetails({
                ...req.query,
                user_id ,
                is_staff
            });
            res.send(new ApiResponse(200, result ));
        }
    )
);

customerRouter.put(
    '/',
    asyncHandler(
        async (
            req: AuthenticatedRequest<
                unknown,
                unknown,
                {
                    cust_phone_num: number;
                    invoice_num: number;
                    invoice_amt: number;
                    invoice_date: string;
                    old_inv_num : number;
                    old_cust_id : number;
                },
                { 
                    entity_id: number; 
                    branch_id: number;
                }
            >,
            res
        ) => {
            await customerModel.updateCustomerDetials({
                ...req.query,
                ...req.body,
                user_id: req.user.user_id,
            });
            res.send(new ApiResponse(200, {}, 'Updated Customer Details' ));
        }
    )
);

export default customerRouter;
