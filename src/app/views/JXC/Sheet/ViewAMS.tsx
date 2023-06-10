import { Atom, AtomMetric, AtomMetricSpec, MetricItem } from "uqs/UqDefault";
import { GenGoods } from "../Atom";
import { IDView } from "tonwa-app";
import { Band } from "app/coms";
import { Spec } from "app/tool";
import { FA } from "tonwa-com";

export function ViewAMSAtom({ genGoods, id }: { genGoods: GenGoods; id: number; }) {
    let { uq } = genGoods;
    function Template({ value: { atomMetric, spec } }: { value: AtomMetricSpec; }) {
        function TemplateAtomMetric({ value: { atom, metricItem } }: { value: AtomMetric; }) {
            function TemplateAtom({ value }: { value: Atom }) {
                return <genGoods.ViewItemAtom value={value} />;
            }
            return <IDView id={atom} uq={uq} Template={TemplateAtom} />;
        }
        return <IDView id={atomMetric} uq={uq} Template={TemplateAtomMetric} />;
    }
    return <IDView id={id} uq={uq} Template={Template} />;
}

export function ViewAMSMetric({ genGoods, id }: { genGoods: GenGoods; id: number; }) {
    let { uq } = genGoods;
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

export function ViewAMSSpec({ genGoods, id, hasLabel }: { genGoods: GenGoods; id: number; hasLabel?: boolean; }) {
    let { uq } = genGoods;
    function Template({ value: { atomMetric, spec } }: { value: AtomMetricSpec; }) {
        if (spec === 0) return null;
        function TemplateAtomMetric({ value: { atom } }: { value: AtomMetric; }) {
            function TemplateAtom({ value }: { value: Atom; }) {
                let { $phrase } = value as any;
                let genSpec = genGoods.genSpecFromAtom($phrase);
                function TemplateSpec({ value }: { value: Spec; }) {
                    return <genSpec.View value={value} />;
                }
                let content = <IDView id={spec} uq={uq} Template={TemplateSpec} />;
                if (hasLabel === true) {
                    return <div className="container">
                        <Band label={genSpec.caption}>
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

export function ViewAMSAtomSpec({ genGoods, id, className }: { genGoods: GenGoods; id: number; className?: string; }) {
    return <>
        <div className={className}>
            <ViewAMSAtom id={id} genGoods={genGoods} />
        </div>
        <div className={className}>
            <ViewAMSSpec id={id} genGoods={genGoods} />
        </div>
    </>;
}
