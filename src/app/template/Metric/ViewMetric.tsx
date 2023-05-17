import { UqApp, useUqApp } from "app/UqApp";
import { useQuery } from "react-query";
import { useModal } from "tonwa-app";
import { FA, LabelRow, List, Sep, useEffectOnce } from "tonwa-com";
import { Metric, MetricItem, MetricType, ReturnGetAtomMetricItems } from "uqs/UqDefault";
import { PageAdd } from "./PageAdd";
import { GenMetric } from "./GenMetric";
import { useRef, useState } from "react";

export interface ViewMetricProps {
    GenMetric?: new (uqApp: UqApp) => GenMetric;
    id: number;
    metric: string;
    className?: string;
}

interface MetricItemEdit extends MetricItem {
    $div: MetricItem;
}

export function ViewMetric({ GenMetric: Gen, id, metric: metricName, className }: ViewMetricProps) {
    const uqApp = useUqApp();
    const genMetric = uqApp.objectOf(Gen ?? GenMetric);
    const { openModal } = useModal();
    const ref = useRef<{ metric: Metric; div: MetricItem; }>();
    const [metricItems, setMetricItems] = useState<MetricItemEdit[]>([]);
    useEffectOnce(() => {
        (async () => {
            let { ret, items } = await genMetric.getAtomMetric(id);
            // return { results };
            ref.current = {
                ...ref.current,
                metric: ret[0],
            };
            setMetricItems(items as MetricItemEdit[]);
        })();
    });

    function ViewItem({ value: row }: { value: MetricItem & { $div: MetricItem }; }) {
        const { no, ex, value, $div } = row;
        const cnContent = ' p-3 ';
        const content = $div === undefined ?
            <span className={cnContent + ' text-info '}>(基本单位)</span>
            :
            <span className={cnContent}>{value + $div.ex}</span>;
        return <LabelRow>
            <span>{ex ?? no}</span>
            {content}
            <span></span>
        </LabelRow>
    }
    const none = <LabelRow labelClassName="px-3 py-3 small text-muted">
        <span className=""></span>
        <span className="small text-muted my-3">[无]</span>
        <span />
    </LabelRow>;
    async function onAddMetric() {
        let retNo = await uqApp.uq.IDNO({ ID: uqApp.uq.Metric });
        let len = metricItems.length;
        if (len > 0) {
            let div = metricItems[len - 1];
            ref.current = {
                ...ref.current,
                div: div,
            };
        }
        let ret = await openModal<MetricItemEdit>(<PageAdd no={retNo} div={ref.current.div} />);
        let { metric: savedMetric } = ref.current;
        let param = {
            ...ret,
            atom: id,
            base: savedMetric?.id,
            metricType: MetricType.count,
            metricTemplate: undefined as number,
            id: undefined as number,
            div: ref.current.div?.id,
        };
        let { id: metricItemId, metric: metricId } = await genMetric.saveMetricItem(param);
        let metricItem = { ...ret, id: metricItemId };
        ref.current = {
            ...ref.current,
            div: metricItem
        };
        if (metricId !== undefined) {
            let metric: Metric = {
                id: metricId,
                no: retNo,
                ex: ret.ex,
                type: MetricType.count,
                base: undefined,
                template: undefined,
            };
            ref.current.metric = metric;
        }
        setMetricItems([...metricItems, metricItem]);
    }
    return <div className={className}>
        <div className="border-bottom">
            <LabelRow labelClassName="px-3 py-1 small text-muted">
                <div>计量单位</div>
                <div />
                <button className="me-3 mb-1 btn btn-sm btn-outline-primary" onClick={onAddMetric}>
                    <FA name="plus" className="me-1" /> 增加
                </button>
            </LabelRow>
        </div>
        <div>
            <List items={metricItems} ViewItem={ViewItem} none={none} />
            <Sep />
        </div>
    </div>
}
