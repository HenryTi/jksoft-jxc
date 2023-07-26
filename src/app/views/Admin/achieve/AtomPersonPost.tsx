import { OptionsUseBizAtom, useBizAtomList, useBizAtomNew, useBizAtomView } from "app/hooks";
import { GAtom } from "app/tool";
import { ViewItemID } from "app/views/ViewItemID";
import { EnumAtom } from "uqs/UqDefault";

const options: OptionsUseBizAtom = {
    atomName: EnumAtom.SumPersonPost,
    NOLabel: undefined,
    exLabel: undefined,
}

function PageNew() {
    let ret = useBizAtomNew(options);
    return ret;
}

function PageView() {
    let ret = useBizAtomView(options);
    return ret;
}

function PageList() {
    let optionsList = Object.assign({}, options, {
        ViewItemAtom: ViewItemID,
        top: undefined,
    })
    let ret = useBizAtomList(optionsList);
    return ret;
}

export const gPersonPost: GAtom = {
    name: options.atomName,
    pageNew: <PageNew />,
    pageEdit: <PageView />,
    pageList: <PageList />,
    pageView: <PageView />,
    ViewItem: ViewItemID,
}
