import { BizBud } from "./BizBud";
import { BizPhraseType, UI } from "./Defines";
import { Entity } from "./Entity";

export interface FromEntity {
    arr: Entity[];
    bizPhraseType: BizPhraseType;
    alias: string;
    subs: FromEntity[];
}

export interface IDColumn {
    alias: string;
    ui: Partial<UI>;
}

export class EntityQuery extends Entity {
    asc: 'asc' | 'desc';
    ids: IDColumn[];
    showIds: IDColumn[];
    // groupByBase: boolean;
    ban: string | true;
    params: BizBud[];
    idFrom: FromEntity;
    fromEntity: FromEntity;
    value: BizBud;
    hideCols: { [budId: number]: boolean } = {};
    mainCols: { [budId: number]: boolean };
    private cols: [number, number][];
    protected override fromSwitch(i: string, val: any) {
        switch (i) {
            default: super.fromSwitch(i, val); break;
            case 'asc': this.asc = val; break;
            case 'params': this.params = (val as any[]).map(v => this.fromProp(v)); break;
            case 'ban': this.ban = val; break;
            case 'cols': this.cols = val; break;
            case 'value': this.value = val; break;
            case 'from': this.fromEntity = val; break;
            case 'ids': this.ids = val; break;
            case 'showIds': this.showIds = val; break;
            case 'mainCols': this.mainCols = val; break;
        }
    }

    scan(): void {
        super.scan();

        for (let p of this.params) {
            p.scan();
        }
        for (let col of this.cols) {
            let [eId, bId] = col;
            if (eId < 0) {
                eId = -eId;
                this.hideCols[bId] = true;
            }
            let entity = this.biz.entityFromId(eId);
            if (entity === undefined) {
                continue;
            }
            let bud = entity.budColl[bId];
            if (bud === undefined) {
                continue;
            }
            this.budColl[bud.id] = bud;
        }
        this.cols = undefined;
        let mainCols = this.mainCols;
        if (mainCols !== undefined) {
            this.mainCols = {};
            for (let id of mainCols as unknown as number[]) {
                this.mainCols[id] = true;
            }
        }

        this.fromEntity = this.scanFrom(this.fromEntity);
        if (this.ids === undefined || this.ids.length === 0) {
            this.idFrom = this.fromEntity;
        }
        else {
            let idFrom = this.ids[this.ids.length - 1];
            this.idFrom = this.getFromEntity(idFrom.alias as string, this.fromEntity);
        }
        if (this.value !== undefined) this.value = this.budColl[this.value as undefined as number];
    }

    private scanFrom(from: any): FromEntity {
        if (from === undefined) return;
        const { arr, bizPhraseType, alias, subs } = from;
        let subsFrom: FromEntity[];
        if (subs !== undefined) {
            subsFrom = subs.map((v: any) => this.scanFrom(v));
        }
        let ret: FromEntity = {
            arr: arr.map((v: number) => this.biz.entityFromId(v)),
            bizPhraseType,
            alias,
            subs: subsFrom,
        };
        return ret;
    }

    private getFromEntity(alias: string, fromEntity: FromEntity): FromEntity {
        if (alias === fromEntity.alias) return fromEntity;
        const { subs } = fromEntity;
        if (subs === undefined) return;
        for (let sub of subs) {
            let ret = this.getFromEntity(alias, sub);
            if (ret !== undefined) return ret;
        }
        return undefined;
    }

    getFromEntityFromAlias(alias: string) {
        return this.getFromEntity(alias, this.fromEntity);
    }
}
