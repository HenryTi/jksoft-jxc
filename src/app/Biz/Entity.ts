import { BizBud } from "./BizBud";
import { BizBase } from "./BizBase";
import { Biz } from "./Biz";
import { EntitySelf } from "./AtomsBuilder";
import { EntityAtomID } from "./EntityAtom";

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
    readonly props: BizBud[] = [];
    budGroups: BudGroups;

    // subClasses 有3种不同情况:
    // 1. Atom 里面 extends 的sub
    // 2. Sheet 里面，包含的 main 和 details
    // 3. Bin 里面的 Pend
    getSubClasses(): Entity[] { return undefined; }

    protected override fromSwitch(i: string, val: any) {
        if (val === undefined) {
            return;
        }
        switch (i) {
            default: super.fromSwitch(i, val); break;
            case 'props': this.fromProps(val); break;
            case 'groups': this.fromGroups(val); break;
        }
    }

    protected fromGroups(groups: any[]) {
        let budGroups: BudGroups = {
            home: new BudGroup(this.biz, 0, '-', undefined),
            must: new BudGroup(this.biz, 0, '+', undefined),
            arr: [],
        } as any;
        for (let g of groups) {
            const { id, name, buds } = g;
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

        this.biz.atomBuilder.initBudGroups(this, budGroups);
    }

    protected fromProp(prop: any) {
        let { id, name, dataType } = prop;
        let bizBud = new BizBud(this.biz, id, name, dataType, this);
        let { budDataType } = bizBud;
        if (budDataType === undefined) {
            debugger;
            return;
        }
        budDataType.fromSchema(prop);
        bizBud.fromSchema(prop);
        return bizBud;
    }

    protected fromProps(props: any[]) {
        let buds: BizBud[] = [];
        for (let prop of props) {
            let bizBud = this.fromProp(prop);
            if (bizBud === undefined) continue;
            buds.push(bizBud);
        }
        this.biz.atomBuilder.initBuds(this, buds);
    }

    protected buildBudsGroups(/*buds: BizBud[], groups: BudGroups*/) {
        let entitySelf = this.biz.atomBuilder.self(this);
        this.buildBudsGroupsFromSelf(entitySelf);
        /*
        let { buds, groups } = entitySelf;
        if (buds === undefined) {
            return;
        }
        this.props.push(...buds);
        this.budGroups = this.cloneBudGroups(groups);
        for (let bud of buds) {
            bud.scan();
            this.budColl[bud.id] = bud;
        }
        // this.buildBudsGroups(entitySelf);
        */
    }

    protected buildBudsGroupsFromSelf(entitySelf: EntitySelf) {
        let { buds, groups } = entitySelf;
        if (buds === undefined) {
            return;
        }
        this.props.push(...buds);
        this.budGroups = this.cloneBudGroups(groups);
        for (let bud of buds) {
            bud.scan();
            this.budColl[bud.id] = bud;
        }
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
        if (group === undefined) debugger;
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
            atoms: atoms?.map(v => this.biz.entityFromId(v) as EntityAtomID)
        };
    }

    scan() {
        this.buildBudsGroups();
        this.scanBudGroups();
        /*
        let entitySelf = this.biz.atomBuilder.self(this);
        let { buds } = entitySelf;
        if (buds === undefined) {
            return;
        }
        else {
            for (let bud of buds) {
                bud.scan();
                this.budColl[bud.id] = bud;
            }
            this.buildBudsGroups(entitySelf);
            this.scanBudGroups();
        }
        */
    }

    private scanBudGroups() {
        if (this.budGroups === undefined) return;
        const { home, must, arr } = this.budGroups;
        this.scanBudGroup(home);
        this.scanBudGroup(must);
        for (let group of arr) this.scanBudGroup(group);
    }

    private scanBudGroup(group: BudGroup) {
        group.buds = (group.buds as any[]).map(v => {
            return typeof (v) === 'number' ? this.budColl[v] : v;
        });
    }
}
