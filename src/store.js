import { atom } from 'recoil';

export const userDataState = atom({
    key: 'userDataState',
    default: {firstName: "", lastName: "", email: "", userId: -1}
});

export const initialsState = atom({
    key: 'initialsState',
    default: 'U',
});

export const enigmaUrlState = atom({
    key: 'enigmaUrlState',
    default: null,
});

export const userMetersState = atom({
    key: 'userMetersState',
    default: []
});