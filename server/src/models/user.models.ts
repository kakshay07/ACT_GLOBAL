import { generateToken } from '../middlewares/auth.middlewares';
import { comparePassword, getCurrentDate, getPasswordHash } from '../utils';
import { ApiError } from '../utils/ApiError';
import { getConnection, getId, insertTable, query } from '../utils/db';
import logger from '../utils/logger';


interface Session {
  token: string;
  entity_id:number
  log_type: string;
  session_id: number;
  login_time: Date;
  logout_time: Date | null;
}
export class User {
  entity_id?: number;
  branch_id ?:number;
  user_id?: number;
  role_id?: number;
  user_name?: string;
  user_password?: string;
  full_name?: string;
  email_id?: string;
  contact_no?: string;
  user_active?: string;
  desig_id? : number;
  cr_on?: string;
  cr_by?: number;
  mo_on?: string;
  mo_by?: number;

  static async changePassword(data: {
    entity_id: number;
    user_name: string;
    user_password: string;
    branch_id : number;
  }) {
    const conn = await getConnection();
    const hashpassword =  await getPasswordHash(data.user_password);
    data.user_password = hashpassword
    const response= await conn.query(
      `update users set user_password = ? where user_name = ? and entity_id = ? and branch_id = ?`,
      [data.user_password, data.user_name , data.entity_id , data.branch_id ]
    
    );
    if(response.affectedRows > 0){
      return true;
    }else {
      return false
    }
  }

  static async checkSession(data: { user_name: string}) {
    try {
        const conn = await getConnection();
        
        // Query to check for an active session
        const [user] = await conn.query('SELECT u.entity_id,u.user_name,u.user_id FROM users u join roles using (entity_id,role_id) WHERE Binary user_name = ?', [data.user_name]);
      
        const session:Session[] = await conn.query(
            `SELECT session.token, session.log_type, session.session_id, session.login_time, session.logout_time,session.entity_id
             FROM session
             JOIN users ON session.user_id = users.user_id and session.entity_id=users.entity_id
             WHERE users.user_name = ? AND users.entity_id= ? and  session.logout_time IS NULL`, 
            [data.user_name,user.entity_id]
        );
        //new Added 30-08-2024
        const currentDate = new Date();
        const loginDate = new Date(session[0].login_time);
        if (
          currentDate.getDate() !== loginDate.getDate() ||
          currentDate.getMonth() !== loginDate.getMonth() ||
          currentDate.getFullYear() !== loginDate.getFullYear()
        ) {

          console.log("session data here i m logging ...,current date",session[0].login_time,session[0].log_type,session[0].logout_time,currentDate)
            await conn.query(`
            UPDATE session
            SET log_type = 'LO', logout_time = NOW() 
            WHERE user_id = ? AND log_type = 'LI' AND entity_id=? and  logout_time IS NULL
        `, [user.user_id,user.entity_id]);
           return false;
          }
        const activeSession = session.find(session => session.log_type === 'LI' && session.token );

        if (activeSession) {
            return true;
        }
        
        return false;
    } catch (error) {
        logger.error(error);
        return false;
    }
}

  static async forceLogout (data:{user_name:string;}){
    try{
      console.log(data,"data")
    const conn = await getConnection();
    const [user] = await conn.query('SELECT u.entity_id,u.user_name,u.user_id FROM users u join roles using (entity_id,role_id) WHERE Binary user_name = ?', [data.user_name]);
   return  await conn.query(`
      UPDATE session
      SET log_type = 'LO', logout_time = NOW() 
      WHERE user_id = ? AND log_type = 'LI' AND entity_id=? and  logout_time IS NULL
  `, [user.user_id,user.entity_id]);
    // console.log("----------------------->",session);
    // await conn.query('insert')
    }
    catch(error){
     logger.error(error);
    //  throw new Error('Database query failed');
    }

  }

  static async Logout (data:{user_name:string;entity_id:number}){
    try{
      console.log(data,"data");
    const conn = await getConnection();
    const [user] = await conn.query('SELECT user_id FROM users WHERE Binary user_name = ?', [data.user_name]);
   return  await conn.query(`
      UPDATE session
      SET log_type = 'LO', logout_time = NOW() 
      WHERE user_id = ? AND log_type = 'LI' AND entity_id= ?;
  `, [user.user_id,data.entity_id]);
    }
    catch(error){
     logger.error(error);
    //  throw new Error('Database query failed')
    }

  }

  static async getUserByEntityAndBranch(
    entity_id: string,
    branch_id?: number,
    user_name?: string,
    page?: number,
    limit?: number,
    role_id?:number,
    user?: any
  ) {
    let _query = `select u.* , b.name as branch_name , 
    r.role_name , 
    r.is_admin , 
    r.is_superadmin , 
    r.is_staff , 
    d.name as desig_name
    from users as u 
    JOIN branch as b
    using (entity_id , branch_id)
    JOIN roles as r 
    using (entity_id , role_id)
    JOIN designation as d
    using (entity_id , desig_id)
    where entity_id = ? and branch_id = ? `;

    const _params = [entity_id , branch_id];
    if (user_name) {
      _query += ` and user_name like '${user_name}%' `;
    }
    if(role_id){
      _query += ` and role_id = ?`;
      _params.push(role_id); 
    }
    if(user && user.is_admin == 1){
      _query += ` and (r.is_admin = 1 OR r.is_staff = 1)`
    }else if(user && user.is_staff == 1){
      _query += ` and r.is_staff = 1`
    }
 

    _query +=  ` order by user_id`
  //   if (name) {
  //     _query += ` and lower(full_name) like '%${name.toLowerCase()}%'`;
  //   }
    if(limit && limit != -1) {
      _query += ` limit ${Number(limit) ? Number(limit) :15} offset ${Number(page) * Number(limit)}`;
  }
    return await query(_query, _params);
  }
 
