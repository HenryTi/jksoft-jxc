import { Page, useModal } from "tonwa-app";
import { theme } from "tonwa-com";
import { Band } from "app/coms";
import { ViewForkAtomBold } from "app/hooks/View";
import { ButtonAsync, FA } from "tonwa-com";
import { BinBudsEditing, FormBudsStore, ValDivBase } from "../../../../Store";
import { RowCols, ViewAtomTitles, ViewShowBuds } from "app/hooks/tool";
import { FormBudsEditing } from "../../../View";

export function ModalInputRow({ binEditing, valDiv }: { binEditing: BinBudsEditing; valDiv: ValDivBase }) {
    const modal = useModal();
    const { entityBin, values: binDetail, sheetStore } = binEditing;
    const { caption } = entityBin;
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
    function ViewIdField({ value, base }: { value: number; base: number; }) {
        let id: number = base ?? value;
        if (id === undefined) return null;
        if (id === null) return null;
        const cn = 'border-bottom py-2';
        let entity = sheetStore.entityFromId(id);
        if (entity === undefined) {
            return <Band label={'?'} className={cn}>
                {id} 未知entity
            </Band>
        }
        return <Band label={entity.caption} className={cn}>
            <div className="mb-1">
                <ViewForkAtomBold id={value} store={sheetStore} />
                <ViewAtomTitles id={value} store={sheetStore} />
            </div>
            <RowCols>
                <ViewShowBuds bud={undefined} id={id} noLabel={false} store={sheetStore} />
            </RowCols>
        </Band>;
    }

    const formBudsStore = new FormBudsStore(modal, binEditing);
    return <Page header={caption} right={right}>
        <div className={' py-1 tonwa-bg-gray-2 mb-3 ' + theme.bootstrapContainer}>
            <ViewIdField value={binDetail.i} base={valDiv?.iBase} />
            <ViewIdField value={binDetail.x} base={valDiv?.xBase} />
        </div>
        <FormBudsEditing className={theme.bootstrapContainer}
            formBudsStore={formBudsStore}
            onSubmit={onSubmit}
            submit="确认明细"
            validate={validate} />
    </Page >;
}
