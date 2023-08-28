import { AtomSpec, Spec, Uom } from "app/tool";
import { Page, uqAppModal } from "tonwa-app";
import { EnumAtom } from "uqs/UqDefault";
import { selectAtom } from "../BizAtom";
import { FA, LMR, List, Sep } from "tonwa-com";
import { UqApp } from "app/UqApp";

const cnGap = " px-3 py-2 ";
const cnBtn = " btn btn-outline-primary ";

export async function selectAtomSpec(uqApp: UqApp, atomName: EnumAtom): Promise<AtomSpec> {
    // let spec: Spec;
    let uom: Uom;
    const { openModal, closeModal } = uqAppModal(uqApp);

    let atom = await selectAtom(uqApp, atomName);
    if (atom === undefined) return;

    function ViewAtom() {
        let { no, ex } = atom;
        return <div className={cnGap}>
            no: {no} {ex}
        </div>;
    }

    function PageSelectUom() {
        const onUomSelect = (uomParam: Uom) => {
            uom = uomParam;
            closeModal();
        }
        function ViewItem({ value }: { value: Uom; }) {
            let { ex } = value;
            return <LMR className="px-3 py-2">
                <div className="fw-bold">{ex}</div>
                <FA name="angle-right" />
            </LMR>
        }
        return <Page header="计量单位">
            <ViewAtom />
            <Sep sep={2} />
            <List items={uomXs} onItemClick={onUomSelect} ViewItem={ViewItem} />
            <Sep sep={2} />
        </Page>;
    }

    let { uq } = uqApp;
    let { uomI, uomX: uomXs } = await uq.GetAtomUomI.query({ id: atom.id });
    let { length: uomXsLength } = uomXs;
    if (uomXsLength === 0) {
        uom = {
            id: 0,
            no: undefined,
            ex: '单个',
            atomUom: 0,
            // base: undefined,
            // div: undefined,
            // value: undefined,
            // template: undefined
        }
    }
    else if (uomXsLength === 1) {
        uom = uomXs[0];
    }
    else {
        await openModal<Uom>(<PageSelectUom />);
        if (uom === undefined) return;
    }

    function ViewUom() {
        let { ex } = uom;
        return <div className={cnGap}>
            <span>计量单位</span> &nbsp;
            <span>{ex}</span>
        </div>;
    }

    let gSpec = uqApp.specFromAtom(atom.phrase);

    function PageSelectSpec() {
        const onNext = async (data: Spec) => {
            data.$phrase = gSpec.entity.phrase;
            closeModal(data);
        }
        return <Page header="批次">
            <ViewAtom />
            <ViewUom />
            <gSpec.Edit className={cnGap} spec={{}} submitCaption="下一步" onSubmit={onNext} submitClassName={cnBtn} />
        </Page>;
    }

    if (gSpec === undefined) {
        return { atom, uom };
    }
    let spec = await openModal<Spec>(<PageSelectSpec />);
    if (spec === undefined) return;
    const atomSpec: AtomSpec = { atom, spec, uom };
    return atomSpec;
}
