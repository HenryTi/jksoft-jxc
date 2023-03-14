import { UqAppBase } from "./UqAppBase";

const gaps = [10, 3, 3, 3, 3, 3, 5, 5, 5, 5, 5, 5, 5, 5, 10, 10, 10, 10, 15, 15, 15, 30, 30, 60];

export class AutoRefresh {
    private readonly uqApp: UqAppBase;
    private readonly refreshAction: Promise<void>;
    private timer: any;

    constructor(uqApp: UqAppBase, refreshAction: Promise<void>) {
        this.uqApp = uqApp;
        this.refreshAction = refreshAction;
    }

    start() {
        if (this.refreshAction === undefined) return;
        this.stop();
        this.timer = setInterval(this.callTick, 1000);
    }

    stop() {
        if (this.timer === undefined) return;
        clearInterval(this.timer);
        this.timer = undefined;
    }

    private refreshTime: number = Date.now() / 1000;
    // 数据服务器提醒客户端刷新，下面代码重新调入的数据
    refresh = async () => {
        let d = Date.now() / 1000;
        if (d - this.refreshTime < 30) return;
        await this.refreshAction;
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
            let { uqUnit } = this.uqApp;
            if (uqUnit) {
                let poked = await uqUnit.Poked();
                if (poked === true) return;
                this.gapIndex = 1;
                await this.refresh();
            }
        }
        catch {
        }
    }
}
