import { OptionsUseBizAtom, useBizAtomList, useBizAtomNew, useBizAtomView } from "app/hooks";
import { GAtom } from "app/tool";
import { Atom, EnumAtom } from "uqs/UqDefault";

const options: OptionsUseBizAtom = {
    atomName: EnumAtom.Uom,
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
    let { page } = useBizAtomList({ ...options, ViewItemAtom: ViewItemUom });
    return page;
}

function ViewItemUom({ value }: { value: Atom; }) {
    return <div>
        {JSON.stringify(value)}
    </div>
}

export const gUom: GAtom = {
    name: options.atomName,
    pageNew: <PageNew />,
    pageEdit: <PageView />,
    pageList: <PageList />,
    pageView: <PageView />,
    ViewItem: ViewItemUom,
}
