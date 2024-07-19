import { useUqApp } from "app/UqApp";
import { FormRow, FormRowsView } from "app/coms";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Page, PageSpinner, SelectUser, useModal } from "tonwa-app";
import { List, useEffectOnce } from "tonwa-com";
import { Query, User } from "tonwa-uq";
import { roleT } from "../res";
import { Atom } from "uqs/UqDefault";

export function PageSites() {
    const uqApp = useUqApp();
    const { uq } = uqApp;
    const modal = useModal();
    const right = <button className="btn btn-sm btn-success me-1" onClick={onAdd}>新增</button>;
    const [list, setList] = useState<any[]>(undefined);
    useEffectOnce(() => {
        (async function () {
            const { uqMan } = uqApp;
            let query: Query = uqMan.entities['$sites'] as any;
            let result = await query.page({}, undefined, 100);
            setList(result.$page);
        })();
    });
    if (list === undefined) {
        return <PageSpinner />;
    }
    function ViewSite({ value }: { value: Atom }) {
        let { no, ex } = value;
        return <div className="d-flex">
            <small className="text-secondary me-5 w-8c">{no}</small>
            {ex ?? '(无名机构)'}</div>;
    }
    function ViewItemSite({ value }: { value: any }) {
        return <div className="px-3 py-2">
            <ViewSite value={value} />
        </div>;
    }
    return <Page header="机构管理" right={right}>
        <List items={list} ViewItem={ViewItemSite} />
    </Page>;

    async function onAdd() {
        let top = <div className="my-3">{roleT('searchUser')}</div>;
        let user = await modal.open<User>(<SelectUser header={roleT('user')} top={top} />);
        if (user === undefined) return;
        await modal.open(<PageAdd user={user} />)
    }

    function PageAdd({ user }: { user: User; }) {
        const { id, name, assigned, nick } = user;
        const [no, setNo] = useState<string>(undefined);
        useEffectOnce(() => {
            (async function () {
                let n = await uq.IDNO({ ID: '$site' as any });
                setNo(n);
            })();
        });
        const { register, handleSubmit, formState: { errors }, } = useForm({ mode: 'onBlur' });
        async function onSubmit(data: any) {
            const { ex } = data;
            let ret = await uq.CreateSiteForUser.submit({ no, ex, tonwaUser: user.id });
            let { site: siteId, userSite } = ret;
            let site = {
                id: siteId,
                no,
                ex,
            }
            setList([site, ...list]);
            modal.close();
        }
        if (no === undefined) {
            return <PageSpinner />;
        }
        const formRows: FormRow[] = [
            {
                name: 'no',
                label: '编号',
                type: 'text',
                options: { maxLength: 20, disabled: true, value: no }
            },
            { name: 'ex', label: '名称', type: 'text', options: { maxLength: 50 } },
            { type: 'submit', label: '提交' },
        ];
        let vUser: any;
        if (assigned !== undefined) {
            vUser = <div><b>{assigned}</b> {nick ?? name}</div>;
        }
        else if (nick !== undefined) {
            vUser = <div><b>{nick}</b> {name}</div>;
        }
        else {
            vUser = <div><b>{name}</b></div>;
        }
        return <Page header="新增机构">
            <div className="p-3 d-flex">
                <small className="me-3">机构拥有者</small>
                <div>
                    <div><b>{assigned ?? nick ?? name}</b> {name}</div>
                    <div className="small text-secondary">{id}</div>
                </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="container my-3 pe-5">
                <FormRowsView rows={formRows} {...{ register, errors }} context={undefined} />
            </form>
        </Page>;
    }
}
