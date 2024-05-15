import { UqExt } from "uqs/UqDefault";

abstract class KeyIdObject {
    private static __keyId = 0;
    readonly keyId: number;
    constructor() {
        this.keyId = ++KeyIdObject.__keyId;
    }
}

export abstract class Store extends KeyIdObject {
    readonly uq: UqExt;

    constructor(uq: UqExt) {
        super();
        this.uq = uq;
    }
}
