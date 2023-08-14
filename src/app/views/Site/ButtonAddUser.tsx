import { useForm } from "react-hook-form";
import { FA } from "tonwa-com";
import { User } from "tonwa-uq";
import { roleT } from "./res";
import { Page, SelectUser, ViewUser, useModal } from "tonwa-app";
import { Band, FormRow, FormRowsView } from "app/coms";
import { ChangeEvent, useState } from "react";

interface Props {
    onUserAdded: (userId: number, assigned: string) => Promise<void>;
}
export function ButtonAddUser({ onUserAdded }: Props) {
    let { openModal } = useModal();
    async function onAddUser() {
        let top = <div className="my-3">{roleT('searchUser')}</div>;
        let ret = await openModal<User>(<SelectUser header={roleT('user')} top={top} />);
        if (ret === undefined) return;
        let assigned = await openModal<string>(<PageInputAssigned user={ret} assigned={''} />);
        if (assigned.trim().length === 0) {
            assigned = undefined;
        }
        await onUserAdded(ret.id, assigned);
    }
    return <button className="btn btn-sm btn-link" onClick={onAddUser}><FA name="plus" className="me-1" />{roleT('new')}</button>
}

function PageInputAssigned({ user, assigned }: { user: User; assigned: string; }) {
    const { register, handleSubmit, formState: { errors } } = useForm({ mode: 'onBlur' });
    const { closeModal } = useModal();
    const [input, setInput] = useState(assigned);
    const formRows: FormRow[] = [
        { name: 'assigned', label: '备注名', type: 'string', options: { value: assigned, onChange } },
        { type: 'submit', label: '提交', options: { disabled: input === assigned } },
    ];
    function onChange(evt: ChangeEvent<HTMLInputElement>) {
        setInput(evt.currentTarget.value);
    }
    async function onSubmit(data: any) {
        closeModal(input);
    }
    return <Page header="用户">
        <div className="p-3">
            <form className="container" onSubmit={handleSubmit(onSubmit)}>
                <Band label={'用户'}>
                    <ViewUser user={user} />
                </Band>
                <FormRowsView rows={formRows} register={register} errors={errors} />
            </form>
        </div>
    </Page>
}
