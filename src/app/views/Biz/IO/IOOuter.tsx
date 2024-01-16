import { OptionsUseBizAtom, ViewAtom, buildPathAtom, useBizAtomList, useBizAtomNew, useBizAtomView } from "app/hooks";
import { Page } from "tonwa-app";

const ioOuter = 'ioouter';
export const pathIOOuter = buildPathAtom(ioOuter);

const options: OptionsUseBizAtom = {
    atomName: 'atom' as any,
    NOLabel: undefined,
    exLabel: undefined,
}

export function PageIOOuterList() {
    let optionsList = {
        ...options,
        ViewItemAtom: ViewAtom,
        pathAtomNew: pathIOOuter.new,
        pathAtomView: pathIOOuter.view,
        top: undefined as any,
    };
    let { page } = useBizAtomList(optionsList);
    return page;
}

export function PageIOOuterNew() {
    let { page: Page } = useBizAtomNew(options);
    return Page;
}

export function PageIOOuterView() {
    let bottom = <div className="p-3">
        bottom
    </div>;
    let { caption, view } = useBizAtomView({ ...options, bottom });
    return <Page header={caption ?? '...'}>
        {view}
    </Page>;
}
