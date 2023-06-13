import { useUqApp } from "app/UqApp";
import { FormRow, FormRowsView } from "app/coms";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Page, PageSpinner, useModal } from "tonwa-app";
import { List, useEffectOnce } from "tonwa-com";
import { Query, UqMan } from "tonwa-uq";

export function PageSitesAdmin() {
    const uqApp = useUqApp();
    const { openModal, closeModal } = useModal();
    const right = <button className="btn btn-sm btn-success me-1" onClick={onAdd}>新增</button>;
    const [list, setList] = useState<any[]>(undefined);
    useEffectOnce(() => {
        (async function () {
            let query: Query = ((uqApp.uq.$ as any).$_uqMan as UqMan).entities['$sites'] as any;
            let result = await query.page({}, undefined, 100);
            setList(result.$page);
        })();
    });
    if (list === undefined) {
        return <PageSpinner />;
    }
    function ViewSite({ value }: { value: any }) {
        let { id, no, ex } = value;
        let content = ex ? <>{ex} <small className="text-muted">{no}</small></> : <span className="text-primary">默认机构</span>;
        return <div className="px-3 py-2">
            {content}
        </div>;
    }
    return <Page header="机构管理" right={right}>
        <List items={list} ViewItem={ViewSite} />
    </Page>;

    function onAdd() {
        openModal(<PageAdd />)
    }

    function PageAdd() {
        const [no, setNo] = useState<string>(undefined);
        useEffectOnce(() => {
            (async function () {
                let n = await uqApp.uq.IDNO({ ID: '$site' as any });
                setNo(n);
            })();
        });
        const { register, handleSubmit, formState: { errors }, } = useForm({ mode: 'onBlur' });
        async function onSubmit(data: any) {
            let site = { id: undefined as number, no, ex: data.ex };
            let ret = await uqApp.uq.ActID({ ID: '$site' as any, value: site });
            site.id = ret;
            setList([site, ...list]);
            closeModal();
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
        return <Page header="新增机构">
            <form onSubmit={handleSubmit(onSubmit)} className="container my-3 pe-5">
                <FormRowsView rows={formRows} {...{ register, errors }} />
            </form>
        </Page>;
    }
}
