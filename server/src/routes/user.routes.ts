import { Router, Response } from 'express';
import { User } from '../models/user.models';
import { AuthenticatedRequest, authMiddleware } from '../middlewares/auth.middlewares';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
export const userRouter = Router();

userRouter.post(
    '/login',
    asyncHandler(async (req, res) => {
        const { user_name, password } = req.body;
        const response = await User.login({ user_name, password });
        if (response.msg) {
            res.json(new ApiResponse(401, {}, response.msg));
        } else {
            res.json(new ApiResponse(200, response));
        }
    })
); 

userRouter.post('/check-active-session',
  asyncHandler(async (req, res) => {
    const { user_name} = req.body;
    const hasActiveSession = await User.checkSession({ user_name});
    if (hasActiveSession) {
      res.json({ hasActiveSession: true });
    } else {
      res.json({ hasActiveSession: false });
    }
})
);

userRouter.post('/force-logout',
  asyncHandler(async (req, res) => {
    const { user_name} = req.body;
    const logout = await User.forceLogout({ user_name });
    if (logout) {
      res.json(new ApiResponse(200,{},'success'));
    } else {
      res.json(new ApiResponse(400,{}));
    }
})
);

userRouter.post('/logout',
  asyncHandler(async (req, res) => {
    const { user_name,entity_id} = req.body;
    const logout = await User.Logout({ user_name,entity_id:entity_id });
    if (logout) {
      res.json(new ApiResponse(200,{},'success'));
    } else {
      res.json(new ApiResponse(400,{}));
    }
})
);

userRouter.use(authMiddleware);

userRouter.get(
  '/',
  asyncHandler(
      async (
      req: AuthenticatedRequest<
        unknown,
        unknown,
        unknown,
        { entity_id: string; branch_id: number; user_name?: string; limit?: number; page?:number;role_id?:number }
      >,
      res: Response
    ) => {
      const data = await User.getUserByEntityAndBranch(
        req.query.entity_id,
        req.query.branch_id,
        req.query.user_name,
        req.query.page || 0,
        req.query.limit || 15,
        req.query.role_id ,
        req.user
      );
      res.json(new ApiResponse(200 , data.data));
    }
  )
  
);

userRouter.post('/', asyncHandler(async (req: AuthenticatedRequest<
  unknown,
  unknown,
  {
    user_name : string,
    role_id : number,
    user_password : string,
    full_name:string,
    desig_id:number,
  },
  {entity_id:number , branch_id:number}
  
>, res: Response) => {
  // console.log('Body - parser testing ',req.body)
  const {entity_id , branch_id} = req.query;
  const cr_by=req.user.user_id;
  const {user_name , role_id , user_password,full_name, desig_id} = req.body;
  const data = await User.addUser({user_name , role_id , user_password ,full_name, entity_id : Number(entity_id) , branch_id  : Number(branch_id) , desig_id,cr_by:cr_by});
  if(data){
    res.json(new ApiResponse(200 , {} , 'User added successfully'));
  }else{
    res.json(new ApiResponse(400 , {} , 'User name already exists'));
  }
}));

userRouter.put('/', asyncHandler(async (req: AuthenticatedRequest<
  unknown,
  unknown,
  {
    user_name : string,
    role_id : number,
    user_password : string,
    full_name:string,
    desig_id:number,
    user_id:number,
    user_active:string
  },
  {entity_id:number , branch_id:number}
  >, res: Response) => {
  const {user_name , role_id,full_name,user_id,user_active,user_password} = req.body;
  const {entity_id} = req.query;
  const mo_by=req.user.user_id;
  const data = await User.updateUser({user_name , role_id ,full_name, entity_id : Number(entity_id),user_id,user_active,mo_by:mo_by,user_password:user_password });
  console.log(data,"")
  res.json(new ApiResponse(200,{}, 'Updated successfully'))
}));

userRouter.put('/changePassword', asyncHandler(async (req: AuthenticatedRequest<
  unknown, unknown, {user_password : string} , {entity_id : number , branch_id : number}>, res: Response) => {
  const{user_password}=req.body;
  const {entity_id,branch_id}=req.query;
  const {user_name} = req.user;
  const data = await User.changePassword({entity_id:Number(entity_id),user_name,user_password,branch_id : Number(branch_id)});
  if(data){
    res.json(new ApiResponse(200,{}, ' Password updated successfully'));
  }else {
    throw new Error('Failed to update')
  }
}));

// userRouter.get(
//   '/roles',
//   async (
//     req: Request<unknown, unknown, unknown, { entity_id: string }>,
//     res: Response
//   ) => {
//     const data = await role_access.getRoleAccess(req.query.entity_id, '', 200);
//     res.json({ data: data });
//   }
// );
