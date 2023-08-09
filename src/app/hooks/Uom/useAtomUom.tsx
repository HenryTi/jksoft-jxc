import { useUqApp } from "app/UqApp";
import { ParamSaveAtomUom } from "uqs/UqDefault";

export function useAtomUom() {
    const { uq } = useUqApp();
    async function getAtomUom(id: number) {
        let { uomI, uomX } = await uq.GetAtomUom.query({ id });
        return {
            uomI: uomI[0],
            uomX,
        }
    }

    async function saveAtomUom(param: ParamSaveAtomUom): Promise<number> {
        let result = await uq.SaveAtomUom.submit(param);
        let { id } = result;
        return id;
    }

    async function hideAtomUom(id: number): Promise<void> {
        await uq.HideAtomUomX.submit({ id });
    }

    async function deleteAtomUomI(atom: number, uomI: number): Promise<void> {
        await uq.DeleteAtomUomI.submit({ atom, uomI });
    }
    return {
        getAtomUom,
        saveAtomUom,
        hideAtomUom,
        deleteAtomUomI,
    }
}
