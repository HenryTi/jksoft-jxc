import { useForm } from "react-hook-form";
import { Page } from "tonwa-app";
import { FormRowsView, FormRow } from "app/coms";
import { useUqApp } from "app/UqApp";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { PartID } from "./PartID";
import { PartProps } from "../Part";

/*
interface PageIDNewProps {
    header: string;
    ID: UqID<any>;
    formRows: FormRow[];
    onNo: (no: string) => void;
    actSave: (no: string, data: any) => Promise<any>;
}
*/
export function PageIDNew({ Part }: PartProps<PartID>) {
    const uqApp = useUqApp();
    const { caption, ID, formRows, onNo, actSave } = uqApp.objectOf(Part);
    const navigate = useNavigate();
    const { UqDefault } = uqApp.uqs;
    const { data: retNo } = useQuery('PageIDNew', async () => {
        let retNo = await UqDefault.IDNO({ ID });
        return retNo;
    }, { cacheTime: 0, refetchOnWindowFocus: false });
    onNo(retNo);
    const { register, handleSubmit, formState: { errors }, } = useForm({ mode: 'onBlur' });
    async function onSubmit(data: any) {
        alert(JSON.stringify(data));
        let ret = await actSave(retNo, data);
        alert(JSON.stringify(ret));
        navigate(-1);
    }

    return <Page header={`新建${caption}`}>
        <form onSubmit={handleSubmit(onSubmit)} className="container my-3">
            <FormRowsView rows={formRows} register={register} errors={errors} />
        </form>
    </Page>;
}
