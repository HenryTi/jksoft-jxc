import { BizBud, PickParam, ValueSetType } from "app/Biz";
import { Page, useModal } from "tonwa-app";
import { theme } from "tonwa-com";
import { Band, FormRow, FormRowsView } from "app/coms";
import { BudsEditing, ValuesBudsEditing, ViewBud } from "app/hooks";
import { useForm } from "react-hook-form";

interface Props {
    editing: BudsEditing;
    header: string;
    // namedResults: NamedResults;
    queryParams: BizBud[];
    pickParams: PickParam[];
}
/*
export function usePageParams() {
    const modal = useModal();
    const uqApp = useUqApp();
    return useCallback(async (props: Props) => {
        const { editing, header, queryParams, pickParams } = props;
        const { namedResults } = editing
        const valueParams: [PickParam, BizBud, any][] = [];
        const inputParams: BizBud[] = [];
        for (let param of queryParams) {
            let { name, budDataType } = param;
            let pickParam = pickParams?.find(v => v.name === name);
            if (pickParam !== undefined) {
                let { bud, prop, valueSet, valueSetType } = pickParam;
                if (bud === undefined) debugger;
                let namedResult = namedResults[bud] as NamedResults;
                if (namedResult === undefined) debugger;
                if (prop === undefined) prop = 'id';
                let v = namedResult[prop];
                valueParams.push([pickParam, param, v]);
            }
            else if (budDataType !== undefined && budDataType.type !== 0 && name !== undefined) {
                inputParams.push(param);
            }
        }
        if (inputParams.length === 0) {
            let retParam: any = {};
            for (let [pickParam, bizBud, value] of valueParams) {
                retParam[pickParam.name] = value;
            }
            return retParam;
        }
        let paramBudsEditing = new ValuesBudsEditing(modal, uqApp.biz, inputParams);
        return await modal.open(<PageParams header={header}
            valueParams={valueParams}
            inputParams={paramBudsEditing} />);
    }, []);
}
*/
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
        /*
        let retParam : any = {};
        for (let [pickParam, bizBud, value] of valueParams) {
            retParam[pickParam.name] = value;
        }
        */
        let retParam = stripParams(undefined, valueParams);
        return retParam;
    }
    const { modal, biz } = editing;
    let paramBudsEditing = new ValuesBudsEditing(modal, biz, inputParams);
    return await modal.open(<PageParams header={header}
        valueParams={valueParams}
        inputParams={paramBudsEditing} />);
}

function stripParams(initData: any, valueParams: [PickParam, BizBud, any][]) {
    let retParam: any = initData === undefined ? {} : { ...initData };
    for (let [pickParam, bizBud, value] of valueParams) {
        if (typeof value === 'object') value = value.id;
        retParam[pickParam.name] = value;
    }
    return retParam;
}

interface PageParamsProps {
    header: string;
    valueParams: [PickParam, BizBud, any][];
    inputParams: ValuesBudsEditing;
}
function PageParams({ header, valueParams, inputParams }: PageParamsProps) {
    const modal = useModal();
    const { register, handleSubmit, formState: { errors } } = useForm({ mode: 'onBlur' });
    let formRows: FormRow[] = [
        ...inputParams.buildFormRows(),
        { type: 'submit', label: '查找', options: {}, className: undefined }
    ];
    function onSubmitForm(data: any) {
        let ret = stripParams(data, valueParams);
        /*
        let ret = { ...data };
        for (let [pickParam, , value] of valueParams) {
            ret[pickParam.name] = value;
        }
        */
        modal.close(ret);
    }
    return <Page header={header}>
        {valueParams.map((v, index) => {
            const [pickParam, bizBud, value] = v;
            const { name } = pickParam
            return <Band key={index} label={name} className="px-3 py-2">
                <ViewBud bud={bizBud} value={value} noLabel={true} />
            </Band>
        })}
        <form className={theme.bootstrapContainer + ' my-3 '} onSubmit={handleSubmit(onSubmitForm)}>
            <FormRowsView rows={formRows} register={register} errors={errors} context={inputParams} />
        </form>
    </Page>;
}
