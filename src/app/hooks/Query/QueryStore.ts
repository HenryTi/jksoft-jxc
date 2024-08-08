import { BizBud, EntityQuery } from "app/Biz";
import { EntityStore } from "app/tool";
import { Picked, Prop } from "../tool";

export class QueryStore extends EntityStore<EntityQuery> {
    async query(param: any) {
        let retQuery = await this.uq.DoQuery.submitReturns({ query: this.entity.id, json: param, pageStart: undefined, pageSize: 100 });
        let { ret: retItems, props, specs, atoms } = retQuery;
        this.cacheIdAndBuds(props, atoms, specs);
        let pickedArr: Picked[] = [];
        let coll: { [id: number]: Picked } = {};
        for (let row of retItems) {
            let idArr: Prop[] = [];
            let propArr: Prop[] = [];
            const { id, ban, value, json } = row;
            let picked: Picked = {
                $: idArr as any,
                $id: id,
                id: json[0], //: row.id as any,
                value,
                sum: 0,
            };
            picked.ban = {
                name: 'ban',
                bud: undefined,
                value: ban, // row.ban,
            };
            picked.json = json;
            this.fromJsonArr(idArr, picked, json);
            pickedArr.push(picked);
            coll[id] = picked;
        }
        let specSerial = 1;
        for (let specRow of specs) {
            const { atom, id, ban, value, json } = specRow;
            let picked = coll[atom];
            if (picked === undefined) continue;
            let propArr: Prop[] = [];
            const specValue = this.budsColl[id];
            if (specValue !== undefined) {
                for (let bud of this.bizForkColl[id].buds) {
                    propArr.push({
                        name: bud.name,
                        bud,
                        value: specValue[bud.id],
                    });
                }
            }
            if (value !== undefined) picked.sum += value;
            let { $specs } = picked;
            if ($specs === undefined) {
                picked.$specs = $specs = [];
            }
            let $spec = {
                $: propArr as any,
                $id: specSerial++,  // $id 是序号
                id,
                ban,
                json,
                value,
            };
            this.fromJsonArr(propArr, $spec, json);
            $specs.push($spec);
        }
        return pickedArr;
    }

    private fromJsonArr(propArr: Prop[], picked: Picked, arr: any[]) {
        if (arr === undefined) return;
        const { biz, budColl } = this.entity;
        for (let v of arr) {
            let { length } = v;
            if (length === undefined) continue;
            let v0 = v[0];
            let v1 = v[1];
            let name: string, bud: BizBud, value: any;
            if (v0 === 0) {
                (v as number[]).shift();
                picked.$ids = v;
                continue;
            }
            switch (length) {
                default: debugger; continue;
                case 2:
                    if (typeof (v0) === 'string') {
                        switch (v0) {
                            case 'no': picked.no = v1; continue;
                            case 'ex': picked.ex = v1; continue;
                        }
                        name = v0;
                        value = v1
                    }
                    else {
                        bud = budColl[v0];
                        name = bud.name;
                        value = v1;
                    }
                    break;
                case 3:
                    let bizEntity = biz.entityFromId(v0);
                    bud = bizEntity.budColl[v1];
                    name = bud.name;
                    value = v[2];
                    break;
            }
            let prop: Prop = { name, bud, value };
            picked[name] = prop;
            propArr.push(prop);
        }
    }

}
