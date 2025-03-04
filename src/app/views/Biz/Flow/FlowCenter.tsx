import { ViewNotifyCount } from "app/tool";
import { useUqApp } from "app/UqApp";
import { centers } from "app/views/center";
import { ViewCurSiteHeader } from "app/views/Site";
import { ChangeEvent, ChangeEventHandler, JSX, useState } from "react";
import { Link, Route } from "react-router-dom";
import { SvgSheet, SvgFlow, SvgLongArrow } from "svgs";
//import { SvgSheet } from "svgs";
import { EntityFlow, EntitySheet } from "tonwa";
import { Page } from "tonwa-app";
import { FA, List, to62 } from "tonwa-com";

enum Style {
    style1 = 1,
    style2 = 2,
}

function PageFlowCenter() {
    const uqApp = useUqApp();
    const { biz } = uqApp;
    const { flows } = biz;
    const { flow } = centers;
    const { caption: pageCaption } = flow;
    const [style, setStyle] = useState(undefined as Style);

    function ViewSheetTypeStyle1({ value, index }: { value: EntitySheet; index?: number; }) {
        let { caption, name, id: entityId, coreDetail } = value;
        let pendEntityId: number;
        let vNotifyCount: any;
        if (coreDetail !== undefined) {
            pendEntityId = coreDetail.pend?.id;
            if (pendEntityId !== undefined) {
                vNotifyCount = <div className="position-absolute" style={{ right: "0rem", top: "-0.5rem" }}>
                    <div className="ms-1">
                        <ViewNotifyCount phrase={pendEntityId} />
                    </div>
                </div>;
            }
        }
        let vArrow: any;
        if (index > 0) {
            vArrow = <div className="mx-2 text-body-tertiary small">
                <FA name="long-arrow-right" fixWidth={true} size="2x" />
            </div>;
        }
        return <div className="d-flex align-items-center pe-3">
            {vArrow}
            <Link
                to={`/test-mvc-sheet/${to62(entityId)}`} className="flex-fill"
            >
                <div className="px-1 py-2 align-items-start d-flex border-info rounded-3 my-2">
                    <div className="position-relative">
                        <FA name="file-text" className="my-1 me-2 text-info" size="2x" />
                        {vNotifyCount}
                    </div>
                    <span className="text-body">{caption ?? name}</span>
                </div>
            </Link>
        </div>
    }

    function ViewSheetTypeStyle2({ value, index }: { value: EntitySheet; index?: number; }) {
        let { caption, name, id: entityId, coreDetail } = value;
        let pendEntityId: number;
        let vNotifyCount: any;
        if (coreDetail !== undefined) {
            pendEntityId = coreDetail.pend?.id;
            if (pendEntityId !== undefined) {
                vNotifyCount = <div className="position-absolute" style={{ right: "-1rem", top: "-0.5rem" }}>
                    <div className="ms-1">
                        <ViewNotifyCount phrase={pendEntityId} />
                    </div>
                </div>;
            }
        }
        let vArrow: any;
        if (index > 0) {
            // <FA name="long-arrow-right" fixWidth={true} size="2x" />
            vArrow = <div className="mx-5 text-body-tertiary small">
                <SvgLongArrow />
            </div>;
        }
        // <FA name="file-text" className="my-1 text-info" size="2x" />
        return <>
            {vArrow}
            <Link
                to={`/test-mvc-sheet/${to62(entityId)}`} className="align-self-start"
            >
                <div className="py-2 d-flex flex-column align-items-center border-info rounded-3 my-2 text-center w-max-10c">
                    <div className="position-relative">
                        <SvgSheet />
                        {vNotifyCount}
                    </div>
                    <span className="text-body mt-1">{caption ?? name}</span>
                </div>
            </Link>
        </>
    }

    let cnList: string;
    let ViewSheetType: (props: { value: EntitySheet; index?: number; }) => JSX.Element;
    switch (style) {
        case Style.style1:
            ViewSheetType = ViewSheetTypeStyle1;
            cnList = ' mx-3 my-1 row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 row-cols-xxl-6 g-0 ';
            break;
        default:
        case Style.style2:
            ViewSheetType = ViewSheetTypeStyle2;
            cnList = ' mx-5 my-1 d-flex flex-wrap align-items-center ';
            break;
    }

    function ViewItemFlow({ value }: { value: EntityFlow; }) {
        const { caption, sheets, memo } = value;
        // <FA name="tasks" className="me-2 text-success" />
        return <div>
            <div className="px-3 pt-1 py-1 border-bottom tonwa-bg-gray-2 d-flex align-items-center">
                <span className="me-2"><SvgFlow /></span>
                {caption}
            </div>
            <div>{memo}</div>
            <div className={cnList + ' my-3'}>
                {sheets.map((v, index) => {
                    return <ViewSheetType key={v.id} value={v} index={index} />;
                })}
            </div>
        </div>;
    }

    function onStyleChange(e: ChangeEvent<HTMLSelectElement>) {
        setStyle(Number(e.currentTarget.value));
    }

    /*
    const right = <select onChange={onStyleChange} className="me-1">
        <option value={Style.style2}>风格1</option>
        <option value={Style.style1}>风格2</option>
    </select>;
     right={right}
    */
    return <Page header={<ViewCurSiteHeader caption={pageCaption} />}>
        <List items={flows} ViewItem={ViewItemFlow} className={undefined} sep={null} />
    </Page>;
}

export function routeFlowCenter() {
    return <>
        <Route path={centers.flow.path} element={<PageFlowCenter />} />
    </>;
}
