import { Router, Request } from 'express';
import { role_access } from '../models/role.models';
import { ApiResponse } from '../utils/ApiResponse';
import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth.middlewares';
import { asyncHandler } from '../utils/asyncHandler';
// import { Entity } from '../models/entity.models';

export const roleAccessRouter = Router();


roleAccessRouter.get(
  '/',
  async (
    req: AuthenticatedRequest<
      unknown,
      unknown,
      unknown,
      { entity_id: string; name: string; limit: number }
    >,
    res
  ) => {
    const data = await role_access.getRoles(
      req.query.entity_id,
      req.query.name,
      req.query.limit,
      req.user
    );
    res.json(new ApiResponse(200 ,  data.data ,""));
  }
);

roleAccessRouter.post(
  '/',
  asyncHandler(
    async (
      req: AuthenticatedRequest<
        unknown,
        unknown,
        {
          role_name: string;
          page_acces:{
            page_id: number;
            access_to_add?: 1 | 0;
            access_to_update?: 1 | 0;
            access_to_delete?: 1 | 0;
          } [];
          is_admin: boolean;
          is_staff: boolean;
          is_superadmin: boolean;
          cr_by:number;
        },
        { entity_id: number; branch_id: number }
      >,
      res
    ) => {
      const data = req.body;
      const {entity_id,branch_id} = req.query
      const response = await role_access.addRoles(
        data,
        entity_id,
        branch_id,
        Number(req.user.user_id)
      );
      if (response) {
        res.json(new ApiResponse(200, {}, 'Roles added successfully'));
      } else {
        res.json(new ApiResponse(400, {}, 'Failed to add roles'));
      }
    }
  )
);


roleAccessRouter.put(
  '/',
  asyncHandler(
    async (
      req: AuthenticatedRequest<
        unknown,
        unknown,
        {
          role_id: number;
          role_name: string;
          page_access: {
            page_id: number;
            access_to_add?: 1 | 0;
            access_to_update?: 1 | 0;
            access_to_delete?: 1 | 0;
          }[];
          is_admin: boolean;
          is_staff: boolean;
          is_superadmin: boolean;
          cr_by:number,
          cr_on:string,
          mo_by?: number;
        },
        { entity_id: string; branch_id: string }
      >,
      res
    ) => {
      const { role_name, role_id, page_access, is_admin, is_superadmin, is_staff,cr_by,cr_on } = req.body;
      const { entity_id } = req.query;
      if (!entity_id) {
        return res.status(400).json({ message: 'Entity ID is required' });
      }
      const mo_by = req.user.user_id
      const response = await role_access.updateRoleAccess({
        entity_id: Number(entity_id),  // Ensure entity_id is passed as a number
        role_name,
        role_id,
        page_access, 
        is_admin,
        is_superadmin,
        is_staff,
        cr_by,
        cr_on,
        mo_by,
      });
      if (response) {
        res.json(new ApiResponse(200, {}, 'Updated successfully'));
      } else {
        res.status(400).json(new ApiResponse(400, {}, 'Could not update role access'));      }
    }
  )
);
