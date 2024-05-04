import { ReturnGetUsers$page } from "uqs/UqDefault";
import { UsersStore } from "./UsersStore";
import { Image, Page, useModal } from "tonwa-app";
import { FA, theme } from "tonwa-com";
import { BizBud, Entity } from "app/Biz";
import { BudsEditing, LabelRowEdit } from "app/hooks";
import { Band, FormRow, FormRowsView } from "app/coms";
import { useForm } from "react-hook-form";
import { ViewUser } from "./ViewUser";
import { ChangeEvent } from "react";

export function PageUser({ user, usersStore }: { user: ReturnGetUsers$page; usersStore: UsersStore; }) {
    const modal = useModal();
    const { uqApp: { biz } } = usersStore;
    const { entityWithUser } = biz;
    const { assigned, tuName, tuNick, tuIcon } = user;
    let image: any;
    if (tuIcon !== undefined) image = <Image src={tuIcon} />;
    else {
        image = <FA name="user-o" size="2x" />;
    }
    const vConsoleCaption = <>
        <FAIcon name="hand-o-right" />
        <span className="text-success">全局</span>
    </>;
    function onEdit(entity: Entity) {
        modal.open(<PageEditUser user={user} entity={entity} usersStore={usersStore} />)
    }
    return <Page header="用户设置">
        <div className="d-flex px-3 py-2 align-items-center tonwa-bg-gray-2 border-bottom border-primary">
            <div className="me-3 w-2-5c h-2-5c d-flex align-items-center justify-content-center align-self-start">{image}</div>
            <div className="flex-fill">
                <div>
                    {assigned ?? tuNick}
                </div>
                <div className="text-body-tertiary small">
                    {tuName}
                </div>
            </div>
        </div>
        <ViewEntityWithUser entity={biz.bizConsole} caption={vConsoleCaption} onEdit={onEdit} />
        {
            entityWithUser.map(v => {
                const { caption, name } = v;
                const vCaption = <>
                    <FAIcon name="file-o" />
                    <span className="text-info">{caption ?? name}</span>
                </>;
                return <ViewEntityWithUser key={v.id} entity={v} caption={vCaption} onEdit={onEdit} />;
            })
        }
    </Page>;
}

function FAIcon({ name }: { name: string; }) {
    return <FA name={name} fixWidth={true} className="me-3 fs-larger" />;
}

function ViewEntityWithUser({ entity, caption, onEdit }: { entity: Entity; caption: string | JSX.Element; onEdit: (entity: Entity) => void; }) {
    return <div className="border-bottom px-3 py-2 d-flex cursor-pointer" onClick={() => onEdit(entity)}>
        {caption}
        <div className="flex-fill" />
        <div>
            <FA name="pencil" />
        </div>
    </div>
}

function PageEditUser({ user, usersStore, entity }: { user: ReturnGetUsers$page; usersStore: UsersStore; entity: Entity; }) {
    const modal = useModal();
    const { register, handleSubmit, setValue, setError, trigger, formState: { errors } } = useForm({ mode: 'onBlur' });
    const { bootstrapContainer } = theme;
    const { caption, name, user: userBuds } = entity;
    const budsEditing = new BudsEditing(userBuds);
    const inputRows = budsEditing.buildFormRows();
    async function onChange(evt: ChangeEvent<HTMLInputElement>) {
        const { type, value: valueInputText, name } = evt.target;
        setValue(name, valueInputText);
    }
    const options = { onChange };
    inputRows.forEach(v => {
        return (v as any).options = { ...(v as any).options, ...options };
    });
    let forRows: FormRow[] = [
        ...inputRows,
        { type: 'submit', label: '提交', options: {}, className: "btn btn-primary" }
    ];
    const onSubmitForm = async (data: any) => {
        let userPrefix = ':user';
        let values = data[userPrefix];
        let arr = userBuds.map(v => {
            const { id, name, budDataType } = v;
            let n = name.substring(userPrefix.length + 1);
            return {
                bud: id,
                type: budDataType.type,
                value: values[n],
            }
        });
        await usersStore.saveUserBuds(user.userSite, arr);
        modal.close(data);
    }
    return <Page header={'编辑 - ' + (caption ?? name)}>
        <div className={bootstrapContainer} >
            <Band className="p-3 border-bottom border-primary">
                <div className="d-flex">
                    <ViewUser user={user} />
                </div>
            </Band>
        </div>
        <div className="m-3">
            <form className={bootstrapContainer} onSubmit={handleSubmit(onSubmitForm)}>
                <FormRowsView rows={forRows} register={register} errors={errors} />
            </form>
        </div>
    </Page>;
}
