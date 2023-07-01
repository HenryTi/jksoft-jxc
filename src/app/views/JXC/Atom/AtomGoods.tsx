import { Atom, EnumAtom } from "uqs/UqDefault";
import { GAtom } from "app/tool";
import { OptionsUseBizAtom, useBizAtomList, useBizAtomNew, useBizAtomView } from "app/hooks";

export function ViewAtomGoods({ value }: { value: Atom; }) {
    let { no, ex } = value;
    return <div>
        <div className='small text-muted'>{no}</div>
        <div><b>{ex}</b></div>
    </div>;
}

const optionsGoods: OptionsUseBizAtom = {
    atomName: EnumAtom.Goods,
    NOLabel: undefined,
    exLabel: undefined,
}

function PageNew() {
    let ret = useBizAtomNew(optionsGoods);
    return ret;
}

function PageView() {
    let ret = useBizAtomView(optionsGoods);
    return ret;
}

function PageList() {
    let options = Object.assign({}, optionsGoods, {
        ViewItemAtom: ViewAtomGoods,
        top: undefined,
    })
    let ret = useBizAtomList(options);
    return ret;
}

export const gGoods: GAtom = {
    name: EnumAtom.Goods,
    pageNew: <PageNew />,
    pageEdit: <PageView />,
    pageList: <PageList />,
    pageView: <PageView />,
    ViewItem: ViewAtomGoods,
}
