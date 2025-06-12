export default class EnumUtil {
    public static getEnumKeyByValue<T extends Record<string, string>>(enumObj: T, value: string):
        keyof T | undefined {
        return (Object.keys(enumObj) as (keyof T)[])
            .find(k => enumObj[k] === value);
    }
}