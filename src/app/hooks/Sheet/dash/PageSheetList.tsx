import { PageQueryMore } from "app/coms";
import { useModal } from "tonwa-app";
import { FA } from "tonwa-com";
import { PageSheetSearch } from "./PageSheetSearch";
import { ViewSheetItem } from "./ViewSheetItem";
import { DashConsole } from "../store";
import { LabelBox, RowCols } from "app/hooks/tool";
import { BudsEditing, LabelRowEdit, ValuesBudsEditing, ViewBud } from "app/hooks";
import { ChangeEvent, useRef, useState } from "react";

export function PageSheetList({ dashConsole }: { dashConsole: DashConsole; }) {
    const { entitySheet, myArchiveList } = dashConsole;
    const { biz, caption, id, main } = entitySheet;
    const { primeBuds } = main;
    const modal = useModal();
    let to = new Date();
    to.setDate(to.getDate() + 2);
    let from = new Date();
    from.setDate(from.getDate() - 31);
    const initParam = {
        phrase: id,
        mainPhrase: main.id,
        from,
        to,
        timeZone: 8,
        no: undefined as string,
        budValues: {},
    }
    let { current: no } = useRef(undefined as string);
    const [param, setParam] = useState(initParam);
    const { current: budsEditing } = useRef(new ValuesBudsEditing(modal, biz, primeBuds));
    async function onSearch() {
        modal.open(<PageSheetSearch dashConsole={dashConsole} />);
    }
    let right = <button className="btn btn-sm btn-success me-2" onClick={onSearch}>
        <FA name="search" />
    </button>;
    function ViewItem({ value }: { value: any; }) {
        return <ViewSheetItem value={value} sheetConsole={dashConsole} listStore={dashConsole.myArchiveList} />;
    }
    function ViewPrimeBuds() {
        if (primeBuds === undefined) return null;
        return <>
            {budsEditing.buildEditBuds()}
        </>;
    }
    function onChange(e: ChangeEvent<HTMLInputElement>) {
        no = e.currentTarget.value;
    }
    function onSearchList() {
        let p = { ...budsEditing.values, no };
        alert('查询实现中，参数：' + JSON.stringify(p));
    }
    return <PageQueryMore
        header={(caption) + ' - 已归档'}
        right={right}
        query={myArchiveList.loadMyList}
        param={param}
        sortField="id"
        ViewItem={ViewItem}
        none={<div className="text-body=tertiary p-3">无单据</div>}
    >
        <div className="px-3 py-2 border-bottom tonwa-bg-gray-2">
            <RowCols>
                <LabelBox label="编号">
                    <div className="border rounded mb-2">
                        <input type="text" className="form-control py-1 border-0 "
                            placeholder="单据编号" onChange={onChange} />
                    </div>
                </LabelBox>
                <ViewPrimeBuds />
                <LabelBox label={<>&nbsp;</>}>
                    <button className="btn btn-primary" onClick={onSearchList}>搜索</button>
                </LabelBox>
            </RowCols>
        </div>
    </PageQueryMore>;
}
