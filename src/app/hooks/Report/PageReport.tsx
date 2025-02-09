import { EntityDuo, EntityID, EntityReport, ReportTitle } from "tonwa";
import { useUqApp } from "app/UqApp";
import { PageQueryMore } from "app/coms";
import { useCallback } from "react";
import { BizPhraseType, ParamGetReport } from "uqs/UqDefault";
import { ViewForkPropsH } from "../View";
import { FA } from "tonwa-com";
import { Link } from "react-router-dom";
import { Period, ViewPeriodHeader, path, usePeriod } from "app/tool";
import { useAtomValue } from "jotai";
import { useModal } from "tonwa-app";
import { ViewAtomId } from "../BizAtom";
import { PageIDSelect } from "../BizPick";

interface SpecRow {
    id: number;
    phrase: number;
    base: number;
    value: number[];
    props: object;
}

interface ReportRow {
    id: number;
    phrase: number;
    no: string;
    ex: string;
    value: number[];
    sums: number[];
    specs: SpecRow[];
}

export function PageReport({ entityReport }: { entityReport: EntityReport; }) {
    const { from } = entityReport;
    switch (from.bizPhraseType) {
        default:
            debugger;
            break;
        case BizPhraseType.atom:
            return <PageResult entityReport={entityReport} atomId={undefined} top={undefined} />;
        case BizPhraseType.combo:
            return <PageSelect entityReport={entityReport} />;
    }
}

function PageSelect({ entityReport }: { entityReport: EntityReport; }) {
    const modal = useModal();
    const { id, from, title, caption, name } = entityReport;
    const { i } = from as EntityDuo;
    let atom = i.atoms[0];
    let atomCaption: string = atom.caption ?? atom.name;
    /*
    return <Page header={`选择${atomCaption} - ${caption ?? name}`}>

    </Page>
    */
    async function onSelected(atomId: number) {
        let top = <div className="p-3">
            <ViewAtomId id={atomId} />
        </div>
        await modal.open(<PageResult entityReport={entityReport} atomId={atomId} top={top} />)
    }

    return <PageIDSelect entity={atom as EntityID} onSelected={onSelected} />;
}

function PageResult({ entityReport, atomId, top }: { entityReport: EntityReport; atomId: number; top: any }) {
    const { uq } = useUqApp();
    const { id, from, title } = entityReport;
    let timeZone: number = 8;
    let unitBizMonth: number = 6;
    let unitBizDate: number = 1;
    const [period, setEnumPeriod] = usePeriod(timeZone, unitBizMonth, unitBizDate, onChanged);
    const state = useAtomValue(period.state);
    const param: ParamGetReport = {
        reportPhrase: id,
        atomPhrase: from.id,
        atomId,
        dateStart: state.from,
        dateEnd: state.to,
        params: { a: 1 }
    };
    async function onChanged(period: Period) {
    }
    const query = useCallback(async (queryParam: any, pageStart: any, pageSize: number) => {
        let { $page, forks } = await uq.GetReport.page(queryParam, pageStart, pageSize);
        let ret: ReportRow[] = [];
        let coll: { [id: number]: ReportRow } = {};
        for (let row of $page) {
            let rr: ReportRow = { ...row, specs: [], sums: undefined };
            const { id } = rr;
            coll[id] = rr;
            ret.push(rr);
        }
        for (let fork of forks) {
            let { base } = fork;
            let rr = coll[base];
            if (rr === undefined) continue;
            rr.specs.push(fork);
        }
        for (let rr of ret) {
            const { value, specs } = rr;
            const sums: number[] = [];
            if (specs.length === 0) {
                sums.push(...rr.value);
            }
            else {
                for (let spec of specs) {
                    const { value } = spec;
                    if (value === undefined) continue;
                    const { length: len } = value;
                    for (let i = 0; i < len; i++) {
                        let sum = sums[i];
                        if (sum === undefined) sum = 0;
                        sum += value[i];
                        sums[i] = sum;
                    }
                }
            }
            rr.sums = sums;
        }
        return ret;
    }, []);

    function ViewValue({ values, titles, isSum }: { values: (string | number)[]; titles: ReportTitle[]; isSum?: boolean }) {
        let cn = isSum === true ? 'fw-bold' : '';
        return <div className="d-flex">
            {titles.map((title, index) => {
                const { caption: titleCaption, bud: { caption, name } } = title;
                return <div className="w-6c" key={index}>
                    <div className="small text-secondary text-end">{titleCaption ?? caption ?? name}</div>
                    <div className={'text-end ' + cn}>{values[index]}</div>
                </div>;
            })}
        </div>;
    }
    function ViewItem({ value: rr }: { value: ReportRow }) {
        const { no, ex, specs, sums } = rr;
        return <div className="">
            <div className="px-3 py-2 tonwa-bg-gray-2 d-flex align-items-end">
                <div className="flex-grow-1">
                    <div className="small text-secondary">{no}</div>
                    <div>{ex}</div>
                </div>
                <ViewValue values={sums} titles={title} isSum={true} />
                <FA name="angle-right" className="ms-5 invisible" />
            </div>
            <div className="ms-5 border-start">
                {specs?.map(v => {
                    let { id, phrase, value, props } = v;
                    return <Link key={id} to={path('../history', title[0].bud.id, id)}>
                        <div className="d-flex ps-3 pe-3 py-2 border-bottom align-items-center">
                            <ViewForkPropsH phrase={phrase} props={props as []} />
                            <div className="flex-grow-1">
                            </div>
                            <ViewValue values={value} titles={title} />
                            <FA name="angle-right" className="ms-5" />
                        </div>
                    </Link>
                })}
            </div>
        </div>;
    }
    return <PageQueryMore header={entityReport.caption ?? entityReport.name}
        query={query}
        param={param}
        sortField="id"
        ViewItem={ViewItem}
    >
        {top}
        <ViewPeriodHeader period={period} setEnumPeriod={setEnumPeriod} />
    </PageQueryMore>;
}
