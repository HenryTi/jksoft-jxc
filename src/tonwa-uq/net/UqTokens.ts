// import { UqTokenApi } from './uqApi';
import { Net } from './Net';
/*
export interface UqToken {
    name: string;
    db: string;
    url: string;
    token: string;
}
*/
/*
interface UqTokenAction {
    resolve: (value?: UqToken | PromiseLike<UqToken>) => void;
    reject: (reason?: any) => void;
}
*/
/*
export class UqTokens {
    private readonly net: Net;
    private readonly uqTokens: { [uqName: string]: UqToken } = {};

    constructor(net: Net) {
        this.net = net;
    }

    logoutUqTokens() {
        for (let i in this.uqTokens) {
            this.uqTokens[i] = undefined;
        }
        this.net.uqTokenApi.clearLocal();
    }

    //private readonly uqTokenActions: { [uq: string]: UqTokenAction } = {};

    async buildAppUq(uq: string, uqOwner: string, uqName: string): Promise<void> {
        //let unit = getUnit();
        let { unit } = this.net.props;
        let uqToken = await this.net.uqTokenApi.uq({ unit, uqOwner, uqName });
        if (uqToken.token === undefined) uqToken.token = this.net.centerToken;
        let { db, url, urlTest } = uqToken;
        let uqUrl = this.net.buildUqUrl(db, url, urlTest);
        console.log('realUrl: %s', uqUrl);
        uqToken.url = uqUrl;
        this.uqTokens[uq] = uqToken;
        // return uqToken;
    }

    getUqToken(uq: string): UqToken {
        let uts = this.uqTokens;
        return uts[uq];
    }
}
*/
