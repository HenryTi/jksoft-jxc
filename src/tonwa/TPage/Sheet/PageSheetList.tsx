import { ChangeEvent, useRef, useState } from "react";
import { useModal } from "tonwa-app";
import { FA } from "tonwa-com";
import { TControlSheetList } from "./TControlSheetList";
import { FormBudsStore, ValuesBudsEditing } from "../../Control/ControlBuds/BinEditing";
import { LabelBox, RowCols } from "../../View";
import { ViewSheetItem } from "./ViewSheetItem";
import { PageQueryMore } from "../../View/Common/PageQueryMore";
import { PageSheetSearch } from "./PageSheetSearch";

export function PageSheetList({ control }: { control: TControlSheetList }) {
    // const { entitySheet, myArchiveList } = dashConsole;
    const { entity, myArchiveList } = control;
    const { biz, caption, id, main } = entity;
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
    const { current: budsEditing } = useRef(new FormBudsStore(modal, new ValuesBudsEditing(biz, primeBuds)));
    async function onSearch() {
        await modal.open(<PageSheetSearch control={control} />);
    }
    let right = <button className="btn btn-sm btn-success me-2" onClick={onSearch}>
        <FA name="search" />
    </button>;
    function ViewItem({ value }: { value: any; }) {
        return <ViewSheetItem value={value} control={control} />;
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
        let p = { /*...budsEditing.values,*/ no };
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
