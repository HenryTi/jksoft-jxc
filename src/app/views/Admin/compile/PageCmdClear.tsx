import { useUqApp } from "app/UqApp";
import { ViewCurSiteHeader } from "app/views/Site";
import { Page, PageConfirm, useModal } from "tonwa-app";
import { ButtonAsync } from "tonwa-com";

interface Props {
    caption: string;
    cmd: () => Promise<void>;
}

function PageCmdClear({ caption, cmd }: Props) {
    const modal = useModal();
    async function onClear() {
        let message = <div>
            <div>我已经了解清空{caption}的后果</div>
        </div>;
        let ret = await modal.open(<PageConfirm auth={true} header="清空确认" message={message} yes="确认清空" no="不清空" />);
        if (ret === true) {
            // await uq.ClearPend.submit({});
            await cmd();
            modal.close();
            await modal.open(<Page header="清空">
                <div className="p-3">
                    {caption}已清空
                </div>
            </Page>);
            document.location = '../';
            document.location.reload();
        }
    }
    return <Page header={<ViewCurSiteHeader caption={'清空' + caption} />}>
        <div className="m-3 p-3 border border-danger text-info rounded-2">
            <div className="fw-bold">
                严重提醒
            </div>
            <div className="py-3">
                待处理数据都将丢失。请做好备份!
            </div>
        </div>
        <div className="px-3">
            <ButtonAsync className="btn btn-danger" onClick={onClear}>
                确定清空
            </ButtonAsync>
        </div>
    </Page>;
}

export function PageCmdClearPend() {
    const { uq } = useUqApp();
    async function cmd() {
        await uq.ClearPend.submit({});
    }
    return <PageCmdClear caption="待处理" cmd={cmd} />;
}

export function PageCmdClearCode() {
    const { uq } = useUqApp();
    async function cmd() {
        await uq.ClearCode.submit({});
    }
    return <PageCmdClear caption="代码" cmd={cmd} />;
}
