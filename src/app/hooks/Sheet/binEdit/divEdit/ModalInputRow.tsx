import { Page, useModal } from "tonwa-app";
import { theme } from "tonwa-com";
import { Band } from "app/coms";
import { ViewSpecNoAtom } from "app/hooks/View";
import { ButtonAsync, FA } from "tonwa-com";
import { BizBud } from "app/Biz";
import { BinBudsEditing, ValDivBase } from "../../store";
import { RowCols, ViewShowBuds } from "app/hooks/tool";
import { ViewId } from "../../views";
import { FormBudsEditing } from "../../../View";

export function ModalInputRow({ binEditing, valDiv }: { binEditing: BinBudsEditing; valDiv: ValDivBase }) {
    const modal = useModal();
    // const { register, handleSubmit, setValue, setError, trigger, formState: { errors } } = useForm({ mode: 'onBlur' });
    const { entityBin, values: binDetail, sheetStore } = binEditing;
    const { caption, i: budI, iBase: budIBase, x: budX, xBase: budXBase } = entityBin;
    /*
    const submitable = useAtomValue(binEditing.atomSubmitable);
    async function onChange(evt: ChangeEvent<HTMLInputElement>) {
        const { type, value: valueInputText, name } = evt.target;
        binEditing.onChange(name, type as 'number' | 'text', valueInputText, (bud, value) => {
            if (bud.valueSetType === ValueSetType.equ) {
                setValue(bud.name, value);
            }
        });
        binEditing.triggerSubmitable();
        // setSubmitable(binEditing.submitable);
    }
    const options = { onChange };
    const formRows = binEditing.buildFormRows(true);
    formRows.forEach(v => {
        if (v === undefined) return null;
        return (v as any).options = { ...(v as any).options, ...options };
    });
    formRows.push({ type: 'submit', label: '提交', options: { disabled: submitable === false } });

    async function onSubmit(data: any) {
        if (await trigger(undefined, { shouldFocus: true }) === false) return;
        if (data.value === 0) {
            setError('value', { message: '不能为 0' });
            return;
        }
        modal.close(true);
    }
    */
    async function onSubmit(data: any) {
        modal.close(true);
    }
    function validate(data: any): [string, string][] {
        let ret: [string, string][] = [];
        if (data.value === 0) {
            // setError('value', { message: '不能为 0' });
            ret.push(['value', '不能为 0']);
        }
        return ret;
    }
    async function onDel() {
        await binEditing.onDel();
        modal.close();
    }
    let right: any;
    if (binEditing.onDel !== undefined) {
        right = <ButtonAsync onClick={onDel} className="btn btn-sm btn-primary me-1">
            <FA name="trash" fixWidth={true} />
        </ButtonAsync>;
    }
    function ViewIdField({ bud, budBase, value, base }: { bud: BizBud; budBase: BizBud; value: number; base: number; }) {
        if (bud === undefined) return null;
        const { caption } = bud;
        let id = base ?? value;
        /*
        <ViewSpecBaseOnly id={value} bold={true} />
        <ViewAtomTitles bud={budBase ?? bud} id={id} store={sheetStore} />
        */
        return <Band label={caption} className="border-bottom py-2">
            <ViewId id={value} store={sheetStore} />
            <RowCols>
                <ViewSpecNoAtom id={value} />
            </RowCols>
            <RowCols>
                <ViewShowBuds bud={bud} id={id} noLabel={false} store={sheetStore} />
            </RowCols>
        </Band>;
    }

    let viewShowBuds: any;
    /* 暂时不显示 showBuds
    let showBuds = binEditing.buildShowBuds();
    if (showBuds.length > 0) {
        viewShowBuds = <Band className="mt-2">
            <RowCols contentClassName="flex-fill">
                {showBuds}
            </RowCols>
        </Band>
    }
    */

    return <Page header={caption} right={right}>
        <div className={' py-1 tonwa-bg-gray-2 mb-3 ' + theme.bootstrapContainer}>
            <ViewIdField bud={budI} budBase={budIBase} value={binDetail.i} base={valDiv?.iBase} />
            <ViewIdField bud={budX} budBase={budXBase} value={binDetail.x} base={valDiv?.xBase} />
            {viewShowBuds}
        </div>
        <FormBudsEditing className={theme.bootstrapContainer}
            budsEditing={binEditing}
            onSubmit={onSubmit}
            validate={validate} />
    </Page >;
    /*
    <form className={theme.bootstrapContainer} onSubmit={handleSubmit(onSubmit)}>
        <FormRowsView rows={formRows} register={register} errors={errors} context={binEditing} />
    </form>
    */
}
