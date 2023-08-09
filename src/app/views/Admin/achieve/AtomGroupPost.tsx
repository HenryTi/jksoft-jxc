import { OptionsUseBizAtom, useBizAtomList, useBizAtomNew, useBizAtomView } from "app/hooks";
import { GAtom } from "app/tool";
import { ViewItemID } from "app/views/ViewItemID";
import { EnumAtom } from "uqs/UqDefault";

const options: OptionsUseBizAtom = {
    atomName: EnumAtom.SumGroupPost,
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
        ViewItemAtom: ViewItemID,
        top: undefined,
    })
    let { page } = useBizAtomList(optionsList);
    return page;
}

export const gGroupPost: GAtom = {
    name: options.atomName,
    pageNew: <PageNew />,
    pageEdit: <PageView />,
    pageList: <PageList />,
    pageView: <PageView />,
    ViewItem: ViewItemID,
}
