import { OptionsUseBizAtom, useBizAtomList, useBizAtomNew, useBizAtomView } from "app/hooks";
import { GAtom } from "app/tool";
import { ViewAtom } from "app/hooks";
import { EnumAtom } from "uqs/UqDefault";

const options: OptionsUseBizAtom = {
    atomName: EnumAtom.SumPersonPost,
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
        ViewItemAtom: ViewAtom,
        top: undefined,
    })
    let { page } = useBizAtomList(optionsList);
    return page;
}

export const gPersonPost: GAtom = {
    name: options.atomName,
    pageNew: <PageNew />,
    pageEdit: <PageView />,
    pageList: <PageList />,
    pageView: <PageView />,
    ViewItem: ViewAtom,
}
