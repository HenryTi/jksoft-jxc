import { OptionsUseBizAtom, ViewAtom, buildPathAtom, useBizAtomList, useBizAtomNew, useBizAtomView } from "app/hooks";

const ioApp = 'ioapp';
export const pathIOApp = buildPathAtom(ioApp);

const options: OptionsUseBizAtom = {
    atomName: 'atom' as any,
    NOLabel: undefined,
    exLabel: undefined,
}

export function PageIOAppList() {
    let optionsList = {
        ...options,
        ViewItemAtom: ViewAtom,
        pathAtomNew: pathIOApp.new,
        pathAtomView: pathIOApp.view,
        top: undefined as any,
    };
    let { page } = useBizAtomList(optionsList);
    return page;
}

export function PageIOAppNew() {
    let { page: Page } = useBizAtomNew(options);
    return Page;
}

export function PageIOAppView() {
    let { page: Page } = useBizAtomView(options);
    return Page;
}
