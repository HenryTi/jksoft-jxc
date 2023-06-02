import { AtomMetricSpec, Spec, SpecShoe } from "app/tool";
import { Page, uqAppModal } from "tonwa-app";
import { GenAtomSpec } from "./GenAtomSpec";
import { MetricItem } from "uqs/UqDefault";
import { PageAtomSelect } from "../Atom/PageAtomSelect";
import { FA, LMR, List, Sep } from "tonwa-com";

const cnGap = " px-3 py-2 ";
const cnBtn = " btn btn-outline-primary ";

export async function selectAtomMetricSpec(genAtomSpec: GenAtomSpec): Promise<AtomMetricSpec> {
    let { uqApp } = genAtomSpec;
    let spec: Spec;
    let metricItem: MetricItem;
    const { openModal, closeModal } = uqAppModal(uqApp);

    let atom = await openModal(<PageAtomSelect genAtom={genAtomSpec} />);
    if (atom === undefined) return;

    function ViewAtom() {
        let { no, ex } = atom;
        return <div className={cnGap}>
            no: {no} {ex}
        </div>;
    }

    function PageSelectMetric() {
        const onMetricItemSelect = (mi: MetricItem) => {
            metricItem = mi;
            closeModal();
        }
        function ViewItem({ value }: { value: MetricItem; }) {
            let { ex } = value;
            return <LMR className="px-3 py-2">
                <div className="fw-bold">{ex}</div>
                <FA name="angle-right" />
            </LMR>
        }
        return <Page header="计量单位">
            <ViewAtom />
            <Sep sep={2} />
            <List items={metricItems} onItemClick={onMetricItemSelect} ViewItem={ViewItem} />
            <Sep sep={2} />
        </Page>;
    }

    let { uq } = uqApp;
    let { ret: [metric], items: metricItems } = await uq.GetAtomMetric.query({ id: atom.id });
    let { length: metricItemsLength } = metricItems;
    if (metricItemsLength === 0) {
        metricItem = {
            id: 0,
            no: undefined,
            ex: '单个',
            base: undefined,
            div: undefined,
            value: undefined,
            template: undefined
        }
    }
    else if (metricItemsLength === 1) {
        metricItem = metricItems[0];
    }
    else {
        await openModal<MetricItem>(<PageSelectMetric />);
        if (metricItem === undefined) return;
    }

    function ViewMetric() {
        let { ex } = metricItem;
        return <div className={cnGap}>
            <span>计量单位</span> &nbsp;
            <span>{ex}</span>
        </div>;
    }

    let genSpec = genAtomSpec.genSpecFromAtom(atom.phrase);
    function PageSelectSpec() {
        let specEditing = {};
        const onNext = async (data: SpecShoe) => {
            Object.assign(specEditing, data);
            spec = specEditing;
            closeModal();
        }
        return <Page header="批次">
            <ViewAtom />
            <ViewMetric />
            <genSpec.Edit className={cnGap} spec={specEditing} submitCaption="下一步" onSubmit={onNext} submitClassName={cnBtn} />
        </Page>;
    }

    if (genSpec === undefined) {
        return { atom, metricItem };
    }
    await openModal(<PageSelectSpec />);
    if (spec === undefined) return;
    const atomMetricSpec: AtomMetricSpec = { atom, spec, metricItem };
    return atomMetricSpec;
}
