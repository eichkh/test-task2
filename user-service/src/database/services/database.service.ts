import { MongoClient, Db, Collection } from "mongodb";

import ConfigService from "../../config/services/config.service";
import LoggerService from "../../logger/logger.service";

export default class DatabaseService {
    private client: MongoClient;
    private db!: Db;

    constructor(
        private readonly loggerService: LoggerService,
        private readonly configService: ConfigService
    ) {
        this.client = new MongoClient(this.configService.get("mongoUri"));

        this.loggerService.info(`${this.constructor.name} initialized`);
    }

    async connect(): Promise<void> {
        try {
            await this.client.connect();

            this.db = this.client.db();
        } catch (error) {
            console.error("Error connecting to MongoDB:", error);

            throw error;
        }
    }

    getCollection(name: string): Collection {
        return this.db.collection(name);
    }

    async close(): Promise<void> {
        try {
            await this.client.close();

            console.log("Disconnected from MongoDB");
        } catch (error) {
            console.error("Error closing MongoDB connection:", error);

            throw error;
        }
    }
}
