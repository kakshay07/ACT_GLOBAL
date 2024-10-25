import { getId, insertTable, query, updateTable } from '../utils/db';

export class branchModel {
    entity_id?: number;
    branch_id?: number;
    name?: string;
    country?:string;
    state?:string;
    city?:string;

    static async getAllBranches(entity_id ?: string) {
        let _query = `SELECT entity_id , branch_id , name , country ,state ,city FROM branch`;

        if(entity_id){
            _query += ` where entity_id = ${entity_id}`
        }

        _query += ` ORDER BY entity_id`

        const response = await query(_query);
        if (response.result) {
            return response.data;
        }
        return;
    }

    static async updatebranch(data: {
        entity_id: number;
        branch_id: number;
        name: string;
        country:string;
        state:string;
        city:string;
        mo_by:number
    }) {
        let response = await updateTable({
            table: 'branch',
            data: {
                name: data.name,
                country:data.country,
                state:data.state,
                city:data.city,
                mo_by:data.mo_by
                
            },
            where: {
                entity_id: data.entity_id,
                branch_id: data.branch_id,
            },
        });
        if (response.result) {
            return true;
        }
        return;
    }

    static async AddBranch(data: { entity_id:string;name:string;country:string;state:string;city:string,cr_by:number }) {
        const { data: id } = await getId({
            table: 'branch',
            column: 'branch_id',
            where: {
                entity_id: data.entity_id,
            },
        });
        console.log(id.length  , 'idd');
        
        if (id.length < 1) {
            return;
        }

        let response = await insertTable({
            table: 'branch',
            data: {
                name : data.name,
                branch_id : id[0].branch_id,
                entity_id : data.entity_id,
                country :data.country,
                state:data.state,
                city:data.city,
                cr_by:data.cr_by
            },
        });

        if (response.result) {
            return true;
        }
        return;
    }
}
