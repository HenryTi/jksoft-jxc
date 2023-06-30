import { QueryMore } from "app/tool";
import { UqApp, useUqApp } from "app/UqApp";
import { Biz, BizBud, EntityAtom } from "app/Biz";
import { uqAppModal } from "tonwa-app";
import { PageBizAtomSelectType } from "./PageBizAtomSelectType";

export function pathAtomNew(atomName: string) {
    return `{atomName}-new`;
}

export function pathAtomList(atomName: string) {
    return `{atomName}-list`;
}

export interface ViewPropRowProps {
    name: string;
    label: string;
    readonly?: boolean;
}

export interface ViewPropProps extends ViewPropRowProps {
    id: number;
    value: string | number;
    ValueTemplate?: (props: { value: any; }) => JSX.Element;
    savePropMain: (id: number, name: string, value: string | number) => Promise<void>;
    savePropEx: (id: number, bizBud: BizBud, value: string | number) => Promise<void>;
}

export interface OptionsUseBizAtom {
    atomName: string;
    NOLabel?: string;
    exLabel?: string;
}

export interface UseBizAtomReturn {
    uqApp: UqApp;
    biz: Biz;
    entity: EntityAtom;
    metric: string;
    pathView: string;
    pathList: string;
    getEntityAtom: (phrase: string) => EntityAtom;
    savePropMain: (id: number, name: string, value: string | number) => Promise<void>;
    savePropEx: (id: number, bizBud: BizBud, value: string | number) => Promise<void>;
    searchAtoms: QueryMore;
    selectLeafAtom: (entityAtom: EntityAtom) => Promise<EntityAtom>;
}

