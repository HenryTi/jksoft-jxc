import { ViewAtom } from "app/hooks";
import { ChangeEvent, useRef } from "react";
import { Page, useModal } from "tonwa-app";
import { List } from "tonwa-com";
import { Atom } from "uqs/UqDefault";
import { Selection } from "./UserSumStore";

export function PageSelectAtom({ atoms, selected: selectedList, onSelectChanged }: {
    atoms: Atom[];
    selected: number[];
    onSelectChanged: (selection: Selection) => Promise<void>;
}) {
    const modal = useModal();
    const refSel = useRef<Selection>({ selected: [...selectedList], added: [], removed: [], });
    const list = atoms.map(v => {
        const { id } = v;
        return { atom: v, sel: selectedList.find(s => s === id) !== undefined };
    });
    function ViewItem({ value: { atom, sel } }: { value: { atom: Atom; sel: boolean; }; }) {
        async function onChange(evt: ChangeEvent<HTMLInputElement>) {
            let { id } = atom;
            const { selected, added, removed } = refSel.current;
            let indexSelectedList = selectedList.findIndex(v => v === id);
            let indexSelected = selected.findIndex(v => v === id);
            let indexAdded = added.findIndex(v => v === id);
            let indexRemoved = removed.findIndex(v => v === id);
            if (evt.currentTarget.checked === true) {
                if (indexSelectedList < 0) {
                    added.push(id);
                }
                else {
                    if (indexRemoved >= 0) removed.splice(indexRemoved, 1);
                }
                if (indexSelected < 0) selected.push(id);
            }
            else {
                if (indexSelectedList < 0) {
                    if (indexAdded >= 0) added.splice(indexAdded, 1);
                }
                else {
                    removed.push(id);
                }
                if (indexSelected >= 0) selected.splice(indexSelected, 1);
            }
            await onSelectChanged(refSel.current);
        }
        return <label className="d-flex p-3">
            <input type="checkbox" className="form-check-input me-3" defaultChecked={sel} onChange={onChange} />
            <ViewAtom value={atom} />
        </label>;
    }
    function onClose() {
        modal.close(refSel.current);
    }
    return <Page header="请选择">
        <List items={list} ViewItem={ViewItem} />
        <div className="p-3">
            <button className="btn btn-primary" onClick={onClose}>关闭</button>
        </div>
    </Page>;
}
