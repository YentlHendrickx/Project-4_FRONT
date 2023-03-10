import { atom } from 'recoil';

export const userDataState = atom({
    key: 'userDataState',
    default: {firstName: "", lastName: "", email: "", userId: -1}
});

export const initialsState = atom({
    key: 'initialsState',
    default: 'U',
});

// For saving enimga url
export const enigmaUrlState = atom({
    key: 'enigmaUrlState',
    default: null,
});

// For saving meters and displaying graphs
export const userMetersState = atom({
    key: 'userMetersState',
    default: []
});