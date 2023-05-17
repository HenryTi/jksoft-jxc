import { useForm } from "react-hook-form";
import { Page } from "tonwa-app";
import { FormRowsView } from "app/coms";
import { useUqApp } from "app/UqApp";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { GenAtom, GenAtomNew } from "./GenAtom";
import { GenProps } from "app/tool";
import { useEffectOnce } from "tonwa-com";
import { EntityAtom } from "app/Biz";
import { useState } from "react";

export function PageAtomNew({ Gen }: GenProps<GenAtom>) {
    const uqApp = useUqApp();
    const gen = uqApp.objectOf(Gen);
    const [entity, setEntity] = useState<EntityAtom>(undefined);

    useEffectOnce(() => {
        (async () => {
            let ret = await gen.selectLeafAtom(undefined);
            setEntity(ret);
        })();
    });

    if (entity === undefined) {
        return <Page header="新建商品">
            <div className="m-3">
                暂时没有内容，随后处理
            </div>
        </Page>;
    }
    return <PageAtomNewOfAtom genAtomNew={gen.genAtomNew} entityAtom={entity} />;
}

function PageAtomNewOfAtom({ genAtomNew, entityAtom }: { genAtomNew: GenAtomNew; entityAtom: EntityAtom; }) {
    const { caption } = entityAtom;
    const { actSave, genAtom } = genAtomNew;
    const { genAtomView } = genAtom;
    const navigate = useNavigate();
    const { data: { no, formRows } } = useQuery('PageAtomNew', async () => {
        let ret = await genAtomNew.buildNew();
        return ret;
    }, { cacheTime: 100, refetchOnWindowFocus: false });
    const { register, handleSubmit, formState: { errors }, } = useForm({ mode: 'onBlur' });
    async function onSubmit(data: any) {
        let ret = await actSave(entityAtom, no, data);
        navigate(`../${genAtomView.path}/${ret.id}`, { replace: true });
    }
    return <Page header={`新建${caption}`}>
        <form onSubmit={handleSubmit(onSubmit)} className="container my-3 pe-5">
            <FormRowsView rows={formRows} {...{ register, errors }} />
        </form>
    </Page>;
}
