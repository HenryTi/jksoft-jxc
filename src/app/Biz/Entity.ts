import { BizBud } from "./BizBud";
import { BizBase } from "./BizBase";
import { Biz } from "./Biz";
import { EntityID } from "./EntityAtom";

export class BudGroup extends BizBase {
    groupName: string;      // not phrase, only name part
    buds: BizBud[] = [];
    constructor(biz: Biz, id: number, name: string, type: string) {
        super(biz, id, name, type);
        let p = name.indexOf('.');
        if (p < 0) this.groupName = name
        else this.groupName = name.substring(p + 1);
    }
}
export interface BudGroups {
    home: BudGroup;
    must: BudGroup;
    arr: BudGroup[];
}

export class Entity extends BizBase {
    // readonly selfProps: BizBud[] = [];       // 本 Atom 定义的
    readonly budColl: { [key: string | number]: BizBud; } = {};           // 包括全部继承来的
    readonly buds: BizBud[] = [];                       // 是否包含继承的？
    budGroups: BudGroups;
    user: BizBud[];

    // subEntities 有3种不同情况:
    // 1. Atom 里面 extends 的sub
    // 2. Sheet 里面，包含的 main 和 details
    // 3. Bin 里面的 Pend
    getRefEntities(arrEntity: Entity[]) { }

    protected override fromSwitch(i: string, val: any) {
        if (val === undefined) {
            return;
        }
        switch (i) {
            default: super.fromSwitch(i, val); break;
            case 'props':
                let buds = this.fromProps(val);
                // this.biz.atomBuilder.initBuds(this, buds);
                this.buds.push(...buds);
                break;
            case 'groups': this.fromGroups(val); break;
            case 'user': this.fromUser(val); break;
        }
    }

    protected fromUser(val: any[]) {
        this.user = this.fromProps(val);
        this.biz.entityWithUser.push(this);
    }

    protected fromGroups(groups: any[]) {
        let budGroups: BudGroups = {
            home: undefined, // new BudGroup(this.biz, 0, '-', undefined),
            must: undefined, // new BudGroup(this.biz, 0, '+', undefined),
            arr: [],
        } as any;
        for (let g of groups) {
            const { id, name, buds } = g;
            if (id !== undefined && typeof id !== 'number') debugger;
            let group: BudGroup;
            switch (g.name) {
                case '-':
                    group = budGroups.home = new BudGroup(this.biz, id, name, undefined);
                    break;
                case '+':
                    group = budGroups.must = new BudGroup(this.biz, id, name, undefined);
                    break;
                default:
                    group = new BudGroup(this.biz, id, name, undefined);
                    budGroups.arr.push(group);
                    break;
            }
            group.buds = buds;
        }
        this.budGroups = budGroups;
    }

    cloneBudGroups(groups: BudGroups) {
        if (groups === undefined) return undefined;
        let { home: privateHome, must: privateMust, arr: privateArr } = groups;
        let home = this.cloneBudGroup(privateHome);
        let must = this.cloneBudGroup(privateMust);
        let arr = [];
        for (let g of privateArr) {
            arr.push(this.cloneBudGroup(g));
        }
        return {
            home, must, arr,
        }
    }

    protected cloneBudGroup(group: BudGroup) {
        if (group === undefined) return;
        const { id, name, type, buds } = group;
        let ret: BudGroup = new BudGroup(this.biz, id, name, type);
        // clone other attribute
        if (buds !== undefined) {
            ret.buds.push(...buds);
        }
        return ret;
    }

    protected fromIxField(val: any) {
        let caption: string = val.caption;
        let atoms: number[] = val.atoms;
        return {
            caption,
            atoms: atoms?.map(v => this.biz.entityFromId(v) as EntityID)
        };
    }

    scan() {
        if (this.scaned === true) return;
        //this.buildBudsGroups();
        this.scanBuds();
        this.scanBudGroups();
        this.scaned = true;
    }

    protected idArrToBudArr(ids: number[]): BizBud[] {
        if (ids === undefined) return;
        return ids.map(v => this.budColl[v]);
    }

    protected scanBuds() {
        for (let bud of this.buds) {
            const { id, name } = bud;
            this.budColl[id] = bud;
            this.budColl[name] = bud;
            bud.scan();
        }
        if (this.user !== undefined) {
            for (let bud of this.user) {
                bud.scan();
            }
        }
    }

    private scanBudGroups() {
        if (this.budGroups === undefined) return;
        const { home, must, arr } = this.budGroups;
        this.scanBudGroup(home);
        this.scanBudGroup(must);
        for (let group of arr) this.scanBudGroup(group);
    }

    private scanBudGroup(group: BudGroup) {
        if (group === undefined) return;
        const { buds } = group;
        if (buds === undefined) return;
        group.buds = (buds as any[]).map(v => {
            return typeof (v) === 'number' ? this.budColl[v] : v;
        });
    }

    protected buildBud(bizBud: BizBud, prop: any) {
        let { budDataType } = bizBud;
        if (budDataType === undefined) {
            debugger;
            return bizBud;
        }
        budDataType.fromSchema(prop);
        bizBud.fromSchema(prop);
        return bizBud;
    }

    protected fromProp(prop: any) {
        if (prop === undefined) debugger;
        let { id, name, dataType } = prop;
        let bizBud = new BizBud(this.biz, id, name, dataType, this);
        this.buildBud(bizBud, prop);
        return bizBud;
    }

    fromProps(props: any[]) {
        let buds: BizBud[] = [];
        for (let prop of props) {
            let bizBud = this.fromProp(prop);
            if (bizBud === undefined) continue;
            buds.push(bizBud);
        }
        return buds;
    }
}
