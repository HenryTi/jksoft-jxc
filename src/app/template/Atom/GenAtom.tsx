import { FormInput, FormRow } from "app/coms";
import { Gen, GenBizEntity, QueryMore } from "app/tool";
import { UqApp } from "app/UqApp";
import { UqID, UqQuery } from "tonwa-uq";
import { Atom } from "uqs/UqDefault";
import { BizAtom } from "app/Biz";

export interface ViewPropRowProps {
    name: string;
    label: string;
    readonly?: boolean;
}

export interface ViewPropProps extends ViewPropRowProps {
    id: number;
    value: string | number;
    gen: GenAtom;
    ValueTemplate?: (props: { value: any; }) => JSX.Element;
}

export abstract class GenAtom extends GenBizEntity {
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
    get bizAtom(): BizAtom { return this.biz.atoms[this.bizEntityName]; }

    readonly searchAtoms: QueryMore = async (param: any, pageStart: any, pageSize: number) => {
        let newParam = { ...param, atom: this.phrase };
        let query = this.uq.SearchAtom;
        let { $page } = await query.page(newParam, pageStart, pageSize);
        return $page;
    };

    readonly ViewItemAtom: (value: any) => JSX.Element = ViewItemID;

    // IDList
    /*
        readonly ViewItemAtom: (value: any) => JSX.Element;
        readonly listTop?: JSX.Element;
    */
    //    readonly actSave: (no: string, data: any) => Promise<any>;

    // IDSelect

    /*
    rowNO(no: string): FormInput {
        return {
            name: 'no',
            label: this.NOLabel,
            type: 'text',
            options: { maxLength: 20, disabled: true, value: no }
        }
    };
    */

    get NOLabel(): string { return '编号' }
    get exLabel(): string { return '名称' }
    /*
        // IDNew
        async buildNew(): Promise<{ no: string; formRows: FormRow[] }> {
            let retNo = await this.uq.IDNO({ ID: this.Atom });
            return {
                no: retNo,
                formRows: [
                    this.rowNO(retNo),
                    { name: 'ex', label: this.exLabel, type: 'text', options: { maxLength: 50 } },
                    ...Array.from(this.bizAtom.props, ([, v]) => ({ name: v.name, label: v.caption ?? v.name, type: 'text' })),
                    { type: 'submit' },
                ],
            }
        }
    */
    // IDView
    get caption() {
        let { name, caption } = this.bizAtom;
        return caption ?? name;
    }

    get phrase() {
        let { name, type } = this.bizAtom;
        return `${type}.${name}`;
    }

    async savePropMain(id: number, name: string, value: string | number) {
        await this.uq.ActIDProp(this.uq.Atom, id, name, value);
    }

    async savePropEx(id: number, name: string, value: string | number) {
        let { bizAtom } = this;
        let { props } = bizAtom;
        let bizProp = props.get(name);
        let int: number, dec: number, str: string;
        switch (bizProp.budType.type) {
            default:
            case 'int': int = value as number; break;
            case 'dec': dec = value as number; break;
            case 'str': str = value as string; break;
        }
        await this.uq.SaveProp.submit({
            id,
            phrase: name,
            int, dec, str
        });
    }

    get SelectPage(): JSX.Element {
        return null;
    }
}

abstract class GenAtomEx extends Gen {
    protected readonly genAtom: GenAtom;
    constructor(genAtom: GenAtom) {
        super(genAtom.uqApp);
        this.genAtom = genAtom;
    }
    abstract get path(): string;
    get bizAtom() { return this.genAtom.bizAtom; }
    get caption() { return this.genAtom.caption; }
    get exLabel() { return this.genAtom.exLabel; }
    get NOLabel() { return this.genAtom.NOLabel; }
    get phrase() { return this.genAtom.phrase; }
}

export class GenAtomNew extends GenAtomEx {
    get path() { return `${this.genAtom.path}-new`; }
    readonly actSave = async (no: string, data: any) => {
        const { ex } = data;
        let ret = await this.uq.SaveAtom.submit({ atom: this.phrase, no, ex });
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
        // ...Array.from(this.bizAtom.props, ([, v]) => ({ name: v.name, label: v.caption ?? v.name, type: 'text' })),
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
