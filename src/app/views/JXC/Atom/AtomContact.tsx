import { OptionsUseBizAtom, useBizAtomList, useBizAtomNew, useBizAtomView } from "app/hooks";
import { GAtom } from "app/tool";
import { Atom, EnumAtom } from "uqs/UqDefault";

export function ViewItemContact({ value }: { value: Atom; }) {
    let { no, ex } = value;
    return <div>
        <div className='small text-muted'>{no}</div>
        <div><b>{ex}</b></div>
    </div>;
}

const optionsContact: OptionsUseBizAtom = {
    atomName: EnumAtom.Contact,
    NOLabel: undefined,
    exLabel: undefined,
}

function PageNew() {
    let ret = useBizAtomNew(optionsContact);
    return ret;
}

function PageView() {
    let ret = useBizAtomView(optionsContact);
    return ret;
}

function PageList() {
    let options = Object.assign({}, optionsContact, {
        ViewItemAtom: ViewItemContact,
        top: undefined,
    })
    let ret = useBizAtomList(options);
    return ret;
}

export const gContact: GAtom = {
    name: EnumAtom.Contact,
    pageNew: <PageNew />,
    pageEdit: <PageView />,
    pageList: <PageList />,
    pageView: <PageView />,
    ViewItem: ViewItemContact,
}
