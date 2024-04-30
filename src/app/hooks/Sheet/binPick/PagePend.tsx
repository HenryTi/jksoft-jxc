import { Page, useModal } from "tonwa-app";
import { FA, List, Sep, setAtomValue, theme } from "tonwa-com";
import { BudsEditing, DivStore, PendRow } from "../store";
import { ViewPendRowEdit } from "../binEdit/ViewPendRowEdit";
import { ViewSteps } from "../dash/ViewSteps";
import { LabelBox, RowCols } from "app/hooks/tool";
import { EditBudInline, LabelRowEdit } from "app/hooks";
import { BizBud, PickPend, ValueSetType } from "app/Biz";

export function PagePend(props: { divStore: DivStore; caption: string; pickPend: PickPend; }) {
    let { divStore, caption, pickPend } = props;
    let { entityBin: { pend: entityPend }, pendRows, sheetStore } = divStore;
    const { sheetConsole: { steps }, atomLoaded, bizAtomColl } = sheetStore;
    const modal = useModal();
    let { name: pendName, params } = entityPend;

    if (caption === undefined) {
        caption = entityPend.caption ?? pendName;
    }
    function ViewItemPendRow({ value: pendRow }: { value: PendRow }) {
        return <ViewPendRowEdit pendRow={pendRow} divStore={divStore} />;
    }
    let onItemSelectFunc: any, btnFinish: any;
    function BtnNext() {
        function onNext() {
            modal.close([]);
        }
        return <button className="btn btn-primary" onClick={onNext}>
            下一步
            <FA name="angle-right" className="ms-2" />
        </button>;
    }
    function BtnClose() {
        let content = steps === undefined ? '关闭' :
            <><FA name="angle-left" className="me-2" />上一步</>;
        function onClose() {
            let ret: any = undefined;
            if (steps !== undefined) {
                setAtomValue(atomLoaded, false);
            }
            else {
                ret = [];
            }
            modal.close(ret);
        }
        return <button className="btn btn-outline-info" onClick={onClose}>
            {content}
        </button>;
    }
    let footer: any, cnFooter = ' px-3 py-2 ';
    if (pendRows.length > 0) {
        footer = <div className={'d-flex ' + cnFooter}>
            <BtnNext />
            <div className="flex-fill" />
            {steps && <BtnClose />}
        </div>
    }
    else {
        footer = <div className={cnFooter}><BtnClose /></div>;
    }

    function ViewParams() {
        // let { length } = params;
        let paramsInput: BizBud[] = [];
        let { pickParams } = pickPend;
        for (let bud of params) {
            if (pickParams.findIndex(v => v.name === bud.name) >= 0) continue;
            // if (bud.valueSetType === ValueSetType.equ) continue;
            paramsInput.push(bud);
        }
        let budsEditing = new BudsEditing(paramsInput);
        /*
        let { budEditings } = divStore;
        for (let i = 0; i < length; i++) {
            let param = params[i];
            let budEditing = budEditings[i];
            const { required } = budEditing;
            const { caption, name, id } = param;
            const readOnly = false;
            function onBudChanged() {

            }
            viewParams.push(<LabelBox key={id} label={caption ?? name} required={required} className="mb-2">
                <EditBudInline budEditing={budEditing} id={id} value={undefined} onChanged={onBudChanged} readOnly={readOnly} />
            </LabelBox>);
        }
        */
        return <div className={'border-bottom border-primary py-2 tonwa-bg-gray-2 ' + theme.bootstrapContainer}>
            <RowCols>
                {budsEditing.buildEditBuds()/*viewParams*/}
                <div className="d-flex align-items-end mb-2">
                    <button className="btn btn-outline-primary" onClick={() => alert('正在实现中...')}>
                        <FA name="search" /> 查询
                    </button>
                </div>
            </RowCols>
        </div>
    }

    return <Page header={caption} footer={footer}>
        <ViewSteps sheetSteps={steps} />
        <ViewParams />
        <div className="bg-white">
            <List items={pendRows}
                ViewItem={ViewItemPendRow} className=""
                onItemSelect={onItemSelectFunc}
                sep={<Sep sep={2} />}
                none={<div className="p-3 small text-secondary tonwa-bg-gray-2 border-bottom">
                    <FA name="times-circle" className="me-3 text-danger" size="lg" />
                    无内容
                </div>} />
        </div>
    </Page>;
}
