import { Injectable } from "@nestjs/common";
import { BaseResponseApiDto } from "src/base/dto/base-response-api.dto";
import { UserResponseDto } from "./dto";
import { UserRepository } from "./user.repository";
import { plainToInstance } from "class-transformer";

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
    ) {}

    public async getAllUsers(): Promise<BaseResponseApiDto<UserResponseDto[]>> {
        const users = await this.userRepository.find();
        const data = plainToInstance(UserResponseDto, users, {
            excludeExtraneousValues: true
        });
        return {
            statuCode: 200,
            message: "Users retrieved successfully",
            data: data,
        }
    }
}