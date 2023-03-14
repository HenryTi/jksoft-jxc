import { Page } from "../coms";
import { useUqAppBase } from "../UqAppBase";

export function Logout({ onLogout, resetAll }: { onLogout: () => Promise<void>; resetAll: () => void; }) {
    let uqApp = useUqAppBase();
    async function onClickLogout() {
        await uqApp.logined(undefined);
        await onLogout?.();
        resetAll?.();
        uqApp.restart();
    }
    const header = '安全退出';
    return <Page back="back" header={header}>
        <div className="my-5 border border-info bg-white rounded-3 p-5 text-center mx-auto w-max-40c ">
            <div>退出当前账号不会删除任何历史数据，下次登录依然可以使用本账号</div>
            <div className="mt-5 text-center">
                <button className="btn btn-danger" onClick={onClickLogout}>安全退出</button>
            </div>
        </div>
    </Page>;
}
