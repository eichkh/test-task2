import ValidatorService from "../../validator/services/validator.service";
import UserRepository from "../repositories/user.repository";
import GetUserByIdSchema from "../validation-schemas/get-user-by-id.schema";
import { BadRequestError } from "../../errors/http.error";
import CreateUserSchema from "../validation-schemas/create-user.schema";
import User from "../models/user.model";
import RoutingKeys from "../../queue/enums/routing-keys.enum";
import QueueService from "../../queue/services/queue.service";

export default class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly validatorService: ValidatorService,
        private readonly queueService: QueueService
    ) {}

    public async getUsers(): Promise<User[]> {
        return this.userRepository.findAll();
    }

    public async getUser(id: string): Promise<User> {
        try {
            this.validatorService.validate(GetUserByIdSchema, id);
        } catch (error: any) {
            throw new BadRequestError(error);
        }

        return this.userRepository.findById(id);
    }

    public async createUser(user: User): Promise<User> {
        try {
            this.validatorService.validate(CreateUserSchema, user);
        } catch (error: any) {
            throw new BadRequestError(error);
        }

        const foundUser = await this.userRepository.findOneByEmail(user.email);
        if (foundUser) {
            throw new BadRequestError("User with this email already exists");
        }

        user.createdAt = new Date();

        const createdUser = await this.userRepository.create(user);

        this.queueService.sendMessageToExchange(
            RoutingKeys.USER_CREATED,
            JSON.stringify(createdUser)
        );

        return createdUser as User;
    }

    public async updateUser(id: string, user: User): Promise<User> {
        try {
            this.validatorService.validate(GetUserByIdSchema, id);
            this.validatorService.validate(CreateUserSchema, user);
        } catch (error: any) {
            throw new BadRequestError(error);
        }

        const foundUser = await this.userRepository.findById(id);
        if (!foundUser) {
            throw new BadRequestError("User not found");
        }

        if (user.email !== foundUser.email) {
            const userWithEmail = await this.userRepository.findOneByEmail(
                user.email
            );
            if (userWithEmail) {
                throw new BadRequestError(
                    "User with this email already exists"
                );
            }
        }

        return this.userRepository.update(id, user) as Promise<User>;
    }

    public async deleteUser(id: string): Promise<void> {
        try {
            this.validatorService.validate(GetUserByIdSchema, id);
        } catch (error: any) {
            throw new BadRequestError(error);
        }

        const foundUser = await this.userRepository.findById(id);
        if (!foundUser) {
            throw new BadRequestError("User not found");
        }

        await this.userRepository.deleteOne(id);

        this.queueService.sendMessageToExchange(
            RoutingKeys.USER_DELETED,
            JSON.stringify(foundUser)
        );
    }
}
