import { DivEditing, ValDivBase, btnNext, cnNextClassName } from "../../store";
import { FA } from "tonwa-com";
import { Page, useModal } from "tonwa-app";
import { theme } from "tonwa-com";
import { Band, FormRowsView } from "app/coms";
import { useForm } from "react-hook-form";
import { ChangeEvent, useState } from "react";
import { ViewRowStem } from "../ViewDiv/ViewRowStem";
import { ViewRowLeaf } from "../ViewDiv/ViewRowLeaf";

export function PageInputDiv({ divEditing }: { divEditing: DivEditing; }) {
    const modal = useModal();
    const { divStore, valDiv } = divEditing;
    const { binDivRoot: binDiv } = divStore;
    const { register, setValue, handleSubmit, formState: { errors } } = useForm({ mode: 'onBlur' });
    const [submitable, setSubmitable] = useState(divEditing.submitable);
    let formRows = divEditing.buildFormRows();
    async function onChange(evt: ChangeEvent<HTMLInputElement>) {
        divEditing.stopInitFormula();
        const { type, value: valueInputText, name } = evt.target;
        divEditing.onChange(name, type as 'number' | 'text', valueInputText, (name, value) => {
            setValue(name, value);
        });
        setSubmitable(divEditing.submitable);
    }
    const options = { onChange };
    formRows.forEach(v => {
        if (v === undefined) return null;
        return (v as any).options = { ...(v as any).options, ...options };
    });
    function onPrev() {
        modal.close();
    }
    formRows.push({
        type: 'submit',
        label: btnNext,
        options: { disabled: submitable === false },
        className: cnNextClassName,
        right: <div className="align-self-center">
            <div className="cursor-pointer text-info p-2 small border border-info rounded-3" onClick={onPrev}>
                <FA name="arrow-left" className="me-2" />
                上一步
            </div>
        </div>
    });
    function onSubmitForm(data: any) {
        if (divEditing.submitable === false) {
            setSubmitable(divEditing.submitable);
            return;
        }
        modal.close(true);
    }
    function ViewRowContainer({ children, level }: { children: React.ReactNode; level: number; }) {
        return <div className={'d-flex border-bottom tonwa-bg-gray-' + level}>
            {children}
        </div>;
    }
    function ViewTop() {
        let parentValDivs: ValDivBase[] = [];
        for (let p = valDiv.parent; p !== undefined; p = p.parent) {
            parentValDivs.unshift(p);
        }
        let len = parentValDivs.length;
        let vContent = len === 0 ?
            <ViewRowContainer level={0}>
                <ViewRowLeaf divStore={divStore} valDiv={valDiv} readonly={true} />
            </ViewRowContainer>
            :
            parentValDivs.map((v, index) => {
                const { id } = v;
                return <ViewRowContainer key={id} level={(len - 1 - index)}>
                    <ViewRowStem divStore={divStore} valDiv={v} readonly={true} />
                </ViewRowContainer>;
            });
        return <div className={theme.bootstrapContainer}>
            <Band label={'明细'}>{vContent}</Band>
        </div>
    }
    return <Page header={binDiv.ui?.caption ?? '输入明细'}>
        <ViewTop />
        <form className={theme.bootstrapContainer} onSubmit={handleSubmit(onSubmitForm)}>
            <FormRowsView rows={formRows} register={register} errors={errors} setValue={setValue} context={divEditing} />
        </form>
    </Page>
}
