import { AtomSpec, AtomUomProps, Spec, Uom, readUoms } from "app/tool";
import { Page, uqAppModal, useModal } from "tonwa-app";
import { EnumAtom } from "uqs/UqDefault";
import { FA, LMR, List, Sep } from "tonwa-com";
import { useSelectAtom } from "../BizAtom/PageAtomSelect";
import { useUqApp } from "app/UqApp";

const cnGap = " px-3 py-2 ";
const cnBtn = " btn btn-outline-primary ";

export function useSelectAtomSpec() {
    const uqApp = useUqApp();
    const { openModal, closeModal } = useModal();
    const selectAtom = useSelectAtom();
    return async function selectAtomSpec(atomName: EnumAtom): Promise<AtomSpec> {
        // let spec: Spec;
        let uom: AtomUomProps;
        let atom = await selectAtom(atomName);
        if (atom === undefined) return;

        function ViewAtom() {
            let { no, ex } = atom;
            return <div className={cnGap}>
                no: {no} {ex}
            </div>;
        }

        function PageSelectUom() {
            const onUomSelect = (uomParam: AtomUomProps) => {
                uom = uomParam as any;
                closeModal();
            }
            function ViewItem({ value }: { value: AtomUomProps; }) {
                let { ex } = value;
                return <LMR className="px-3 py-2">
                    <div className="fw-bold">{ex}</div>
                    <FA name="angle-right" />
                </LMR>
            }
            return <Page header="计量单位">
                <ViewAtom />
                <Sep sep={2} />
                <List items={uoms} onItemClick={onUomSelect} ViewItem={ViewItem} />
                <Sep sep={2} />
            </Page>;
        }

        let { uq } = uqApp;
        let { uoms: uomsArr } = await uq.GetAtom.query({ id: atom.id });
        let uoms = readUoms(uomsArr);
        let { length: uomsLength } = uoms;
        if (uomsLength === 0) {
            uom = {
                // id: 0,
                // no: undefined,
                ex: '单个',
                uom: 0,
                atomUom: 0,
                // base: undefined,
                // div: undefined,
                // value: undefined,
                // template: undefined
            }
        }
        else if (uomsLength === 1) {
            uom = uoms[0];
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

        let uomProps = { id: uom.uom, no: undefined, ex: uom.ex } as any;
        if (gSpec === undefined) {
            return { atom, uom: uomProps };
        }
        let spec = await openModal<Spec>(<PageSelectSpec />);
        if (spec === undefined) return;
        const atomSpec: AtomSpec = { atom, spec, uom: uomProps };
        return atomSpec;
    }
}
