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

const options: OptionsUseBizAtom = {
    atomName: EnumAtom.Goods,
    NOLabel: undefined,
    exLabel: undefined,
}

function PageNew() {
    let { page: Page } = useBizAtomNew(options);
    return Page;
}

function PageView() {
    let { page } = useBizAtomView(options);
    return page;
}

function PageList() {
    let optionsList = Object.assign({}, options, {
        ViewItemAtom: ViewAtomGoods,
        top: undefined,
    })
    let { page } = useBizAtomList(optionsList);
    return page;
}

export const gGoods: GAtom = {
    name: EnumAtom.Goods,
    pageNew: <PageNew />,
    pageEdit: <PageView />,
    pageList: <PageList />,
    pageView: <PageView />,
    ViewItem: ViewAtomGoods,
}
