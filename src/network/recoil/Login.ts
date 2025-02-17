import { atom } from "recoil";

export const emailAtom = atom<string>({
    key: "emailAtom",
    default: ""
});

export const passwordAtom = atom<string>({
    key: "passwordAtom",
    default: ""
});
