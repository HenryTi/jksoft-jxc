import { EntityAtom, EntityOptions, Pickable } from "app/Biz";
import { EntityAtomID, EntitySpec } from "app/Biz/EntityAtom";
import { useCallback } from "react";
import { Page, useModal } from "tonwa-app";
import { usePickAtom } from "./usePickAtom";
import { usePickSpec } from "./userPickSpec";
import { useUqApp } from "app/UqApp";

export type PickFunc = (pickable: Pickable) => Promise<{ atom: number; spec: number; }>;

export function usePick() {
    const { biz } = useUqApp();
    const { openModal, closeModal } = useModal();
    const pickAtom = usePickAtom();
    const pickSpec = usePickSpec();
    async function pick(pickable: Pickable): Promise<{ atom: number; spec: number; }> {
        let { caption, atom, pick } = pickable;
        let atoms: EntityAtom[];
        let specs: EntitySpec[];
        if (pick !== undefined) {
            atoms = pick.atoms;
            specs = [...pick.specs];
        }
        else {
            atoms = [atom];
            specs = [];
        }
        if (caption === undefined) {
            let { caption: atomCaption, name: atomName } = atoms[0];
            caption = atomCaption ?? atomName;
        }
        const buttonCaption = '提交';
        const buttonClassName = 'btn btn-primary';
        let viewTop: any = <div>pick atom top</div>;

        // async function onPick() {
        let ret = await pickAtom(atoms[0], viewTop);
        if (ret === undefined) return;
        const { retAtom, retViewTop } = ret;
        const { phrase } = retAtom;
        let atomId = retAtom.id;
        let specId: number;
        let ea = biz.entities[phrase] as EntityAtom; //atoms.find(v => v.phrase === phrase);
        if (ea?.uom === true) {
            const specUom = biz.entities['specuom'] as EntitySpec;
            if (specUom !== undefined) {
                specs.push(specUom);
            }
        }
        if (specs.length > 0) {
            let base: number = retAtom.id;
            viewTop = retViewTop;
            async function stepPickSpec(spec: EntitySpec) {
                let ret = await pickSpec({
                    base,
                    entitySpec: spec,
                    viewTop,
                    buttonCaption,
                    buttonClassName,
                });
                if (ret === undefined) return false;
                const { retSpec, retViewTop } = ret;
                viewTop = retViewTop;
                specId = base = retSpec.id;
                return true;
            }
            for (let spec of specs) {
                let ret = await stepPickSpec(spec);
                if (ret === false) {
                    // closeModal(undefined);
                    break;
                }
            }
        }
        // closeModal({ atom: retAtom.id, spec: specId });
        // }
        /*
        let ret = await openModal(<Page header={caption}>
            <div className="m-3">
                <button className="btn btn-primary m-3" onClick={onPick}>Pick Atom</button>
            </div>
        </Page>);
        */
        return { atom: atomId, spec: specId ?? atomId };
    }
    return useCallback(pick, []);
}
