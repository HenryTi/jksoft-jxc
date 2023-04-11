import { useForm } from "react-hook-form";
import { Page } from "tonwa-app";
import { FormRowsView } from "app/coms";
import { useUqApp } from "app/UqApp";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { GenAtom } from "./GenAtom";
import { GenProps } from "app/tool";

export function PageAtomNew({ Gen }: GenProps<GenAtom>) {
    const uqApp = useUqApp();
    const { genAtomNew, genAtomView } = uqApp.objectOf(Gen);
    const { caption, actSave } = genAtomNew;
    const navigate = useNavigate();
    const { data: { no, formRows } } = useQuery('PageAtomNew', async () => {
        let ret = await genAtomNew.buildNew();
        return ret;
    }, { cacheTime: 100, refetchOnWindowFocus: false });
    const { register, handleSubmit, formState: { errors }, } = useForm({ mode: 'onBlur' });
    async function onSubmit(data: any) {
        let ret = await actSave(no, data);
        navigate(`../${genAtomView.path}/${ret.id}`, { replace: true });
    }

    return <Page header={`新建${caption}`}>
        <form onSubmit={handleSubmit(onSubmit)} className="container my-3 pe-5">
            <FormRowsView rows={formRows} {...{ register, errors }} />
        </form>
    </Page>;
}
