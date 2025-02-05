import { Page, useModal } from "tonwa-app";
import { FA, theme } from "tonwa-com";
// import { Band, FormRow, FormRowsView } from "app/coms";
// import { BudEditing, BudsEditing, EditBudInline, FormBudsStore, LabelRowEdit, ValuesBudsEditing, ViewBud } from "app/hooks";
import { useForm } from "react-hook-form";
import { BinPick, BizBud, EntityQuery, EnumBudType, PickParam, PickQuery, ValueSetType } from "../../Biz";
// import { LabelBox, RowColsSm } from "../tool";
// import { InlineEdit } from "../Bud/Edit/InlineEdit";
import { useRef } from "react";
import { FormBudsStore, ValuesBudsEditing } from "../../Control/ControlBuds/BinEditing";
import { LabelBox, RowColsSm, ViewBud } from "../../View";
// import { FormBudsStore, ValuesBudsEditing } from "app/Store";

/*
interface Props {
    editing: BudsEditing;
    header: string;
    // namedResults: NamedResults;
    queryParams: BizBud[];
    pickParams: PickParam[];
}

export async function pickQueryParams(props: Props) {
    const { editing, header, queryParams, pickParams } = props;
    if (pickParams !== undefined) {
        for (let pickParam of pickParams) {
            editing.addFormula(pickParam.name, pickParam.valueSet, pickParam.valueSetType === ValueSetType.init);
        }
    }
    const { valueSpace } = editing;
    const valueParams: [PickParam, BizBud, any][] = [];
    const inputParams: BizBud[] = [];
    for (let param of queryParams) {
        let { name, budDataType } = param;
        let pickParam = pickParams?.find(v => v.name === name);
        if (pickParam !== undefined) {
            // let { bud, prop } = pickParam;
            // if (bud === undefined) debugger;
            // let namedResult = valueSpace.getValue(bud); // namedResults[bud]; // as NamedResults;
            // if (namedResult === undefined) {
            //     debugger;
            //     valueSpace.getValue(bud);
            // }
            // if (prop === undefined) prop = 'id';
            // let v = (namedResult as any)[prop];
            let v = editing.getValue(name);
            valueParams.push([pickParam, param, v]);
        }
        else if (budDataType !== undefined && budDataType.type !== 0 && name !== undefined) {
            inputParams.push(param);
        }
    }
    if (inputParams.length === 0) {
        let retParam = stripParams(undefined, valueParams);
        return retParam;
    }
    const { modal, biz } = editing;
    let paramBudsEditing = new ValuesBudsEditing(modal, biz, inputParams);
    return await modal.open(<PageParams header={header}
        valueParams={valueParams}
        inputParams={paramBudsEditing} />);
}
*/

function stripParams(initData: any, valueParams: [PickParam, BizBud, any][]) {
    let retParam: any = initData === undefined ? {} : { ...initData };
    for (let [pickParam, bizBud, value] of valueParams) {
        if (typeof value === 'object') value = value.id;
        retParam[pickParam.name] = value;
    }
    return retParam;
}
/*
interface PageParamsProps {
    header: string;
    valueParams: [PickParam, BizBud, any][];
    inputParams: ValuesBudsEditing;
}
*/
export function ViewQueryParams({ query, editing, binPick, onSearch }: {
    query: EntityQuery;
    binPick: BinPick;
    editing: FormBudsStore; // BudsEditing;
    onSearch: (params: any) => Promise<void>;
}) {
    const modal = useModal();
    const { params: queryParams } = query;
    const { biz } = query;
    const { store } = editing;
    const valueParams: [PickParam, BizBud, any][] = [];
    const inputParams: BizBud[] = [];
    let noIdDefined = false;
    if (binPick !== undefined) {
        const { pickParams } = binPick;
        if (editing !== undefined && pickParams !== undefined) {
            for (let pickParam of pickParams) {
                editing.addFormula(pickParam.name, pickParam.valueSet, pickParam.valueSetType === ValueSetType.init);
            }
        }
        for (let param of queryParams) {
            let { name, budDataType } = param;
            let pickParam = pickParams?.find(v => v.name === name);
            if (pickParam !== undefined && editing !== undefined) {
                let v = editing.getValue(name);
                valueParams.push([pickParam, param, v]);
            }
            else if (budDataType !== undefined && budDataType.type !== 0 && name !== undefined) {
                inputParams.push(param);
            }
        }
    }
    else {
        for (let param of queryParams) {
            let { name, budDataType } = param;
            if (budDataType !== undefined && budDataType.type !== 0 && name !== undefined) {
                inputParams.push(param);
            }
        }
    }
    for (let param of inputParams) {
        const { budDataType } = param;
        if (budDataType === undefined) continue;
        if (budDataType.type !== EnumBudType.atom) continue;
        if ((budDataType as any).entityID !== undefined) continue;
        noIdDefined = true;
    }
    let { current: paramBudsEditing } = useRef(new FormBudsStore(modal, new ValuesBudsEditing(biz, inputParams)));
    const { handleSubmit } = useForm({ mode: 'onBlur' });
    async function onSubmitForm(data: any) {
        let values = await paramBudsEditing.getBudsNameValues();
        let ret = stripParams(values, valueParams);
        onSearch(ret);
    }
    return <form className={theme.bootstrapContainer + ' py-3 border-bottom'} onSubmit={handleSubmit(onSubmitForm)}>
        <RowColsSm>
            {valueParams.map((v, index) => {
                const [pickParam, bizBud, value] = v;
                return <LabelBox key={bizBud.id} label={pickParam.name} className="mb-2">
                    <ViewBud bud={bizBud} value={value} noLabel={true} store={store} />
                </LabelBox>;
            })}
            {paramBudsEditing.buildEditBuds()}
            <div className="d-flex align-items-end">
                <button type="submit" className="btn btn-primary mb-2" disabled={noIdDefined}>
                    <FA name="search" className="me-1" />
                    查找
                </button>
            </div>
        </RowColsSm>
    </form>;
}