export function useBizAtom(options: OptionsUseBizAtom): UseBizAtomReturn {
    const { atomName: atomPhrase } = options;
    const uqApp = useUqApp();
    const { uq, biz } = uqApp;
    const entity = biz.entities[atomPhrase] as EntityAtom;
    const phrase = entity.phrase;
    const pathView = entity.name;
    const pathList = entity.name + '-list';
    // const phrase = `${entity.type}.${entity.name}`;

    function getEntityAtom(phrase: string): EntityAtom {
        return biz.entities[phrase] as EntityAtom;
    }

    async function savePropMain(id: number, name: string, value: string | number) {
        await uq.ActIDProp(uq.Atom, id, name, value);
    }

    async function savePropEx(id: number, bizBud: BizBud, value: string | number) {
        // let { entity } = this;
        // let { props } = entity;
        // let bizProp = props.get(name);
        let int: number, dec: number, str: string;
        switch (bizBud.budDataType.type) {
            default:
            case 'int': int = value as number; break;
            case 'dec': dec = value as number; break;
            case 'str': str = value as string; break;
        }
        await uq.SaveBud.submit({
            id,
            phrase: bizBud.phrase,
            int, dec, str
        });
    }
    async function searchAtoms(param: any, pageStart: any, pageSize: number): Promise<any[]> {
        let newParam = { atom: phrase, ...param };
        let query = uq.SearchAtom;
        let { $page } = await query.page(newParam, pageStart, pageSize);
        return $page;
    };
    async function selectLeafAtom(entityAtom: EntityAtom): Promise<EntityAtom> {
        if (entityAtom === undefined) entityAtom = entity;
        const { openModal } = uqAppModal(uqApp);
        const { children } = entityAtom;
        switch (children.length) {
            case 0: return entityAtom;
            case 1: return children[0];
            default:
                let page = <PageBizAtomSelectType entityAtom={entityAtom} caption="选择类型" />;
                if (!page) return entityAtom;
                let ea = await openModal<EntityAtom>(page);
                if (ea === undefined) return undefined;
                let ret = await selectLeafAtom(ea);
                return ret;
        }
    }
    return {
        uqApp,
        biz,
        entity,
        metric: entity.metric,
        pathView,
        pathList,
        getEntityAtom,
        savePropMain,
        savePropEx,
        searchAtoms,
        selectLeafAtom,
    };
    /*
    readonly bizEntityType = 'atom';
    readonly Atom: UqID<any>;
    readonly genAtomNew: GenAtomNew;
    readonly genAtomEdit: GenAtomEdit;
    readonly genAtomList: GenAtomList;
    readonly genAtomView: GenAtomView;
    readonly genAtomSelect: GenAtomSelect;

    constructor(uqApp: UqApp) {
        super(uqApp);
        this.Atom = this.uq.Atom;
        this.genAtomNew = new this.GenAtomNew(this);
        this.genAtomEdit = new this.GenAtomEdit(this);
        this.genAtomList = new this.GenAtomList(this);
        this.genAtomView = new this.GenAtomView(this);
        this.genAtomSelect = new this.GenAtomSelect(this);
    }

    protected get GenAtomNew(): new (genAtom: GenAtom) => GenAtomNew { return GenAtomNew; }
    protected get GenAtomEdit(): new (genAtom: GenAtom) => GenAtomEdit { return GenAtomEdit; }
    protected get GenAtomList(): new (genAtom: GenAtom) => GenAtomList { return GenAtomList; }
    protected get GenAtomView(): new (genAtom: GenAtom) => GenAtomView { return GenAtomView; }
    protected get GenAtomSelect(): new (genAtom: GenAtom) => GenAtomSelect { return GenAtomSelect; }

    get path() { return this.bizEntityName; }

    get noMedsMessage(): string { return 'no meds' }

    readonly searchAtoms: QueryMore = async (param: any, pageStart: any, pageSize: number) => {
        let newParam = { atom: this.phrase, ...param };
        let query = this.uq.SearchAtom;
        let { $page } = await query.page(newParam, pageStart, pageSize);
        return $page;
    };

    readonly ViewItemAtom: (value: any) => JSX.Element = ViewItemID;

    get NOLabel(): string { return '编号' }
    get exLabel(): string { return '名称' }

    // IDView
    get caption() {
        let { name, caption } = this.entity;
        return caption ?? name;
    }

    get phrase() {
        let { name, type } = this.entity;
        return `${type}.${name}`;
    }

    getEntityAtom(phrase: string): EntityAtom {
        // return this.biz.atoms[phrase];
        return this.biz.entities[phrase] as EntityAtom;
    }

    async savePropMain(id: number, name: string, value: string | number) {
        await this.uq.ActIDProp(this.uq.Atom, id, name, value);
    }

    async savePropEx(id: number, bizBud: BizBud, value: string | number) {
        // let { entity } = this;
        // let { props } = entity;
        // let bizProp = props.get(name);
        let int: number, dec: number, str: string;
        switch (bizBud.budDataType.type) {
            default:
            case 'int': int = value as number; break;
            case 'dec': dec = value as number; break;
            case 'str': str = value as string; break;
        }
        await this.uq.SaveBud.submit({
            id,
            phrase: bizBud.phrase,
            int, dec, str
        });
    }

    get PageSelect(): JSX.Element {
        return null;
    }

    protected getPageSelectType(entityAtom: EntityAtom): JSX.Element {
        return <PageAtomSelectType gen={this} entityAtom={entityAtom} />;
    }

    async selectLeafAtom(entityAtom: EntityAtom): Promise<EntityAtom> {
        if (entityAtom === undefined) entityAtom = this.entity;
        const { openModal } = uqAppModal(this.uqApp);
        const { children } = entityAtom;
        switch (children.length) {
            case 0: return entityAtom;
            case 1: return children[0];
            default:
                let page = this.getPageSelectType(entityAtom);
                if (!page) return entityAtom;
                let ea = await openModal<EntityAtom>(page);
                if (ea === undefined) return undefined;
                let ret = await this.selectLeafAtom(ea);
                return ret;
        }
    }
*/
}
/*
abstract class GenAtomEx extends Gen {
    readonly genAtom: GenAtom;
    constructor(genAtom: GenAtom) {
        super(genAtom.uqApp);
        this.genAtom = genAtom;
    }
    abstract get path(): string;
    get entity() { return this.genAtom.entity; }
    get caption() { return this.genAtom.caption; }
    get exLabel() { return this.genAtom.exLabel; }
    get NOLabel() { return this.genAtom.NOLabel; }
    get phrase() { return this.genAtom.phrase; }
}

export class GenAtomNew extends GenAtomEx {
    get path() { return `${this.genAtom.path}-new`; }
    readonly actSave = async (entityAtom: EntityAtom, no: string, data: any) => {
        const { ex } = data;
        let ret = await this.uq.SaveAtom.submit({ atom: entityAtom.phrase, no, ex });
        return ret;
    }

    async buildNew(): Promise<{ no: string; formRows: FormRow[] }> {
        let retNo = await this.uq.IDNO({ ID: this.genAtom.Atom });
        return {
            no: retNo,
            formRows: [
                {
                    name: 'no',
                    label: this.NOLabel,
                    type: 'text',
                    options: { maxLength: 20, disabled: true, value: retNo }
                },
                { name: 'ex', label: this.exLabel, type: 'text', options: { maxLength: 50 } },
                { type: 'submit', label: '下一步' },
            ],
        };
    }
}

export class GenAtomEdit extends GenAtomEx {
    get path() { return `${this.genAtom.path}-edit`; }
}

export class GenAtomList extends GenAtomEx {
    get path() { return `${this.genAtom.path}-list`; }
    readonly listTop?: JSX.Element = null;
}

export class GenAtomView extends GenAtomEx {
    get path() { return `${this.genAtom.path}-view`; }
    get viewRows(): ViewPropRowProps[] {
        return [
            { name: 'id', label: 'id', readonly: true, },
            { name: 'no', label: this.NOLabel, readonly: true, },
            { name: 'ex', label: this.exLabel, },
        ];
    }
}

export class GenAtomSelect extends GenAtomEx {
    get path() { return undefined as string; }
    get placeholder(): string { return `${this.caption}编号名称`; }
}

export function ViewItemID({ value: { no, ex } }: { value: Atom }) {
    return <div className="d-block">
        <div><b>{ex}</b></div>
        <div className='small text-muted'>{no}</div>
    </div>;
}

function ListTop() {
    async function onClick() {
        alert('click ok');
    }
    return <div className="px-3 py-3">
        <button className='btn btn-outline-primary' onClick={onClick}>test auto reload entities</button>
    </div>;
}
*/