  static async login(data: {
    // entity_id: string;
    // event_id: string;
    user_name: string;
    password: string;
  }) {
      const conn = await getConnection();
      // const [user] = await conn.query('SELECT * FROM users join roles using (entity_id,role_id) WHERE user_name = ?', [data.user_name]);
      const [user] = await conn.query(`select u.entity_id, u.user_id, u.user_name, u.user_password, u.role_id, u.full_name, u.user_active, u.branch_id, u.desig_id, r.role_name, r.is_superadmin, r.is_admin, r.is_staff, r.is_active, e.additional_info, DATE_FORMAT(e.expiry_date, '%Y-%m-%d') AS expiry_date, b.name as branch_name from users u join roles r using (entity_id,role_id) join entity e using (entity_id) join branch b using (entity_id,branch_id) where Binary user_name = ?`, [data.user_name]);
      
      console.log(user);
      
      if (user) {
          if (!user.is_superadmin) {
            if (
              user.expiry_date == null ||
              user.expiry_date < getCurrentDate()
            ) {
              return { msg: "Subscription expired! Please contact the admin" };
            }
          }
        
        const passwordMatch = await comparePassword(data.password, user.user_password);
        if (passwordMatch) {
          if (!user.user_active || !user.is_active) {
            return { msg: 'User/Role is disabled' };
          } else {
            const token = generateToken({
              "entity_id": user.entity_id,
              "user_name": user.user_name,
              "full_name": user.full_name,
              "role_name": user.role_name,
              "role_id": user.role_id,
              "is_superadmin": user.is_superadmin,
              "is_admin": user.is_admin,
              "is_staff": user.is_staff,
              "user_id" : user.user_id,
              "desig_id" : user.desig_id
            });
            
            const res_ult= await conn.query(`insert into session (entity_id,user_id,token,log_type,login_time)Values( ?,?,?,?,Now())`,[user.entity_id,user.user_id,token,'LI'])
            console.log(generateToken,res_ult);
            // if(user.is_admin){
            //   const pages = await conn.query("select * from pages where superadmin_only = 0");
            //   const branches = await conn.query("select branch_id , name from branch where entity_id = ?" , [user.entity_id]);
            //   const pageAccess = [];
            //   for (const page of pages) {
            //     pageAccess.push({
            //       url : page.page_name,
            //       access_to_add : 1,
            //       access_to_update : 1,
            //       access_to_delete : 1
            //     })
            //   }

            // return { user, token , pageAccess , branchAccess : branches};
              
            // }else 
            if(user.is_superadmin){
              const pages = await conn.query("select * from pages");
              const branches = await conn.query("select branch_id , name from branch where entity_id = ?" , [user.entity_id]);
              const pageAccess = [];
              for (const page of pages) {
                pageAccess.push({
                  url : page.page_name,
                  access_to_add : 1,
                  access_to_update : 1,
                  access_to_delete : 1
                })
              }

            return { user, token , pageAccess , branchAccess : branches};
            } else{
              const _page_query = `
              select 
                P.page_name as url, 
                PA.access_to_add, 
                PA.access_to_update, 
                PA.access_to_delete 
              from 
                page_access PA 
              join pages P on P.page_id = PA.page_id 
              where 
                PA.entity_id = ? and PA.role_id = ? 
              union all
              select 
                page_name as url, 
                1 as access_to_add, 
                1 as access_to_update, 
                1 as access_to_delete 
              from 
                pages 
              where 
                superadmin_only = 0 and access_for_all = 1;
            `
              const pageAccess = await conn.query(_page_query , [user.entity_id , user.role_id]);
              return { user, token , pageAccess , branchAccess : [] };
            }
            
          }
        } else {
          return { msg: 'Invalid Username or Password' };
        }
      } else {
        return { msg: 'Invalid Username or Password' };
      }
    }
  
  static async addUser(data: User) {
    try {
      const { data: user_id } = await getId({
        table: 'users',
        column: 'user_id',
        where: { entity_id: data.entity_id },
      });
      if (!user_id) return;
      if (!data.user_password) return;
      const hashpassword =  await getPasswordHash(data.user_password);
      data.user_password = hashpassword
      data.user_id = user_id[0].user_id;
      const response = await insertTable({ table: 'users', data });
      if(response.result){
        return true;
      }
      return;
    } catch (e:any) {
      throw new ApiError(400,e.message)
    }
  }

  static async updateUser(data: User) {
    try {
     const {user_id} = data;
     console.log(user_id,"chek roel,kmkm");
     
      const conn = await getConnection();
      if(data.user_password ==''){
      await conn.query(
        'update users set role_id =?, user_name = ?,  full_name = ?, user_active = ? ,mo_by = ?, mo_on=NOW() where entity_id = ? and user_id = ?',
        [
          data.role_id,
          data.user_name,
          data.full_name,
          data.user_active,
          data.mo_by,
          data.entity_id,
          data.user_id,
        ]
      );
    }
    else if(data.user_password!==''){
      const hashpassword =  await getPasswordHash(String(data.user_password));
      data.user_password = hashpassword
      console.log(data.user_password , " datapasas")
      await conn.query(
        'update users set role_id =?, user_name = ?,  full_name = ?, user_active = ? , user_password = ? ,mo_by = ?, mo_on=NOW() where entity_id = ? and user_id = ?',
        [
          data.role_id,
          data.user_name,
          data.full_name,
          data.user_active,
          data.user_password,
          data.mo_by,
          data.entity_id,
          data.user_id,
        ]
      );

    }
    } catch (e:any) {
      logger.error(e);
      throw new ApiError(400,e.message)
    }
  }
}
