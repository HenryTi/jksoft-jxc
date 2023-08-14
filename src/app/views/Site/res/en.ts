import { RoleTName } from "./RoleName";

export const en: { [key in RoleTName]: string } = {
    self: 'Self',
    owner: 'Owner',
    admin: 'Admin',
    user: 'User',
    adminMemo1: 'Admin can set user roles',
    adminMemo2: 'Admin has all roles permission',

    ownerMemo1: 'Owner can add or delete an owner',
    ownerMemo2: 'Owner can add or delete an admin',
    ownerReallyQuit: 'Do you really want to quit owner?',
    ownerLost: 'You will lost owner',
    ownerConfirmQuit: 'Confirm quit',

    userReallyDelete: "Do you really want to delete {0} '{1}'?",
    deleteThe: 'Delete the {0}',
    save: 'Save',
    new: 'New',
    assigned: 'Assigned',
    searchUser: 'Search user',
    none: 'None',
}
