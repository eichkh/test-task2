import { Collection, ObjectId, OptionalId } from "mongodb";

export default class DatabaseRepository<T> {
    constructor(private readonly collection: Collection) {}

    public async findAll(): Promise<T[]> {
        return this.collection.find().toArray() as Promise<T[]>;
    }

    public async findOne(query: any): Promise<T> {
        return this.collection.findOne(query) as Promise<T>;
    }

    public async findById(id: string | ObjectId): Promise<T> {
        return this.collection.findOne({ _id: new ObjectId(id) }) as Promise<T>;
    }

    public async create(document: OptionalId<T>): Promise<OptionalId<T>> {
        await this.collection.insertOne(document);

        return document;
    }

    public async updateOne(
        id: string | ObjectId,
        document: OptionalId<T>
    ): Promise<T> {
        await this.collection.updateOne(
            { _id: new ObjectId(id) },
            { $set: document }
        );

        return this.findById(id);
    }

    public async deleteOne(id: string | ObjectId): Promise<void> {
        await this.collection.deleteOne({ _id: new ObjectId(id) });
    }
}
