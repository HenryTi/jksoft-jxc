import { OptionsUseBizAtom, useBizAtomList, useBizAtomNew, useBizAtomView } from "app/hooks";
import { GAtom } from "app/tool";
import { EnumAtom } from "uqs/UqDefault";
import { ViewAtom } from "app/hooks";

const options: OptionsUseBizAtom = {
    atomName: EnumAtom.Contact,
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

export const gContact: GAtom = {
    name: options.atomName,
    pageNew: <PageNew />,
    pageEdit: <PageView />,
    pageList: <PageList />,
    pageView: <PageView />,
    ViewItem: ViewAtom,
}
