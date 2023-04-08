import { PageMoreCacheData } from "app/coms";
import { useUqApp } from "app/UqApp";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { LabelRowEdit, Page } from "tonwa-app";
import { Sep } from "tonwa-com";
import { GenProps } from "app/tool";
import { GenAtom, IDViewRowProps } from "./GenAtom";

export function PageAtomView({ Gen }: GenProps<GenAtom>) {
    const uqApp = useUqApp();
    const { caption, viewRows, Atom, bizAtom } = uqApp.objectOf(Gen);
    const { id: idString } = useParams();
    const id = Number(idString);
    const { UqDefault } = uqApp.uqs;
    const { data: { main, props } } = useQuery('PageProductView', async () => {
        if (idString === undefined) {
            return { main: {} as any, props: {} as any };
        }
        let { main: [main], buds } = await UqDefault.GetAtom.query({ id });
        let props: { [prop: string]: { bud: number; phrase: string; value: string; } } = {};
        for (let bud of buds) {
            props[bud.phrase] = bud;
        }
        return { main, props }
    }, {
        refetchOnWindowFocus: false,
        cacheTime: 0,
    });
    function RowMain({ label, name, readonly }: IDViewRowProps) {
        let value = (main as any)[name];
        console.log(`prop value ${name}`, value);
        async function onValueChanged(value: string | number) {
            await UqDefault.ActIDProp(Atom, id, name, value);
            let data = uqApp.pageCache.getData<PageMoreCacheData>();
            if (data) {
                let item = data.getItem<{ id: number }>(v => v.id === id) as any;
                if (item) item[name] = value;
            }
        }
        return <>
            <LabelRowEdit label={label} value={value} readonly={readonly} onValueChanged={onValueChanged} />
            <Sep />
        </>
    }

    function RowProp({ label, name, readonly }: IDViewRowProps) {
        async function onValueChanged(value: string | number) {
            await UqDefault.ActIDProp(Atom, id, name, value);
            let data = uqApp.pageCache.getData<PageMoreCacheData>();
            if (data) {
                let item = data.getItem<{ id: number }>(v => v.id === id) as any;
                if (item) item[name] = value;
            }
        }
        let value = props[name]?.value;
        return <>
            <LabelRowEdit label={label} value={value} readonly={readonly} onValueChanged={onValueChanged} />
            <Sep />
        </>
    }

    return <Page header={caption}>
        {viewRows.map((v, index) => <RowMain key={index} {...v} />)}
        {
            Array.from(bizAtom.props, ([, v]) => {
                let { name, caption } = v;
                return {
                    name,
                    label: caption ?? name
                }
            }).map((v, index) => {
                return <RowProp key={index} {...v} />;
            })
        }
    </Page>;
}
