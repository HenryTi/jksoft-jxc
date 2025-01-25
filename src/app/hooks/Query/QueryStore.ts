import { BizBud, EntityQuery } from "app/Biz";
import { EntityStore } from "app/tool";
import { NamedProps, Prop, QueryRow } from "../tool";

export class QueryStore extends EntityStore<EntityQuery> {
    async query(param: any) {
        let jsonParams: any = {};
        const { params: paramBuds } = this.entity;
        for (let bud of paramBuds) {
            jsonParams[bud.id] = param[bud.name];
        }
        let retQuery = await this.uq.ExecQuery.submitReturns({
            query: this.entity.id,
            json: jsonParams,
            pageStart: undefined,
            pageSize: 100
        });
        let { main, detail: details, props, forks, atoms } = retQuery;
        this.cacheIdAndBuds(props, atoms, forks);

        let rows: QueryRow[] = [];
        let coll: { [id: number]: QueryRow } = {};
        let lastId = 0;
        // const mainColl: { [mainId: number]: ReturnExecQueryMain } = {};
        if (main.length === 0) {
            let queryRow: QueryRow = {
                rowId: 0,
                ban: 0,
                ids: undefined,
                values: undefined,
                cols: undefined,
                subs: [],
            }
            coll[0] = queryRow;
            rows.push(queryRow);
        }
        else {
            for (let row of main) {
                const { rowId, ban, ids, values } = row;
                let queryRow: QueryRow = {
                    rowId,
                    ban,
                    ids,
                    values,
                    cols: undefined,
                    subs: [],
                }
                rows.push(queryRow);
                coll[rowId] = queryRow;
            }
        }

        for (let detail of details) {
            let { mainId, rowId, ban, ids, values, cols } = detail;
            let { subs } = coll[mainId];
            subs.push({
                rowId,
                ban,
                ids,
                values,
                cols: cols.map((v: [number, number]) => {
                    const [bud, value] = v;
                    return [this.biz.budFromId(bud), value];
                }),
                subs: undefined,
            });
        }
        // if (main.length === 0) return coll[0].subs;
        return rows;
    }

    async queryOld(param: any) {
        let json: any = {};
        const { params: paramBuds, subCols } = this.entity;
        for (let bud of paramBuds) {
            json[bud.id] = param[bud.name];
        }
        let retQuery = await this.uq.DoQuery.submitReturns({ query: this.entity.id, json, pageStart: undefined, pageSize: 100 });
        let { ret: retItems, details, props, forks, atoms } = retQuery;
        let pickedArr: NamedProps[] = [];
        let coll: { [id: number]: NamedProps } = {};
        let lastId = 0;
        for (let row of retItems) {
            let idArr: Prop[] = [];
            const { id, ban, value, json } = row;
            let picked: NamedProps = {
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
            if (subCols !== undefined && id > lastId) {
                picked.group = id;
                lastId = id;
            }
            this.fromJsonArr(idArr, picked, json);
            pickedArr.push(picked);
            coll[id] = picked;
        }

        this.cacheIdAndBuds(props, atoms, forks);

        let specSerial = 1;
        for (let detail of details) {
            let { seed, id, ban, value, json } = detail;
            let picked = coll[seed];
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

    private fromJsonArr(propArr: Prop[], picked: NamedProps, arr: any[]) {
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
