import { EntityQuery } from "app/Biz";
import { Store } from "app/tool";
import { Picked, Prop, pickedFromJsonArr } from "../tool";

export class QueryStore extends Store<EntityQuery> {
    async query(param: any) {
        let retQuery = await this.uq.DoQuery.submitReturns({ query: this.entity.id, json: param, pageStart: undefined, pageSize: 100 });
        let { ret: retItems, props, specs, atoms } = retQuery;
        this.cacheIdAndBuds(props, atoms, specs);
        let pickedArr: Picked[] = [];
        let coll: { [atomId: number]: Picked } = {};
        for (let row of retItems) {
            let propArr: Prop[] = [];
            const { id, ban, value } = row;
            let picked: Picked = {
                $: propArr as any,
                id, //: row.id as any,
                value,
                // ...row,
            };
            picked.ban = {
                name: 'ban',
                bud: undefined,
                value: ban, // row.ban,
            };
            pickedFromJsonArr(this.entity, propArr, picked, row.json ?? []);
            pickedArr.push(picked);
            coll[id] = picked;
        }
        for (let specRow of specs) {
            const { atom, id, ban, value, json } = specRow;
            let picked = coll[atom];
            if (picked === undefined) continue;
            let propArr: Prop[] = [];
            const specValue = this.budsColl[id];
            if (specValue !== undefined) {
                for (let bud of this.bizSpecColl[id].buds) {
                    propArr.push({
                        name: bud.name,
                        bud,
                        value: specValue[bud.id],
                    });
                }
            }
            if (value !== undefined) {
                let { value: sumValue } = picked;
                if (sumValue === undefined) sumValue = 0;
                sumValue += value;
                picked.value = sumValue;
            }
            let { $specs } = picked;
            if ($specs === undefined) {
                picked.$specs = $specs = [];
            }
            let $spec = {
                $: propArr as any,
                id,
                ban,
                json,
                value,
            };
            pickedFromJsonArr(this.entity, propArr, $spec, json);
            $specs.push($spec);
        }
        return pickedArr;
    }
}
