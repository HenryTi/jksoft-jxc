import { BinDiv } from "app/Biz";
import { DivEditProps, DivEditing, DivStore, UseInputsProps, ValDiv } from "../store";
import { NamedResults } from "../NamedResults";
import { getAtomValue } from "tonwa-com";
import { ValRow } from "../tool";
import { UqApp } from "app";
import { Modal, Page } from "tonwa-app";
import { FormRowsView } from "app/coms";
import { useForm } from "react-hook-form";

export interface InputDivProps extends UseInputsProps {
    uqApp: UqApp;
    modal: Modal;
}

export async function inputDiv(props: InputDivProps): Promise<ValRow> {
    const { modal, binStore, binDiv, valDiv, namedResults } = props;
    let valRow: ValRow;
    let retValRow: ValRow = {} as any;
    if (valDiv !== undefined) {
        let { atomValRow } = valDiv;
        valRow = getAtomValue(atomValRow);
        const { id, pend, origin } = valRow;
        Object.assign(retValRow, {
            id,
            pend,
            origin,
        });
    }
    let divEditing = new DivEditing(binStore.entityBin, binDiv, valRow, namedResults);
    console.log('divEditing.results', divEditing.results);
    if (divEditing.isInputNeeded() === true) {
        await modal.open(<PageInput divEditing={divEditing} />);
    }
    return retValRow;
}

function PageInput({ divEditing }: { divEditing: DivEditing; }) {
    const { register, handleSubmit, formState: { errors } } = useForm({ mode: 'onBlur' });
    let formRows = divEditing.buildFormRows();
    function onSubmitForm(data: any) {
        alert(JSON.stringify(data));
    }
    return <Page header={'try'}>
        <form className="container" onSubmit={handleSubmit(onSubmitForm)}>
            <FormRowsView rows={formRows} register={register} errors={errors} />
        </form>
    </Page>
}