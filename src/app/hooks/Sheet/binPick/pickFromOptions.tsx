import { EntityOptions, PickOptions } from "app/Biz";
import { AtomPhrase } from "app/tool";
import { PickResult } from "app/hooks";
import { Modal, Page, useModal } from "tonwa-app";
import { OptionsRadioAsync } from "app/hooks/Bud/OptionsRadioAsync";
import { useRef } from "react";

export async function pickFromOptions(modal: Modal, binPick: PickOptions): Promise<PickResult> {
    let { caption, from } = binPick;
    let ret = await modal.open<number>(<PageOptions options={from} caption={caption} />);
    return ret as any as PickResult;
}

function PageOptions({ options, caption }: { options: EntityOptions; caption: string; }) {
    const modal = useModal();
    let refValue = useRef<number | string>(options.items[0].id);
    async function onCheckChanged(item: number | string) {
        refValue.current = item;
    }
    function onSubmit() {
        modal.close(refValue.current);
    }
    return <Page header={caption}>
        <div className="d-flex m-3 p-3 border rounded-3">
            <OptionsRadioAsync options={options} radioUI={'radio'} value={refValue.current} onCheckChanged={onCheckChanged} />
        </div>
        <div className="m-3">
            <button className="btn btn-primary" onClick={onSubmit}>确定</button>
        </div>
    </Page>
}
