import { BizBud, EntityQuery } from "app/Biz";
import { EntityStore } from "app/tool";
import { Picked, Prop } from "../tool";

export class QueryStore extends EntityStore<EntityQuery> {
    async query(param: any) {
        let json: any = {};
        const { params: paramBuds } = this.entity;
        for (let bud of paramBuds) {
            json[bud.id] = param[bud.name];
        }
        let retQuery = await this.uq.DoQuery.submitReturns({ query: this.entity.id, json, pageStart: undefined, pageSize: 100 });
        let { ret: retItems, props, specs, atoms } = retQuery;
        let pickedArr: Picked[] = [];
        let coll: { [id: number]: Picked } = {};
        for (let row of retItems) {
            let idArr: Prop[] = [];
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

        let specsForCache = specs.map(v => {
            const { id, atom: rowId } = v;
            return {
                id,
                atom: coll[rowId].json[0],
            }
        });
        this.cacheIdAndBuds(props, atoms, specsForCache);

        let specSerial = 1;
        for (let specRow of specs) {
            let { atom, id, ban, value, json } = specRow;
            let picked = coll[atom];
            if (picked === undefined) continue;
            if (value !== undefined) picked.sum += value;
            let { $specs } = picked;
            if ($specs === undefined) {
                picked.$specs = $specs = [];
            }
            let propArr: Prop[];
            if (id !== undefined) {
                const specValue = this.budsColl[id];
                if (specValue !== undefined) {
                    const { buds } = this.bizForkColl[id];
                    propArr = buds.map((bud => {
                        const { id, name } = bud;
                        return {
                            name,
                            bud,
                            value: specValue[id],
                        };
                    }));
                }
                else {
                    propArr = [];
                }
            }
            else {
                const { json } = picked;
                if (Array.isArray(json) === true) {
                    id = json[json.length - 1];
                }
                picked.atomOnly = true;
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
