import { RoleTName } from "./RoleName";

export const zh: { [key in RoleTName]: string } = {
    self: '自己',
    owner: '拥有者',
    admin: '管理员',
    user: '用户',
    adminMemo1: '管理员可以给用户赋予角色',
    adminMemo2: '管理员拥有全部角色权限',

    ownerMemo1: '拥有者可以增加其他拥有者',
    ownerMemo2: '拥有者可以增减管理员',
    ownerReallyQuit: '真的要退出拥有者吗？',
    ownerLost: '你将无法设置角色权限',
    ownerConfirmQuit: '确认退出',

    userReallyDelete: '真的要删除{0} "{1}" 吗?',
    deleteThe: '删除此{0}',
    save: '保存',
    new: '新增',
    assigned: '标注',
    searchUser: '搜索用户账户',
    none: '无',
}
