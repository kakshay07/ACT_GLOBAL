import { getConnection, query } from "../utils/db";

export class cityModel{
city_code?:string | null ;
city_name?:string;
state_code?:string;
CITY_CODE?:number;
CITY_NAME?:number;
STATE_CODE?:number;



static async getAllCityWithStateCode(data : {state_code?:string}){
    let _query='SELECT S.STATE_NAME,S.STATE_CODE, CITY_CODE, CITY_NAME FROM `act-global`.CITIES C JOIN `act-global`.STATES S ON  C.STATE_CODE=S.STATE_CODE'
    if(data.state_code){
        _query += ` WHERE STATE_CODE = ${data.state_code}`
    }
    _query += ` ORDER BY CITY_CODE limit 100 offset 1`
    const response = await query(_query);
    if (response.result) {
        return response.data;
    }
    return;
}

static async AddCity(data:cityModel){
    const conn = await getConnection();
    const response= await conn.query('INSERT INTO `act-global`.cities(STATE_CODE,CITY_NAME) VALUES(?,?)',[data.STATE_CODE,data.CITY_NAME])
    if (response) {
        return true;
    }
    return;
}

static async UpdateCity(data:cityModel){
    const conn = await getConnection();
    const response= await conn.query('Update `act-global`.cities SET state_code= ? ,city_name=? where city_code= ? ',[data.STATE_CODE,data.CITY_NAME,data.CITY_CODE])
  
    if (response) {
        return true;
    }
    return;
}
}
