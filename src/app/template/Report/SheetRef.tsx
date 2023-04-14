import { useUqApp } from "app/UqApp";
import { IDView } from "tonwa-app";

export function DetailRef({ value }: { value: any }) {
    let uqApp = useUqApp();
    let { uq } = uqApp;
    return <>
        <IDView uq={uq} id={value.sheet} Template={SheetRef} />
        &nbsp;
        <small>{value.id}</small>
    </>;
}
export function SheetRef({ value }: { value: any }) {
    const { $entity, no } = value;
    //let Template = dirMap[$entity as EnumID];
    //return <Template value={value} />;
    return <>{JSON.stringify(value)}</>
}
