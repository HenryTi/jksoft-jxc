import { FormInput, FormRow } from "app/coms";
import { QueryMore } from "app/tool";
import { UqApp, useUqApp } from "app/UqApp";
import { UqID, UqQuery } from "tonwa-uq";
import { Item } from "uqs/UqDefault";
import { GenInput } from "app/tool";
import { BizItem } from "app/Biz";

export interface IDViewRowProps {
    name: string;
    label: string;
    readonly?: boolean;
}

export abstract class GenID extends GenInput {
    abstract get itemName(): string;
    get bizItem(): BizItem { return this.biz.items[this.itemName]; }
    readonly query: UqQuery<any, any>;
    readonly ID: UqID<any>;
    get labelClassName(): string { return 'text-end' }

    // IDList
    readonly searchItems: QueryMore;
    readonly ViewItemID: (value: any) => JSX.Element;
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
        let retNo = await this.uq.IDNO({ ID: this.ID });
        return {
            no: retNo,
            formRows: [
                this.rowNO(retNo),
                { name: 'ex', label: this.exLabel, type: 'text', options: { maxLength: 50 } },
                ...Array.from(this.bizItem.props, ([, v]) => ({ name: v.name, label: v.caption ?? v.name, type: 'text' })),
                { type: 'submit' },
            ],
        }
    }
    /*
    get formRows(): FormRow[] {
        return [
            this.rowNO,
            { name: 'ex', label: this.exLabel, type: 'text', options: { maxLength: 50 } },
            ...Array.from(this.bizItem.props, ([, v]) => ({ name: v.name, label: v.caption ?? v.name, type: 'text' })),
            { type: 'submit' },
        ]
    }
    */

    // IDView
    get viewRows(): IDViewRowProps[] {
        return [
            { name: 'id', label: 'id', readonly: true },
            { name: 'no', label: this.NOLabel, readonly: true },
            { name: 'ex', label: this.exLabel },
            ...Array.from(this.bizItem.props, ([, v]) => ({ name: v.name, label: v.caption }))
        ];
    }

    get caption() {
        let { name, caption } = this.bizItem;
        return caption ?? name;
    }

    get phrase() {
        let { name, type } = this.bizItem;
        return `${type}.${name}`;
    }

    constructor(uqApp: UqApp) {
        super(uqApp);
        this.ID = uqApp.uq.Item;

        let uq = this.uq;
        this.searchItems = async (param: any, pageStart: any, pageSize: number) => {
            let newParam = { ...param, item: this.phrase };
            let query = this.query ?? uq.SearchItem;
            let { $page } = await query.page(newParam, pageStart, pageSize);
            return $page;
        }

        this.actSave = async (no: string, data: any) => {
            const { ex } = data;
            let ret = await uq.SaveItem.submit({ item: this.phrase, no, ex });
            return ret;
        }

        this.autoLoadOnOpen = true;
        this.listTop = null; // <ListTop />;

        this.ViewItemID = ViewItemID;
    }
}

export function ViewItemID({ value: { no, ex } }: { value: Item }) {
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
