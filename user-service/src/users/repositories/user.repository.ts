import { Collection } from "mongodb";

import User from "../models/user.model";
import DatabaseRepository from "../../database/repositories/database.repository";

export default class UserRepository extends DatabaseRepository<User> {
    constructor(collection: Collection) {
        super(collection);
    }

    public async findOneByEmail(email: string): Promise<User> {
        return this.findOne({ email }) as Promise<User>;
    }

    public async update(id: string, user: User): Promise<User> {
        return this.updateOne(id, user) as Promise<User>;
    }
}
