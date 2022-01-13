export const envHandler = (arg: string | undefined): string => {
    if (!arg) throw new Error(`${arg} ENV is not set`);
    return arg;
};
