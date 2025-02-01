import { BizBud, EntityQuery, StoreEntity } from "tonwa";
// import { EntityStore } from "app/tool";
import { NamedProps, Prop, QueryRow, QueryRowCol } from "../tool";

export class QueryStore extends StoreEntity<EntityQuery> {
    async query(param: any) {
        let jsonParams: any = {};
        const { params: paramBuds, value: budValue, mainCols: mainColsDef } = this.entity;
        for (let bud of paramBuds) {
            jsonParams[bud.id] = param[bud.name];
        }
        let retQuery = await this.client.ExecQuery({
            query: this.entity.id,
            json: jsonParams,
            pageStart: undefined,
            pageSize: 100
        });
        let { main, detail: details, props, forks, atoms } = retQuery;
        this.cacheIdAndBuds(props, atoms, forks);

        let rows: QueryRow[] = [];
        let coll: { [id: number]: QueryRow } = {};
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
                    values: [budValue, values?.[0]],
                    cols: undefined,
                    subs: [],
                }
                rows.push(queryRow);
                coll[rowId] = queryRow;
            }
        }

        for (let detail of details) {
            let { mainId, rowId, ban, ids, values, cols } = detail;
            let mainRow = coll[mainId];
            let mainCols: QueryRowCol[] = [];
            let subCols: QueryRowCol[] = [];
            for (let col of cols) {
                const [bud, value] = col;
                let colVal: QueryRowCol = [this.biz.budFromId(bud), value];
                if (mainColsDef !== undefined && mainColsDef[bud] === true)
                    mainCols.push(colVal);
                else {
                    subCols.push(colVal);
                }
            }
            let { subs } = mainRow;
            mainRow.cols = mainCols;
            subs.push({
                rowId,
                ban,
                ids,
                values: [budValue, values?.[0]],
                cols: subCols,
                subs: undefined,
            });
        }
        return rows;
    }
}
