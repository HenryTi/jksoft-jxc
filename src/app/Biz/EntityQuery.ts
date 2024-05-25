import { BizPhraseType } from "uqs/UqDefault";
import { BizBud } from "./BizBud";
import { Entity } from "./Entity";

export interface FromEntity {
    arr: Entity[];
    bizPhraseType: BizPhraseType;
    alias: string;
    subs: FromEntity[];
}

export class EntityQuery extends Entity {
    asc: 'asc' | 'desc';
    ban: string | true;
    params: BizBud[];
    idFrom: FromEntity;
    fromEntity: FromEntity;
    private cols: [number, number][];
    protected override fromSwitch(i: string, val: any) {
        switch (i) {
            default: super.fromSwitch(i, val); break;
            case 'asc': this.asc = val; break;
            case 'params': this.params = (val as any[]).map(v => this.fromProp(v)); break;
            case 'ban': this.ban = val; break;
            case 'cols': this.cols = val; break;
            case 'idFrom': this.idFrom = val; break;
            case 'from': this.fromEntity = val; break;
        }
    }

    scan(): void {
        super.scan();
        for (let col of this.cols) {
            let [eId, bId] = col;
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

        this.fromEntity = this.scanFrom(this.fromEntity);
        if (this.idFrom === undefined) {
            this.idFrom = this.fromEntity;
        }
        else {
            this.idFrom = this.getFromEntity(this.idFrom as unknown as string, this.fromEntity);
        }
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
        debugger;
        return undefined;
    }
}
