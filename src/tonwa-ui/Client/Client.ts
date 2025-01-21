export interface Client {
    GetUserBuds(userId: number): Promise<{ bud: number; value: any; }[]>;
}
