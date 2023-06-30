import { UqApp, useUqApp } from "app/UqApp";
import { OptionsUseBizAtom, useBizAtomList, useBizAtomNew, useBizAtomView, selectAtom } from "app/hooks";
import { PageAtomList, PageAtomNew, PageAtomView, GenAtom, PageAtomSelect, GenAtomNew } from "app/template/Atom";
import { GAtom, OptionsAtomSelect } from "app/tool";
import { Route } from "react-router-dom";
import { Atom, EnumAtom, uqSchema } from "uqs/UqDefault";

export class GenContact extends GenAtom {
    readonly bizEntityName = uqSchema.$biz.contact.name;
    get GenAtomNew(): new (genAtom: GenAtom) => GenAtomNew { return GenContactNew; }

    get PageSelect(): JSX.Element {
        return <PageAtomSelect genAtom={this} />;
    }

    readonly ViewItemAtom = ViewItemContact;
}

class GenContactNew extends GenAtomNew {
}

export function ViewItemContact({ value }: { value: Atom; }) {
    let { no, ex } = value;
    return <div>
        <div className='small text-muted'>{no}</div>
        <div><b>{ex}</b></div>
    </div>;
}

export function ModalSelectContact() {
    let uqApp = useUqApp();
    let genAtom = uqApp.objectOf(GenContact);
    return <PageAtomSelect genAtom={genAtom} />;
}

export function routeContact(uqApp: UqApp) {
    let { genAtomNew, genAtomList, genAtomView } = uqApp.objectOf(GenContact);
    return <>
        <Route path={genAtomNew.path} element={<PageAtomNew Gen={GenContact} />} />
        <Route path={genAtomList.path} element={<PageAtomList Gen={GenContact} />} />
        <Route path={`${genAtomView.path}/:id`} element={<PageAtomView Gen={GenContact} />} />
    </>;
};

const BizContact: OptionsUseBizAtom = {
    atomName: EnumAtom.Contact,
    NOLabel: undefined,
    exLabel: undefined,
}

function PageNew() {
    let ret = useBizAtomNew(BizContact);
    return ret;
}

function PageView() {
    let ret = useBizAtomView(BizContact);
    return ret;
}

function PageList() {
    let options = Object.assign({}, BizContact, {
        ViewItemAtom: ViewItemContact,
        top: undefined,
    })
    let ret = useBizAtomList(options);
    return ret;
}

// <PageAtomNew Gen={GenContact} />
// <PageAtomView Gen={GenContact} />
export const gContact: GAtom = {
    name: EnumAtom.Contact,
    pageNew: <PageNew />,
    pageEdit: <PageView />,
    pageList: <PageList />,
    pageView: <PageView />,
    ViewItem: ViewItemContact,
    /*
    select: async function (uqApp: UqApp, options: OptionsAtomSelect) {
        let ret = await selectAtom(uqApp, EnumAtom.Contact, options);
        return ret;
    }
    */
}
