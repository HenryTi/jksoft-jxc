export type AccountType = 'email' | 'mobile';

export interface PasswordParams {
    account: string;
    password: string;
    verify: string;
    type: AccountType;
    toLogin: () => void;
}
