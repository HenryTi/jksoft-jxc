import { PageMoreCacheData } from "app/coms";
import { UqApp, useUqApp } from "app/UqApp";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { LabelRowEdit, Page } from "tonwa-app";
import { Sep } from "tonwa-com";
import { PartProps } from "../Part";
import { PartID, IDViewRowProps } from "./PartID";

/*
export interface RowProps {
    name: string;
    label: string;
    readonly?: boolean;
}

interface PageIDViewProps {
    header: string;
    ID: UqID<any>;
    rows: RowProps[];
}
*/
export function PageIDView({ Part }: PartProps<PartID>) {
    const uqApp = useUqApp();
    const { caption, viewRows, ID } = uqApp.partOf(Part);
    const { id: idString } = useParams();
    const id = Number(idString);
    const { JsTicket } = uqApp.uqs;
    const { data } = useQuery('PageProductView', async () => {
        let ret = await JsTicket.ID({ IDX: ID, id });
        return ret[0] ?? {};
    }, {
        refetchOnWindowFocus: false,
        cacheTime: 0,
    });
    function Row({ label, name, readonly }: IDViewRowProps) {
        let value = data[name];
        console.log(`prop value ${name}`, value);
        async function onValueChanged(value: string | number) {
            await JsTicket.ActIDProp(ID, id, name, value);
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
    return <Page header={caption}>
        {viewRows.map((v, index) => <Row key={index} {...v} />)}
    </Page>;
}
