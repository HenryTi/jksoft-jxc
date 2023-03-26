import { FormInput, FormRow } from "app/coms";
import { SeedJoin, QueryMore } from "app/tool";
import { UqApp, useUqApp } from "app/UqApp";
import { UqID, UqQuery } from "tonwa-uq";
import { Item } from "uqs/UqDefault";
import { PartInput } from "../Part";

export interface IDViewRowProps {
    name: string;
    label: string;
    readonly?: boolean;
}

export abstract class PartID extends PartInput {
    abstract get IDType(): string;
    readonly query: UqQuery<any, any>;
    readonly ID: UqID<any>;

    // IDList
    readonly searchItems: QueryMore;
    readonly ViewItemID: (value: any) => JSX.Element;
    readonly listTop?: JSX.Element;

    // IDNew
    readonly formRows: FormRow[];
    readonly onNo: (no: string) => void;
    readonly actSave: (no: string, data: any) => Promise<any>;

    // IDSelect
    get placeholder(): string { return `${this.caption}编号名称`; }
    //readonly abstract onItemClick: (item: any) => Promise<void>;
    readonly autoLoadOnOpen: boolean;   // auto load data on open

    // IDView
    readonly viewRows: IDViewRowProps[];

    constructor(uqApp: UqApp) {
        super(uqApp);
        this.ID = uqApp.uq.Item;

        let uq = this.uq;
        this.searchItems = async (param: any, pageStart: any, pageSize: number) => {
            let newParam = { ...param, IDType: this.IDType };
            let query = this.query ?? uq.SearchItem;
            let { $page } = await query.page(newParam, pageStart, pageSize);
            return $page;
        }

        const rowNO: FormInput = { name: 'no', label: '编号', type: 'text', options: { maxLength: 20, disabled: true } };
        this.formRows = [
            rowNO,
            { name: 'ex', label: '名称', type: 'text', options: { maxLength: 50 } },
            { type: 'submit' },
        ];
        this.onNo = (no: string) => {
            rowNO.options.value = no;
        }
        this.actSave = async (no: string, data: any) => {
            const { ex } = data;
            let ret = await uq.SaveItem.submit({ IDType: this.IDType, pNo: no, ex });
            return ret;
        }

        this.viewRows = [
            { name: 'id', label: 'id', readonly: true },
            { name: 'no', label: '编号', readonly: true },
            { name: 'ex', label: '名称' },
        ];

        this.autoLoadOnOpen = true;
        this.listTop = <ListTop />;

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
    const uqApp = useUqApp();
    const { UqDefault } = uqApp.uqs;
    async function onClick() {
        alert('click ok');
    }
    return <div className="px-3 py-3">
        <button className='btn btn-outline-primary' onClick={onClick}>test auto reload entities</button>
    </div>;
}
