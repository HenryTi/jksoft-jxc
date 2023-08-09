import { useForm } from "react-hook-form";
import { Page, useModal } from "tonwa-app";
import { FormRow, FormRowsView } from "app/coms";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { OptionsUseBizAtom, useBizAtom } from "./useBizAtom";
import { useEffectOnce } from "tonwa-com";
import { EntityAtom } from "app/Biz";
import { useState } from "react";
import { Atom } from "uqs/UqDefault";

interface OptionsNew {
}

export function useBizAtomNew(options: OptionsUseBizAtom & OptionsNew) {
    const gen = useBizAtom(options);
    const { uqApp, pathView } = gen;
    const { uq } = uqApp;
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
    const { caption } = entity;
    return {
        page: <PageNew />,
        view: <ViewNew />,
        modal: <ModalNew />,
    };

    function PageNew() {
        return <Page header={`新建${caption}`}>
            <ViewNew />
        </Page>;
    }

    function ViewNew() {
        const navigate = useNavigate();
        function afterSubmit(atom: Atom) {
            navigate(`../${pathView}/${atom.id}`, { replace: true });
        }
        return <ViewNewBase afterSubmit={afterSubmit} />;
    }

    function ModalNew() {
        const { closeModal } = useModal();
        function afterSubmit(atom: Atom) {
            closeModal(atom);
        }
        return <Page header={`新建${caption}`}>
            <ViewNewBase afterSubmit={afterSubmit} />
        </Page>;
    }

    function ViewNewBase({ afterSubmit }: { afterSubmit: (atom: Atom) => void; }) {
        async function actSave(entityAtom: EntityAtom, no: string, data: any) {
            const { ex } = data;
            let ret = await uq.SaveAtom.submit({ atom: entityAtom.phrase, no, ex });
            return ret;
        }
        async function buildNew(): Promise<{ no: string; formRows: FormRow[] }> {
            let retNo = await uq.IDNO({ ID: uq.Atom });
            return {
                no: retNo,
                formRows: [
                    {
                        name: 'no',
                        label: NOLabel,
                        type: 'text',
                        options: { maxLength: 20, disabled: true, value: retNo }
                    },
                    { name: 'ex', label: exLabel, type: 'text', options: { maxLength: 50 } },
                    { type: 'submit', label: '下一步' },
                ],
            };
        }

        const { data: { no, formRows } } = useQuery('PageAtomNew', async () => {
            let ret = await buildNew();
            return ret;
        }, { cacheTime: 100, refetchOnWindowFocus: false });
        const { register, handleSubmit, formState: { errors }, } = useForm({ mode: 'onBlur' });
        async function onSubmit(data: any) {
            let ret = await actSave(entity, no, data);
            afterSubmit?.({ ...data, ...ret });
        }
        return <form onSubmit={handleSubmit(onSubmit)} className="container my-3 pe-5">
            <FormRowsView rows={formRows} {...{ register, errors }} />
        </form>;
    }
}