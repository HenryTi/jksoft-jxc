import { useForm } from "react-hook-form";
import { Page } from "tonwa-app";
import { FormRowsView } from "app/coms";
import { useUqApp } from "app/UqApp";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { GenID } from "./GenID";
import { GenProps } from "app/tool";

export function PageIDNew({ Gen }: GenProps<GenID>) {
    const uqApp = useUqApp();
    const gen = uqApp.objectOf(Gen);
    const { caption, actSave, labelClassName } = gen;
    const navigate = useNavigate();
    const { data: { no, formRows } } = useQuery('PageIDNew', async () => {
        let ret = await gen.buildNew();
        return ret;
    }, { cacheTime: 100, refetchOnWindowFocus: false });
    const { register, handleSubmit, formState: { errors }, } = useForm({ mode: 'onBlur' });
    async function onSubmit(data: any) {
        let ret = await actSave(no, data);
        alert(JSON.stringify(ret));
        navigate(-1);
    }

    return <Page header={`新建${caption}`}>
        <form onSubmit={handleSubmit(onSubmit)} className="container my-3 pe-5">
            <FormRowsView rows={formRows} {...{ labelClassName, register, errors }} />
        </form>
    </Page>;
}
