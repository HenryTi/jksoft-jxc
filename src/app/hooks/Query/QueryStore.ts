import { BizBud, Entity, EntityQuery } from "app/Biz";
import { Store } from "app/tool";
import { Picked, Prop, pickedFromJsonArr } from "../tool";

export class QueryStore extends Store<EntityQuery> {
    async query(param: any) {
        let retQuery = await this.uq.DoQuery.submitReturns({ query: this.entity.id, json: param, pageStart: undefined, pageSize: 100 });
        let { ret: retItems, props, specs, atoms } = retQuery;
        this.cacheIdAndBuds(props, atoms, specs);
        let pickedArr: Picked[] = [];
        for (let row of retItems) {
            let propArr: Prop[] = [];
            let picked: Picked = {
                $: propArr as any,
                id: row.id as any,
            };
            picked.ban = {
                name: 'ban',
                bud: undefined,
                value: row.ban,
            };
            pickedFromJsonArr(this.entity, propArr, picked, row.json);
            pickedArr.push(picked);
        }
        // return retQuery;
        return pickedArr;
    }
}
