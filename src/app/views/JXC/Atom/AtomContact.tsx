import { useUqApp } from "app/UqApp";
import { OptionsUseBizAtom, useBizAtomList, useBizAtomNew, useBizAtomView } from "app/hooks";
import { GAtom } from "app/tool";
import { Atom, EnumAtom, uqSchema } from "uqs/UqDefault";

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
