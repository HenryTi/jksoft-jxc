import { BizBud, EntityQuery, PickParam, PickQuery, ValueSetType } from "app/Biz";
import { Page, useModal } from "tonwa-app";
import { FA, theme } from "tonwa-com";
import { Band, FormRow, FormRowsView } from "app/coms";
import { BudEditing, BudsEditing, EditBudInline, LabelRowEdit, ValuesBudsEditing, ViewBud } from "app/hooks";
import { useForm } from "react-hook-form";
import { LabelBox, RowColsSm } from "../tool";
import { InlineEdit } from "../Bud/Edit/InlineEdit";
import { useRef } from "react";

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
export function ViewQueryParams({ editing, query, binPick, onSearch }: {
    query: EntityQuery;
    binPick: PickQuery;
    editing: BudsEditing;
    onSearch: (params: any) => Promise<void>;
}) {
    const modal = useModal();
    const { params: queryParams } = query;
    const { pickParams } = binPick;
    const { biz } = editing;
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
        /*
        let retParam : any = {};
        for (let [pickParam, bizBud, value] of valueParams) {
            retParam[pickParam.name] = value;
        }
        */
        let retParam = stripParams(undefined, valueParams);
        return retParam;
    }
    let { current: paramBudsEditing } = useRef(new ValuesBudsEditing(modal, biz, inputParams));

    // { header, valueParams, inputParams }: PageParamsProps
    const { register, handleSubmit, formState: { errors } } = useForm({ mode: 'onBlur' });
    let formRows: FormRow[] = [
        ...paramBudsEditing.buildFormRows(),
        { type: 'submit', label: '查找', options: {}, className: undefined }
    ];
    function onSubmitForm(data: any) {
        let ret = stripParams(paramBudsEditing.getNamedValues(), valueParams);
        onSearch(ret);
    }
    // <FormRowsView rows={formRows} register={register} errors={errors} context={paramBudsEditing} />
    return <form className={theme.bootstrapContainer + ' py-3 border-bottom mb-3'} onSubmit={handleSubmit(onSubmitForm)}>
        <RowColsSm>
            {valueParams.map((v, index) => {
                const [pickParam, bizBud, value] = v;
                // const budEditing = new BudEditing(undefined, bizBud, false);
                // <EditBudInline budEditing={budEditing} id={0} value={value} onChanged={undefined} readOnly={false} options={{}} />
                // <ViewBud bud={bizBud} value={value} />
                return <LabelBox key={bizBud.id} label={pickParam.name} className="mb-2">
                    <ViewBud bud={bizBud} value={value} noLabel={true} />
                </LabelBox>;
                //                const { name } = pickParam;
                //    return <ViewBud bud={bizBud} value={value} />;
                // <Band key={index} label={} className="px-3 py-2">
                // </Band>
            })}
            {
                paramBudsEditing.buildEditBuds()
            }
            <div className="d-flex align-items-end">
                <button type="submit" className="btn btn-primary mb-2">
                    <FA name="search" className="me-1" />
                    查找
                </button>
            </div>
        </RowColsSm>
    </form>;
}
