import { getConnection, insertTable, query } from '../utils/db';

export class currencyModel {
    CURR_CODE?: string;
    CURR_NAME?:string;
    CURR_SHORT_NOTATION?:string;


    static async getAllCurrency(entity_id?:string){
        let _query='SELECT CURR_CODE,CURR_NAME, CURR_SHORT_NOTATION FROM `act-global`.currency'
        if(entity_id){
            _query += ` where entity_id = ${entity_id}`
        }
        const response = await query(_query);
        if (response.result) {
            return response.data;
        }
        return;
    
    }


    static async AddCurrency(data:currencyModel){
        const conn = await getConnection();
        const response= await conn.query('INSERT INTO `act-global`.currency(CURR_CODE,CURR_NAME,CURR_SHORT_NOTATION) VALUES(?,?,?)',[data.CURR_CODE,data.CURR_NAME,data.CURR_SHORT_NOTATION])
        if (response) {
            return true;
        }
        return;
    }


    static async UpdateCurrency(data:currencyModel){
        const conn = await getConnection();
        const response= await conn.query('Update `act-global`.currency SET  CURR_NAME=?,CURR_SHORT_NOTATION = ? WHERE CURR_CODE = ? ',[data.CURR_NAME,data.CURR_SHORT_NOTATION,data.CURR_CODE])
        if (response) {
            return true;
        }
        return;
    }
    
}