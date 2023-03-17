import { FormInput, FormRow } from "app/coms";
import { PageIDList, PageIDNew, PageIDView, IDViewRowProps, PartID, PageIDSelect } from "app/template/ID";
import { UqApp, useUqApp } from "app/UqApp";
import { Link, Route } from "react-router-dom";
import { Uq, UqID, UqQuery } from "tonwa-uq";
import { Contact } from "uqs/JsTicket";

export const pathContactNew = 'contact-new';
export const pathContactList = 'contact-list';
export const pathContactView = 'contact-view';
export const pathContactEdit = 'contact-edit';

class IDPartContact extends PartID {
    readonly caption: string;
    readonly path: string;

    // IDList
    readonly ViewItem: (value: any) => JSX.Element;
    readonly query: UqQuery<any, any>;
    readonly listTop?: JSX.Element;

    // IDNew
    readonly ID: UqID<any>;
    readonly formRows: FormRow[];
    readonly onNo: (no: string) => void;
    readonly actSave: (no: string, data: any) => Promise<any>;

    // IDSelect
    readonly placeholder?: string;
    readonly onItemClick: (item: any) => Promise<void>;
    readonly autoLoadOnOpen?: boolean;

    // IDView
    readonly viewRows: IDViewRowProps[];

    constructor(uqApp: UqApp) {
        super(uqApp);
        let uq = this.uq

        this.caption = '往来单位';
        this.ViewItem = ViewContact;
        this.query = uq.SearchContact;
        this.listTop = <ListTop />;

        this.ID = uq.Contact;

        const rowNO: FormInput = { name: 'no', label: '编号', type: 'text', options: { maxLength: 20, disabled: true } };
        this.formRows = [
            rowNO,
            { name: 'name', label: '名称', type: 'text', options: { maxLength: 50 } },
            { type: 'submit' },
        ];
        this.onNo = (no: string) => {
            rowNO.options.value = no;
        }
        this.actSave = async (no: string, data: any) => {
            const { name } = data;
            let ret = await uq.SaveContact.submit({ pNo: no, name });
            return ret;
        }

        this.placeholder = `${this.caption}编号名称`;
        this.autoLoadOnOpen = true;

        this.viewRows = [
            { name: 'id', label: 'id', readonly: true },
            { name: 'no', label: '编号', readonly: true },
            { name: 'name', label: '名称' },
        ];
    }
}

export function ViewContact({ value: { no, name } }: { value: Contact }) {
    return <div className="d-block">
        <div><b>{name}</b></div>
        <div className='small text-muted'>{no}</div>
    </div>;
}

function PageContactNew() {
    return <PageIDNew Part={IDPartContact} />;
}

function PageContactView() {
    return <PageIDView Part={IDPartContact} />;
}

function PageContactList() {
    return <PageIDList Part={IDPartContact} />
}

/*
const IDCaption = '往来单位';
function PageNew() {
    const uqApp = useUqApp();
    const { JsTicket } = uqApp.uqs;
    const rowNO: FormInput = { name: 'no', label: '编号', type: 'text', options: { maxLength: 20, disabled: true } };
    const formRows: FormRow[] = [
        rowNO,
        { name: 'name', label: '名称', type: 'text', options: { maxLength: 50 } },
        { type: 'submit' },
    ];
    async function actSave(no: string, data: any) {
        const { name } = data;
        let ret = await JsTicket.SaveContact.submit({ pNo: no, name });
        return ret;
    }
    function onNo(no: string) {
        rowNO.options.value = no;
    }
    return <PageIDNew header={`新建${IDCaption}`}
        ID={JsTicket.Contact}
        formRows={formRows}
        onNo={onNo}
        actSave={actSave}
    />;
}

function PageView() {
    const uqApp = useUqApp();
    const { JsTicket } = uqApp.uqs;
    const rows: IDViewRowProps[] = [
        { name: 'id', label: 'id', readonly: true },
        { name: 'no', label: '编号', readonly: true },
        { name: 'name', label: '名称' },
    ];
    return <PageIDView header={IDCaption}
        ID={JsTicket.Contact}
        rows={rows}
    />;
}

export function PageList() {
    const uqApp = useUqApp();
    const { JsTicket } = uqApp.uqs;
    function ItemView({ value: { id, no, name } }: { value: Contact }) {
        return <Link className="d-block px-3 py-2" to={`../${pathContactView}/${id}`}>
            <div className='small text-secondary'>{id}</div>
            <div>{no} {name}</div>
        </Link>;
    }
    return <PageIDList header={`${IDCaption}列表`}
        ItemView={ItemView}
        query={JsTicket.SearchContact}
        listTop={<ListTop />}
    />
}
*/

function ListTop() {
    const uqApp = useUqApp();
    const { JsTicket } = uqApp.uqs;
    async function onClick() {
        let ret = await JsTicket.Sp.submit({});
        alert('click ok');
    }
    return <div>
        <button className='btn btn-outline-primary' onClick={onClick}>test auto reload entities</button>
    </div>;
}

export const routeContact = <>
    <Route path={pathContactNew} element={<PageContactNew />} />
    <Route path={pathContactList} element={<PageContactList />} />
    <Route path={`${pathContactView}/:id`} element={<PageContactView />} />
</>;
