import { OptionsUseBizAtom, useBizAtomList, useBizAtomNew, useBizAtomView } from "app/hooks";
import { GAtom } from "app/tool";
import { EnumAtom } from "uqs/UqDefault";
import { ViewItemID } from "../ViewItemID";

const options: OptionsUseBizAtom = {
    atomName: EnumAtom.Person,
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

export const gPerson: GAtom = {
    name: options.atomName,
    pageNew: <PageNew />,
    pageEdit: <PageView />,
    pageList: <PageList />,
    pageView: <PageView />,
    ViewItem: ViewItemID,
}
