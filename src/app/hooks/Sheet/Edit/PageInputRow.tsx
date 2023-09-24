import { Page, useModal } from "tonwa-app";

export function PageInputRow() {
    const { closeModal } = useModal();
    function onClick() {
        closeModal('xxx yyy');
    }
    return <Page header="输入明细">
        <div className="p-3">
            <button className="btn btn-primary" onClick={onClick}>输入</button>
        </div>
    </Page>
}
