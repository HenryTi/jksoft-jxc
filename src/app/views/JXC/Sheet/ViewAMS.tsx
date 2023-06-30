import { Atom, AtomMetric, AtomMetricSpec, MetricItem } from "uqs/UqDefault";
import { ViewAtomGoods, ViewSpec } from "../Atom";
import { IDView } from "tonwa-app";
import { Band } from "app/coms";
import { Spec } from "app/tool";
import { FA } from "tonwa-com";
import { useUqApp } from "app/UqApp";
import { GenSpec } from "app/hooks";

export function ViewAMSAtom({ id }: { id: number; }) {
    const { uq } = useUqApp();
    function Template({ value: { atomMetric, spec } }: { value: AtomMetricSpec; }) {
        function TemplateAtomMetric({ value: { atom, metricItem } }: { value: AtomMetric; }) {
            function TemplateAtom({ value }: { value: Atom }) {
                return <ViewAtomGoods value={value} />;
            }
            return <IDView id={atom} uq={uq} Template={TemplateAtom} />;
        }
        return <IDView id={atomMetric} uq={uq} Template={TemplateAtomMetric} />;
    }
    return <IDView id={id} uq={uq} Template={Template} />;
}

export function ViewAMSMetric({ id }: { id: number; }) {
    const { uq } = useUqApp();
    function Template({ value: { atomMetric } }: { value: AtomMetricSpec; }) {
        function TemplateAtomMetric({ value: { metricItem } }: { value: AtomMetric; }) {
            function TemplateMetricItem({ value }: { value: MetricItem }) {
                return <>{value.ex}</>;
            }
            if (!metricItem) {
                return <span className="text-danger"><FA name="times-circle" /> 无计量单位</span>;
            }
            return <IDView id={metricItem} uq={uq} Template={TemplateMetricItem} />;
        }
        return <IDView id={atomMetric} uq={uq} Template={TemplateAtomMetric} />;
    }
    return <IDView id={id} uq={uq} Template={Template} />;
}

export function ViewAMSSpec({ id, hasLabel }: { id: number; hasLabel?: boolean; }) {
    const uqApp = useUqApp();
    const { uq } = uqApp;
    function Template({ value: { atomMetric, spec } }: { value: AtomMetricSpec; }) {
        if (spec === 0) return null;
        function TemplateAtomMetric({ value: { atom } }: { value: AtomMetric; }) {
            function TemplateAtom({ value }: { value: Atom; }) {
                let { $phrase } = value as any;
                // let genSpec: GenSpec = genGoods.genSpecFromAtom($phrase);
                const gSpec = uqApp.specFromAtom($phrase);
                function TemplateSpec({ value }: { value: Spec; }) {
                    return <gSpec.View value={value} />;
                    // return <genSpec.View value={value} />;
                }
                let content = <IDView id={spec} uq={uq} Template={TemplateSpec} />;
                if (hasLabel === true) {
                    return <div className="container">
                        <Band label={gSpec.caption}>
                            {content}
                        </Band>
                    </div>;
                }
                return content;
            }
            return <IDView id={atom} uq={uq} Template={TemplateAtom} />;
        }
        return <IDView id={atomMetric} uq={uq} Template={TemplateAtomMetric} />;
    }
    return <IDView id={id} uq={uq} Template={Template} />;
}

export function ViewAMSAtomSpec({ id, className }: { id: number; className?: string; }) {
    return <>
        <div className={className}>
            <ViewAMSAtom id={id} />
        </div>
        <div className={className}>
            <ViewAMSSpec id={id} />
        </div>
    </>;
}
