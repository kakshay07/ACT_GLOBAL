import { ApiError } from '../utils/ApiError';
import { getId, insertTable, query, updateTable } from '../utils/db';
// import {productionBatchCodeModel} from './production_batchCode.model'

export class Entity {
  entity_id = 0;
  name = '';
  short_desc = '';
  address = '';
  email = '';
  reg_num = '';
  estab_date = '';
  expiry_date = '';
  bank_ac_num = '';
  bank_ifsc = '';
  bank_name = '';
  bank_location = '';
  cr_on? = 'NOW()';
  cr_by? = '';
  mo_on?: string | null = null;
  mo_by?: string | null = null;
  gst_no:string | null = null;
  country?: string | null = null;
  state?: string | null = null;
  city?: string | null = null;
  pincode?: string | null = null;
  additional_info?:string | null = null

  
  static async get_entity(entity_id?: number) {
    // if (entity_id != 1) {
    //   // return await query<Entity>(
    //   //   "select *,to_char(estab_date,'yyyy-mm-dd') as estab_date from entity where entity_id = $1 ;",
    //   //   [entity_id]
    //   // );
    //   return ;
    // }
    console.log(entity_id)
    return await query<Entity>(
      "SELECT entity_id , name , short_desc , email ,  address , reg_num , bank_ac_num , bank_ifsc , bank_name , bank_location , gst_no , country , state , city , pincode , additional_info , DATE_FORMAT(estab_date, '%Y-%m-%d') AS estab_date , DATE_FORMAT(expiry_date, '%Y-%m-%d') AS expiry_date FROM entity;"
    );
  }

  // static async get_name(entity_id?: number) {
  //   let _query = 'select entity_id,name from entity ';
  //   const _params = [];
  //   if (entity_id) {
  //     _query += ' where entity_id = $1';
  //     _params.push(entity_id);
  //   }
  //   return await query<Entity>(_query, _params);
  // }

  static async add(data: Entity, cr_by:string) {
    const { data: id } = await getId({
      table: 'entity',
      column: 'entity_id',
      where: {},
    });
    if (!id) {
      return;
    }
    data = {...data , entity_id : id[0].entity_id, cr_by:cr_by};
    let result = await insertTable({
      table: 'entity',
      data: data,
    });
    if(result.result){
      return data.entity_id;
    }else {
      return ;
    }
  }


  static async update(data: Entity,mo_by:string) {
    return await updateTable({
      table: 'entity',
      data: {...data, mo_by:mo_by},
      where: { entity_id: data.entity_id },
    });
  }

  static async getEntityAndBranchName(data : {
    entity_id: number,
    branch_id : number
  }){
    const entity_data = await query(`select
        b.name as branch_name,
        e.name as entity_name
    from
        branch b
    join 
        entity e
    on
        e.entity_id = b.entity_id
    where
        b.entity_id = ${data.entity_id}
        and b.branch_id = ${data.branch_id}`);

    if(!entity_data.result){
        throw new ApiError(400 , 'Failed to get entity details')
    }
    return entity_data.data[0];
  }
}
