import { FormInput, FormRow } from "app/coms";
import { QueryMore } from "app/tool";
import { UqApp } from "app/UqApp";
import { UqID, UqQuery } from "tonwa-uq";
import { Atom } from "uqs/UqDefault";
import { GenInput } from "app/tool";
import { BizAtom } from "app/Biz";

export interface IDViewRowProps {
    name: string;
    label: string;
    readonly?: boolean;
}

export abstract class GenAtom extends GenInput {
    abstract get atomName(): string;
    get path() { return this.atomName; }
    get pathNew() { return `${this.path}-new` }
    get pathEdit() { return `${this.path}-edit` }
    get pathView() { return `${this.path}-view` }
    get pathList() { return `${this.path}-list` }
    get bizAtom(): BizAtom { return this.biz.atoms[this.atomName]; }
    readonly Atom: UqID<any>;
    // get labelClassName(): string { return 'text-end' }

    // IDList
    searchAtoms: QueryMore;
    readonly ViewItemAtom: (value: any) => JSX.Element;
    readonly listTop?: JSX.Element;

    readonly actSave: (no: string, data: any) => Promise<any>;

    // IDSelect
    get placeholder(): string { return `${this.caption}编号名称`; }
    readonly autoLoadOnOpen: boolean;   // auto load data on open

    get NOLabel(): string { return '编号' }
    rowNO(no: string): FormInput {
        return {
            name: 'no',
            label: this.NOLabel,
            type: 'text',
            options: { maxLength: 20, disabled: true, value: no }
        }
    };

    get exLabel(): string { return '名称' }
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

    // IDView
    get viewRows(): IDViewRowProps[] {
        return [
            { name: 'id', label: 'id', readonly: true },
            { name: 'no', label: this.NOLabel, readonly: true },
            { name: 'ex', label: this.exLabel },
        ];
    }

    get caption() {
        let { name, caption } = this.bizAtom;
        return caption ?? name;
    }

    get phrase() {
        let { name, type } = this.bizAtom;
        return `${type}.${name}`;
    }

    constructor(uqApp: UqApp) {
        super(uqApp);
        this.Atom = uqApp.uq.Atom;

        let uq = this.uq;
        this.searchAtoms = async (param: any, pageStart: any, pageSize: number) => {
            let newParam = { ...param, atom: this.phrase };
            let query = uq.SearchAtom;
            let { $page } = await query.page(newParam, pageStart, pageSize);
            return $page;
        }

        this.actSave = async (no: string, data: any) => {
            const { ex } = data;
            let ret = await uq.SaveAtom.submit({ atom: this.phrase, no, ex });
            return ret;
        }

        this.autoLoadOnOpen = true;
        this.listTop = null; // <ListTop />;

        this.ViewItemAtom = ViewItemID;
    }
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
