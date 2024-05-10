import { BizBud, PickParam } from "app/Biz";
import { NamedResults } from "../store";
import { Page, useModal } from "tonwa-app";
import { theme } from "tonwa-com";
import { Band, FormRow, FormRowsView } from "app/coms";
import { BudsEditing, ViewBud } from "app/hooks";
import { useForm } from "react-hook-form";
import { useCallback } from "react";

interface Props {
    header: string;
    namedResults: NamedResults;
    queryParams: BizBud[];
    pickParams: PickParam[];
}
export function usePageParams() {
    const modal = useModal();
    return useCallback(async (props: Props) => {
        const { header, namedResults, queryParams, pickParams } = props;
        const valueParams: [PickParam, BizBud, any][] = [];
        const inputParams: BizBud[] = [];
        for (let param of queryParams) {
            let { name, budDataType } = param;
            let pickParam = pickParams?.find(v => v.name === name);
            if (pickParam !== undefined) {
                let { /*bud, prop*/ valueSet, valueSetType } = pickParam;
                debugger;
                /*
                let namedResult = namedResults[bud] as NamedResults;
                if (namedResult === undefined) debugger;
                if (prop === undefined) prop = 'id';
                let v = namedResult[prop];
                valueParams.push([pickParam, param, v]);
                */
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
        let paramBudsEditing = new BudsEditing(inputParams);
        return await modal.open(<PageParams header={header}
            valueParams={valueParams}
            inputParams={paramBudsEditing} />);
    }, []);
}


interface PageParamsProps {
    header: string;
    valueParams: [PickParam, BizBud, any][];
    inputParams: BudsEditing;
}
function PageParams({ header, valueParams, inputParams }: PageParamsProps) {
    const modal = useModal();
    const { register, handleSubmit, formState: { errors } } = useForm({ mode: 'onBlur' });
    let formRows: FormRow[] = [
        ...inputParams.buildFormRows(),
        // inputParams.map(v => budFormRow(v, false)),
        { type: 'submit', label: '查找', options: {}, className: undefined }
    ];
    function onSubmitForm(data: any) {
        let ret = { ...data };
        for (let [pickParam, , value] of valueParams) {
            ret[pickParam.name] = value;
        }
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
            <FormRowsView rows={formRows} register={register} errors={errors} />
        </form>
    </Page>;
}
