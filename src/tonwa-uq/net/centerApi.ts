import { User } from '../tool';
import { CenterApiBase } from './uqApi';

export class CenterApi extends CenterApiBase {
    async userAppUnits(app: number): Promise<any[]> {
        return await this.get('tie/user-app-units', { app: app });
    }
    async userFromKey(userName: string): Promise<User> {
        return await this.get('tie/user-from-key', { key: userName });
    }
    async userFromId(userId: number): Promise<any> {
        return await this.get('user/user-name-nick-icon-from-id', { userId: userId });
    }
    async userFromName(userName: string): Promise<User> {
        return await this.get('tie/user-from-key', { key: userName });
    }
    async usersFromEmail(email: string): Promise<any> {
        return await this.get('tie/users-from-email', { email });
    }
    async userFromMobile(mobile: string): Promise<User> {
        return await this.get('tie/users-from-mobile', { mobile });
    }
}
