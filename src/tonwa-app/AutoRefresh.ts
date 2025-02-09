import { UqAppBase } from "./UqAppBase";

// const gaps = [10, 4, 8, 8, 16, 16, 32, 32, 60];
// 每次单据提交操作，都会做一次refresh, 并重启这个循环
const gaps = [30, 60];

export class AutoRefresh {
    private readonly uqApp: UqAppBase;
    private timer: any;
    private paused: boolean;

    constructor(uqApp: UqAppBase) {
        this.uqApp = uqApp;
        this.paused = true;
        this.paused = false;
    }

    start() {
        const { refreshAction } = this.uqApp;
        if (refreshAction === undefined) return;
        this.stop();
        this.timer = setInterval(this.callTick, 1000);
        refreshAction();
    }

    stop() {
        if (this.timer === undefined) return;
        clearInterval(this.timer);
        this.timer = undefined;
    }

    pause() {
        this.paused = true;
    }

    resume() {
        this.paused = false;
    }

    // 激发refresh操作
    async trigger() {
        this.paused = false;
        this.gapIndex = 0;
        await this.refresh(); // 直接调用，不用await
    }

    private refreshTime: number = Date.now() / 1000;
    // 数据服务器提醒客户端刷新，下面代码重新调入的数据
    refresh = async () => {
        let d = Date.now() / 1000;
        if (d - this.refreshTime < 30) return;
        const { refreshAction } = this.uqApp;
        await refreshAction();
        this.refreshTime = d;
    }

    private tick = 0;
    private gapIndex = 0;
    private callTick = async () => {
        try {
            ++this.tick;
            if (this.tick < gaps[this.gapIndex]) return;
            this.tick = 0;
            if (this.gapIndex < gaps.length - 1) ++this.gapIndex;
            let { uqSites: uqUnit } = this.uqApp;
            if (uqUnit) {
                if (this.paused === true) return;
                let poked = await uqUnit.Poked();
                if (poked === false) return;
                this.gapIndex = 1;
                await this.refresh();
            }
        }
        catch {
        }
    }
}
