import { getConnection, insertTable, query } from '../utils/db';

export class countryModel{
country_code?:string  ;
country_iso?:string ;
country_name?:string;
country_phone?:number;


static async getAllCountryWithCode(entity_id?:string){
    let _query='SELECT COUNTRY_CODE, COUNTRY_ISO, COUNTRY_NAME,COUNTRY_PHONE FROM `act-global`.COUNTRY'
    if(entity_id){
        _query += ` where entity_id = ${entity_id}`
    }
    _query += ` ORDER BY COUNTRY_CODE`
    const response = await query(_query);
    if (response.result) {
        return response.data;
    }
    return;

}

static async AddCountry(data:countryModel){
    const conn = await getConnection();
    const response= await conn.query('INSERT INTO `act-global`.COUNTRY(COUNTRY_ISO,COUNTRY_NAME,COUNTRY_PHONE) VALUES(?,?,?)',[data.country_iso,data.country_name,data.country_phone])
    if (response) {
        return true;
    }
    return;
}

static async UpdateCountry(data:countryModel){
    const conn = await getConnection();
    const response= await conn.query('Update `act-global`.COUNTRY SET Country_iso= ? ,Country_name=?,country_phone= ? where country_code= ? ',[data.country_iso,data.country_name,data.country_phone,data.country_code])
    if (response) {
        return true;
    }
    return;
}

}
