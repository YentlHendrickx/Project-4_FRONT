import { atom } from 'recoil';

export const userDataState = atom({
    key: 'userDataState',
    default: {firstName: "", lastName: "", email: "", userId: -1}
});

export const initialsState = atom({
    key: 'initialsState',
    default: 'U',
});