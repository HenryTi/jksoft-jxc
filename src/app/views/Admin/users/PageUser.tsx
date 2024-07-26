import { ReturnGetUsers$page } from "uqs/UqDefault";
import { UsersStore } from "./UsersStore";
import { Image, Page, useModal } from "tonwa-app";
import { FA, getAtomValue, setAtomValue, theme } from "tonwa-com";
import { BizBud, Entity, EnumBudType } from "app/Biz";
import { ValuesBudsEditing, LabelRowEdit, ViewBud } from "app/hooks";
import { Band, FormRow, FormRowsView } from "app/coms";
import { useForm } from "react-hook-form";
import { ViewUser } from "./ViewUser";
import { ChangeEvent } from "react";
import { useAtomValue } from "jotai";

export function PageUser({ user, usersStore }: { user: ReturnGetUsers$page; usersStore: UsersStore; }) {
    const modal = useModal();
    const { uqApp: { biz }, atomUserBuds } = usersStore;
    const { entityWithUser } = biz;
    const { assigned, tuName, tuNick, tuIcon } = user;
    const userBuds = useAtomValue(atomUserBuds);
    let image: any;
    if (tuIcon !== undefined) image = <Image src={tuIcon} />;
    else {
        image = <FA name="user-o" size="2x" />;
    }
    const vConsoleCaption = <>
        <FAIcon name="hand-o-right" />
        <span className="text-success">全局</span>
    </>;
    async function onEdit(entity: Entity) {
        let ret = await modal.open(<PageEditUser user={user} entity={entity} usersStore={usersStore} userBudValues={userBuds} />);
        if (ret === undefined) return;
        let namedValues = ret[':user'];
        let budValues: { [bud: number]: (string | number)[]; } = { ...getAtomValue(atomUserBuds) };
        for (let bud of entity.user) {
            let { id, name } = bud;
            budValues[id] = namedValues[name.substring(':user.'.length)];
        }
        setAtomValue(atomUserBuds, budValues);
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
        <ViewEntityWithUser entity={biz.bizConsole} caption={vConsoleCaption} onEdit={onEdit} budValues={userBuds} />
        {
            entityWithUser.map(v => {
                const { caption, name } = v;
                const vCaption = <>
                    <FAIcon name="file-o" />
                    <span className="text-info">{caption ?? name}</span>
                </>;
                return <ViewEntityWithUser key={v.id} entity={v} caption={vCaption} onEdit={onEdit} budValues={userBuds} />;
            })
        }
    </Page>;
}

function FAIcon({ name }: { name: string; }) {
    return <FA name={name} fixWidth={true} className="me-3 fs-larger" />;
}

function ViewEntityWithUser({ entity, caption, onEdit, budValues }: {
    entity: Entity;
    caption: string | JSX.Element;
    onEdit: (entity: Entity) => void;
    budValues: { [bud: number]: (string | number)[]; };
}) {
    return <div className="border-bottom d-flex">
        <div className="flex-fill row row-cols-6 ps-3 py-2">
            <div>{caption}</div>
            {entity.user.map(v => {
                let { id } = v;
                return <ViewBud key={id} bud={v} value={budValues[id]} />;
            })}
        </div>
        <div className="px-3 py-2 cursor-pointer" onClick={() => onEdit(entity)}>
            <FA name="pencil" />
        </div>
    </div>
}

function PageEditUser({ user, usersStore, entity, userBudValues }: { user: ReturnGetUsers$page; usersStore: UsersStore; entity: Entity; userBudValues: { [bud: number]: (string | number)[]; }; }) {
    const modal = useModal();
    const { register, handleSubmit, setValue, setError, trigger, formState: { errors } } = useForm({ mode: 'onBlur' });
    const { bootstrapContainer } = theme;
    const { caption, name, user: userBuds, biz } = entity;
    const budsEditing = new ValuesBudsEditing(modal, biz, userBuds);
    budsEditing.initBudValues(userBudValues);
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
            const { type } = budDataType;
            let value: any = values[n];
            switch (typeof value) {
                case 'boolean':
                case 'number':
                case 'string': value = [value]; break;
            }
            return { bud: id, type, value, }
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
                <FormRowsView rows={forRows} register={register} errors={errors} context={undefined} />
            </form>
        </div>
    </Page>;
}
