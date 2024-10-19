import Timestamp from "./timestamps/timestamp";
import * as mongoose from "mongoose";

export default interface Entity extends Timestamp{
    _id: string
}

export default class EntityUtil {
    public static checkForProperties(object: any): [Date, Date] {
        const createdAt = this.getProperty<Date>(object, 'createdAt');
        const updatedAt = this.getProperty<Date>(object, 'updatedAt');

        return [createdAt, updatedAt];
    }

    public static getProperty<T>(object: any, key: string): T {
        if(key in object) {
            return object[key] as T;
        } else {
            throw `Object is not an entity, property ${key} is missing`;
        }
    }

    public static convertId(id: unknown): string {
        return (id as mongoose.Types.ObjectId).toString();
    }
}