import { getConnection, query } from "../utils/db";

export class bankModel {
  bank_code?: string;
  BANK_CODE?:string;
  BANK_DESC?:string;
  ORDER_SL?:number
  bank_desc?: string;
  order_sl?: string;
  acnt_type?: string;
  acnt_desc?: string;
  ACNT_TYPE?:string;
  ACNT_DESC?:string;

  static async getBankName() {
    const _query = 'SELECT BANK_CODE ,BANK_DESC ,ORDER_SL FROM `act-global`.bank_master';
    const response = await query(_query);
    if (response.result) {
      return response.data;
    }
    return;
  }

  static async getBankType() {
    const _query = 'SELECT ACNT_TYPE ,ACNT_DESC FROM `act-global`.bank_account_type';
    const response = await query(_query);
    if (response.result) {
      return response.data;
    }
    return;
  }

  static async AddBank(data:bankModel){
    const conn = await getConnection();
    const ORDER_SL=await conn.query('select COALESCE(max(ORDER_SL),0)+1 as ORDER_SL from `act-global`.bank_master')
    console.log(ORDER_SL,"ssss")
    const response= await conn.query('INSERT INTO `act-global`.bank_master(BANK_CODE,BANK_DESC,ORDER_SL) VALUES(?,?,?)',[data.BANK_CODE,data.BANK_DESC,ORDER_SL[0].ORDER_SL])
    if (response) {
        return true;
    }
    return;
}

static async UpdateBank(data:bankModel){
  const conn = await getConnection();
  const response= await conn.query('Update `act-global`.bank_master SET BANK_CODE= ? ,BANK_DESC= ? where Order_sl= ? ',[data.BANK_CODE,data.BANK_DESC,data.ORDER_SL])

  if (response) {
      return true;
  }
  return;
}

 //--- Banck Account Master ----//

 static async AddBankAccount(data:bankModel) {
  const conn = await getConnection();
  const response = await conn.query("INSERT INTO `act-global`.bank_account_type(ACNT_TYPE, ACNT_DESC) VALUES(?,?)",[data.ACNT_TYPE,data.ACNT_DESC])
  if(response){
    return true;
  }
  return;
 }

 static async getBankAccountType() {
  const _query = 'SELECT ACNT_TYPE ,ACNT_DESC FROM `act-global`.bank_account_type';
  const response = await query(_query);
  if (response.result) {
    return response.data;
  }
  return;
}

}
