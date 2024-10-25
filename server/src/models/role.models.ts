import { error } from "console";
import { ApiResponse } from "../utils/ApiResponse";
import { getConnection, query, updateTable } from "../utils/db";
import logger from "../utils/logger";
import { formatOnlyDate } from "../utils";

interface PageAccess {
  page_id: number;
  access_to_add?: 1 | 0;
  access_to_update?: 1 | 0;
  access_to_delete?: 1 | 0;
}

export class role_access {
  entity_id?: number;
  branch_id?:number;
  role_id?: number;
  role_name?: string;
  page_access?: PageAccess[];
  login_req?: string;
  is_staff?: boolean;
  is_admin?: boolean;
  is_superadmin?: boolean;
  is_active?: boolean;
  cr_on?: string;
  cr_by?: number;
  mo_on?: number;
  mo_by?: string;

  static async getRoles(entity_id: string, name: string, limit: number , user : any) {
    let _query = `select 
                  r.role_id , r.role_name , r.is_staff, r.is_admin , r.is_superadmin ,r.cr_on,r.cr_by, e.name as entity_name
                  from roles as r
                  JOIN entity as e using (entity_id)
                  where r.entity_id = ?`;
    const _params: (string | number)[] = [entity_id];
    // if (name) {
    //   _query += ` where lower(role_name) like '%${name.toLowerCase()}%'`;
    // }
    // _query += ` ORDER BY entity_id ASC, role_id ASC `;

    // if (limit) {
    //   _query += ` limit ? `;
    //   _params.push(limit);
    // }
    if(user && user.is_admin == 1){
      _query += ` and (r.is_admin = 1 OR r.is_staff = 1)`
    }else if(user && user.is_staff == 1){
      _query += ` and r.is_staff = 1`
    }
    const allRoles = await query(_query, _params);

    const _query2 = `select page_id , role_id ,access_to_add,access_to_update,access_to_delete,cr_on,cr_by from page_access where entity_id = ?;`;
    const _params2: (string | number)[] = [entity_id];
    const allPageAccess = await query(_query2, _params2);
    
    const allRolesWithPageAccess = allRoles.data.map((_: role_access) => ({
      ..._,
      page_access: allPageAccess.data
        .filter(
          (p: { role_id: number; page_id: number }) => p.role_id == _.role_id
        )
        .map(
          (access: {
            role_id: number;
            page_id: number;
            access_to_add: number;
            access_to_update: number;
            access_to_delete: number;
            cr_by:number;
            cr_on:string;
          }) => ({
            page_id: access.page_id,
            access_to_add: access.access_to_add,
            access_to_update: access.access_to_update,
            access_to_delete: access.access_to_delete,
            cr_by:access.cr_by,
            cr_on:access.cr_on
          })
        ),
    }));
    console.log(allRolesWithPageAccess);
    
    return { data: allRolesWithPageAccess };
  }

  // function to Addroles and page_access
  static async addRoles(data: role_access,entity_id:number,branch_id:number,cr_by:number) {
    try {
      const conn = await getConnection();
      const rows = await conn.query(
        `select COALESCE(max(role_id),0)+1 as role_id from roles where entity_id = ? `,
        [entity_id]
      );
      data.role_id = rows[0].role_id;
      await conn.query(
        "insert into roles (entity_id,role_id,role_name , is_superadmin , is_admin , is_staff,cr_by,cr_on) values (?,?,?,?,?,?,?,NOW()) ",
        [
          entity_id,
          data.role_id,
          data.role_name,
          data.is_superadmin,
          data.is_admin,
          data.is_staff,
          cr_by,
          // data.is_active,
        ]
      );

      // for (const page of data.page_access) {
      //   const pageId = page.page_id;
      //   await conn.query(
      //     "insert into page_access (entity_id,role_id,page_id) values (?,?,?)", //access_to_add,access_to_update,access_to_delete
      //     [data.entity_id, data.role_id, pageId]
      //   );
      // }
      if (data.page_access && data.page_access.length > 0) {
        for (const page of data.page_access) {
          const pageId = page.page_id;
          const access_to_add = page.access_to_add ?? 0;
          const access_to_update = page.access_to_update ?? 0;
          const access_to_delete = page.access_to_delete ?? 0;
          const _page = await conn.query(
            "INSERT INTO page_access (entity_id, role_id, page_id,access_to_add,access_to_update,access_to_delete,cr_by,cr_on) VALUES (?, ?, ?, ?, ?, ?, ?, now())",
            [
              entity_id,
              data.role_id,
              pageId,
              access_to_add == 1 ? access_to_add : 0,
              access_to_update == 1 ? access_to_update : 0,
              access_to_delete == 1 ? access_to_delete : 0,
              cr_by
            ]
          );
        }
      } else {
        console.log("No page access data to insert.");
      }
      return data.role_id;
    } catch (e) {
      logger.error(e);
    }
  }

  static async updateRoleAccess(data: role_access) {
    try {
      const conn = await getConnection();
      const _rows = await conn.query(
        "update roles set role_name= ? , is_admin = ? , is_superadmin =? , is_staff = ?,mo_by = ?, mo_on = NOW() where role_id= ? and entity_id= ? ",
        [data.role_name,Number(data.is_admin),Number(data.is_superadmin),Number(data.is_staff),Number(data.mo_by), data.role_id, data.entity_id]
      );
      
      if (data.page_access && data.page_access?.length > 0) {
        // console.log(data.page_access,"page_access");
        for (const pages of data.page_access) {
          const _del = await conn.query(
            "DELETE FROM page_access WHERE role_id=? And entity_id=?",
            [data.role_id, data.entity_id]
          );
        }
      } else {
        const _del = await conn.query(
          "DELETE FROM page_access WHERE role_id=? And entity_id=?",
          [data.role_id, data.entity_id]
        );
      }
      // this is to handle insert if length > 0
      if (data.page_access && data.page_access.length > 0) {
        console.log(" if length > 0 i will come here");
        const update = [];
        for (const page of data.page_access) {
          const pageId = page.page_id;
          const { access_to_add, access_to_delete, access_to_update } = page;
          const _update = await conn.query(
            "INSERT INTO page_access (entity_id, role_id, page_id,access_to_add,access_to_update,access_to_delete,cr_on,cr_by,mo_by,mo_on) VALUES (?, ?, ?, ?, ?, ?,?,?, ?, now())",
            [
              data.entity_id,
              data.role_id,
              pageId,
              access_to_add == 1 ? access_to_add : 0,
              access_to_update == 1 ? access_to_update : 0,
              access_to_delete == 1 ? access_to_delete : 0,
              data.cr_on,
              data.cr_by,
              data.mo_by
            ]
          );
          update.push(_update);
        }
        if (update[update.length - 1]) {
          return new ApiResponse(200, {}, "updated "); //not required
        }
      } else {
        console.log("no pages to update");
        return true; // we are actually sending true to api route there we send res.json apirespone
      }
    } catch (error) {
      console.log(error, "error while updating");
    }
  }
}
