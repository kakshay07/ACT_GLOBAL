import { ApiError } from '../utils/ApiError';
import { getId, insertTable, query, updateTable } from '../utils/db';

export class pincodeModel 
{
    sl?: string;
    pincode?: number;
    country_code?: string;
    state_code?: string;
    city_code?: string;
    district?: string;
    area?: string;
    is_active?: string;

    static async getPincodeMaster(state: string, city: string, page: number, limit: number) 
    {
        let _query = 'SELECT pm.*,country.country_name, state.state_name,city.city_name FROM `act-global`.pincode_master pm  LEFT JOIN `act-global`.country country  ON pm.country_code = country.country_code LEFT JOIN `act-global`.states state  ON pm.state_code = state.state_code LEFT JOIN `act-global`.cities city ON pm.city_code = city.city_code WHERE pm.is_active = 1'
  ;
        if (state) {
          _query += ` and state_code like '%${17}%'`;
        }
        if (city) {
          _query += ` and city like '%${city}%'`;
        }
        _query += ` order by pincode asc `;

        if (limit) {
          _query += ` limit ${limit} offset ${Number(page) * Number(limit)} `;
        }
        return await query(_query);
    }

//  THIS IS USED ONLY FOR GETTING STATE AND CITY BASED ON PINCODE

static async getDataUsingPincodeParam(pincode:number){
    let _query ='Select state , city ,pincode,country from `act-global`.pincode_master'
    if(pincode){
        _query+=` where pincode='${pincode}'`
    }
    return await query(_query);

}

    static async addPincodeMaster(data: pincodeModel) 
    {
        try 
        {
            const { data: sl } = await getId({
                table: 'pincode_master',
                column: 'sl',
                where: {},
            });

            if (!sl) return;

            data.sl = sl[0].sl;
            data.is_active = '1';
            console.log(data,'data to set');
            

            const response = await insertTable({ table: '`act-global`.pincode_master', data });
            if(response.result){
                return true;
            }
            return;
        } catch (e: any) {
            throw new ApiError(400, e.message)
        }
    }
    
    static async updatePincodeMaster(data: pincodeModel) 
    {
        try 
        {
            const {result} = await updateTable({
                table: 'pincode_master',
                data: {
                    pincode: data.pincode,
                    country: data.country_code,
                    state: data.state_code,
                    city: data.city_code,
                    district: data.district,
                    area: data.area,
                    is_active: data.is_active,
                },
                where : {
                  sl : data.sl
                }
            })
        
            return result;

        } catch (e: any) {
            throw new ApiError(400, e.message)
        }
    }
}