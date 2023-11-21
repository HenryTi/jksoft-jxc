import { useUqApp } from "app/UqApp";
import { Page, PageConfirm, useModal } from "tonwa-app";
import { ButtonAsync } from "tonwa-com";

export function PageCmdClear() {
    const { uq } = useUqApp();
    const modal = useModal();
    async function onClear() {
        let message = <div>
            <div>我已经了解清空的后果</div>
        </div>;
        let ret = await modal.open(<PageConfirm auth={true} header="清空确认" message={message} yes="确认清空" no="不清空" />);
        if (ret === true) {
            await uq.ClearCode.submit({});
            modal.close();
            await modal.open(<Page header="清空">
                <div className="p-3">
                    代码已清空
                </div>
            </Page>);
            document.location = '../';
            document.location.reload();
        }
    }
    return <Page header="清空代码">
        <div className="m-3 p-3 border border-danger text-info rounded-2">
            <div className="fw-bold">
                严重提醒
            </div>
            <div className="py-3">
                代码和数据都将丢失。请做好备份!
            </div>
        </div>
        <div className="px-3">
            <ButtonAsync className="btn btn-danger" onClick={onClear}>
                确定清空
            </ButtonAsync>
        </div>
    </Page>;
}
