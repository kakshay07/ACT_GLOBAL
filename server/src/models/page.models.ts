import { insertTable, query, updateTable } from "../utils/db";

export class pageModel {
    page_id ?: string;
    page_name ?: string;
    superadmin_only?: 0 | 1;
    cr_by?:number;
    cr_on?:string;
    mo_by?:number;
    mo_on?:string;

    static async getAllPages(is_superadmin : 1 | 0) {
      let _query = `Select page_id, page_name, name, description, superadmin_only, access_for_all from pages`
      if(is_superadmin == 0){
        _query += ` where superadmin_only = 0;`
      }
        const allPages = await query(_query , []);
        if(allPages.result){
            return allPages.data;
        }
        return;
    }

    static async getAllPages_Except_accessForAll(data : {
      entity_id : number ,
      role_id : number ,
      is_superadmin ?: 1 | 0
    }) {
      let _query = `Select 
      p.page_id , 
      p.page_name , 
      p.name,
      p.description,
      p.superadmin_only, 
      p.access_for_all ,
      pa.access_to_add,
      pa.access_to_update,
      pa.access_to_delete
      from pages p
      join page_access pa on pa.entity_id = ${data.entity_id} and pa.role_id = ${data.role_id} and  p.page_id = pa.page_id 
      where 
      p.superadmin_only = 0 and 
      p.access_for_all = 0`

      if(data.is_superadmin == 1){
        _query = `Select 
        * ,
        1 as access_to_add, 
        1 as access_to_update, 
        1 as access_to_delete 
        from pages 
        where 
        superadmin_only = 0`
      }

      const allPages = await query(_query , []);
      if(allPages.result){
          return allPages.data;
      }
      return;
    }

    static async updatePage(data : {
        page_id : number,
        page_name : string,
        name : string,
        description : string,
        superadmin_only : 1 | 0,
        access_for_all : 1 | 0,
        mo_by:number

    }) {
        const response = await updateTable({
            table: 'pages',
            data: {
              page_name : data.page_name,
              name : data.name,
              description : data.description,
              superadmin_only : data.superadmin_only,
              access_for_all : data.access_for_all,
              mo_by:data.mo_by
            },
            where: {
              page_id: data.page_id
            },
          });
          if(response.result) {
            return true;
          }
          return;
    }

    static async AddPage(data : {
        page_name : string,
        name : string,
        description : string,
        superadmin_only : 1 | 0,
        access_for_all : 1 | 0,
        cr_by:number
    }) {
      // if(data.page_name)
      const _query=`select count(*) as count from pages where page_name='${data.page_name}'`
      const cons=await query(_query);
      if(cons.data[0]?.count > 0){
        console.log("page already exists");
        return;
      }else{
        const response = await insertTable({
            table: 'pages',
            data: data,
        })
          if(response.result) {
            return true;
          }
      }
      return;
    }

}