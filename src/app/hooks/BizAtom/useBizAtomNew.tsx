import { useForm } from "react-hook-form";
import { Page, useModal } from "tonwa-app";
import { theme } from "tonwa-com";
import { FormRow, FormRowsView } from "app/coms";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { OptionsUseBizAtom, useBizAtom } from "./useBizAtom";
import { useEffectOnce } from "tonwa-com";
import { BizBud, EntityAtom, ValueSetType } from "app/Biz";
import { useState } from "react";
import { Atom } from "uqs/UqDefault";
// import { UseQueryOptions } from "app/tool";
import { BinBudsEditing } from "../Sheet/store";
import { BudsEditing, ValuesBudsEditing } from "../BudsEditing";
import { pathAtom } from "./AtomStore";

interface OptionsNew {
}

export function useBizAtomNew(options: OptionsUseBizAtom & OptionsNew) {
    const gen = useBizAtom(options);
    const { uqApp, pathView, saveBudValue } = gen;
    const { uq, biz } = uqApp;
    const { NOLabel, exLabel } = options;
    const [entity, setEntity] = useState<EntityAtom>(undefined);

    useEffectOnce(() => {
        (async () => {
            let ret = await gen.selectLeafAtom(undefined);
            setEntity(ret);
        })();
    });

    if (entity === undefined) {
        let viewNew = <div className="m-3">
            暂时没有内容，随后处理
        </div>;

        return {
            page: <Page header="新建">
                {viewNew}
            </Page>,
            view: viewNew,
        };
    }
    const { id: entityId, caption } = entity;
    return {
        page: <PageNew />,
        pageContent: <ViewNew />,
        modal: <ModalNew />,
        modalContent: <ModalViewNew />,
    };

    function PageNew() {
        return <Page header={`${caption} - 新建`}>
            <ViewNew />
        </Page>;
    }

    function ViewNew() {
        const navigate = useNavigate();
        function afterSubmit(atom: Atom) {
            navigate(`../${pathAtom.view(entityId, atom.id)}`, { replace: true });
        }
        return <ViewNewBase afterSubmit={afterSubmit} />;
    }

    function ModalViewNew() {
        const modal = useModal();
        function afterSubmit(atom: Atom) {
            modal.close(atom);
        }
        return <ViewNewBase afterSubmit={afterSubmit} />
    }

    function ModalNew() {
        return <Page header={`${caption} - 新建`}>
            <ModalViewNew />
        </Page>;
    }

    function ViewNewBase({ afterSubmit }: { afterSubmit: (atom: Atom) => void; }) {
        const modal = useModal();
        async function actSave(entityAtom: EntityAtom, no: string, data: any, budValues: [BizBud, number | string][]) {
            const { ex } = data;
            let ret = await uq.SaveAtom.submit({ phrase: entityAtom.id, no, ex });
            let promises = budValues.map(async ([bud, value]) => {
                await saveBudValue(ret, bud, value);
            });
            await Promise.all(promises);
            return ret;
        }
        async function buildNew(): Promise<{ no: string; formRows: FormRow[] }> {
            let retNo = await uq.IDNO({ ID: uq.Atom });
            return {
                no: retNo,
                formRows: [
                    {
                        name: 'no',
                        label: NOLabel ?? '编号',
                        type: 'text',
                        options: { maxLength: 20, disabled: true, value: retNo }
                    },
                    { name: 'ex', label: exLabel ?? '名称', type: 'text', options: { maxLength: 50 } },
                    { type: 'submit', label: '下一步' },
                ],
            };
        }

        const { data: { no, formRows } } = useQuery({
            queryKey: ['PageAtomNew'],
            queryFn: async () => {
                let ret = await buildNew();
                return ret;
            }
        }
            //    , UseQueryOptions
        );
        const { register, handleSubmit, formState: { errors }, } = useForm({ mode: 'onBlur' });
        async function onSubmit(data: any) {
            const { buds } = entity;
            let budsEditing = new ValuesBudsEditing(modal, biz, entity.buds);
            budsEditing.calcAll();
            let budValues: [BizBud, number | string][] = [];
            for (let bud of buds) {
                switch (bud.valueSetType) {
                    default:
                        continue;
                    case ValueSetType.equ:
                    case ValueSetType.init:
                        budValues.push([bud, budsEditing.getBudValue(bud)]);
                        break;
                }
            }
            let ret = await actSave(entity, no, data, budValues);
            afterSubmit?.({ ...data, ...ret, no });
        }
        return <form onSubmit={handleSubmit(onSubmit)} className={theme.bootstrapContainer + ' my-3 pe-5 '}>
            <FormRowsView rows={formRows} {...{ register, errors }} context={undefined} />
        </form>;
    }
}