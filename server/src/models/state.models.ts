import { on } from 'events';
import { getConnection, query } from '../utils/db';

export class stateModel{
state_code?:string | null ;
state_name?:string ;
country_code?:string;
tin_code?:string;
state_gst_code?:string;
gst?:string;
STATE_CODE?:number
STATE_NAME?:string;
COUNTRY_CODE?:number;
TIN_CODE?:number;
STATE_GST_CODE?:number | string;
GST?:number | string


static async getAllStateWithCountryCode(data:{country_code?:string}){
    let _query='SELECT C.COUNTRY_CODE,COUNTRY_NAME,STATE_CODE, TIN_CODE, STATE_NAME, STATE_GST_CODE, GST  FROM `act-global`.STATES S JOIN `act-global`.COUNTRY  C ON C.COUNTRY_CODE=S.COUNTRY_CODE' 
    if(data.country_code){
        _query += ` WHERE COUNTRY_CODE = ${data.country_code}`
    }
    _query += ` ORDER BY STATE_CODE`
    const response = await query(_query);
    if (response.result) {
        return response.data;
    }
    return;
}

static async AddState(data:stateModel){
    const conn = await getConnection();
    const response= await conn.query('INSERT INTO `act-global`.states(COUNTRY_CODE,STATE_NAME,STATE_GST_CODE,TIN_CODE,GST) VALUES(?,?,?,?,?)',[data.COUNTRY_CODE,data.STATE_NAME,data.STATE_GST_CODE,data.TIN_CODE,data.GST])
    if (response) {
        return true;
    }
    return;
}
static async UpdateState(data:stateModel){
    const conn = await getConnection();
    const response= await conn.query('Update `act-global`.states SET country_code= ? ,state_name=?,state_gst_code= ? ,tin_code= ?,gst = ? where state_code= ? ',[data.COUNTRY_CODE,data.STATE_NAME,data.STATE_GST_CODE,data.TIN_CODE,data.GST,data.STATE_CODE])
  
    if (response) {
        return true;
    }
    return;
}
}
