import { ConflictException, Injectable } from "@nestjs/common";
import { BaseResponseApiDto } from "src/base/dto/base-response-api.dto";
import { UserResponseDto } from "./dto";
import { UserRepository } from "./user.repository";
import { plainToInstance } from "class-transformer";
import { User } from "./user.entity";
import * as bcrypt from "bcrypt";
import { LoginRequest, RegisterRequest, RegisterResponse } from "../auth/dto";
import { hashPassword } from "src/utils"; 
import { USER_MESSAGES, STATUS_CODE } from "../../constants"

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
            statuCode: STATUS_CODE.OK,
            message: USER_MESSAGES.FETCH_SUCCESS,
            data: data,
        }
    }

    public async createUser(registerUserDto: RegisterRequest): Promise<BaseResponseApiDto<RegisterResponse>> {
        await this.validateUserRegister(registerUserDto);
        const savedUser = await this.userRepository.createUserWithDefaultsRole(registerUserDto);
        return {
            statuCode: 201,
            message: "User created successfully",
            data: plainToInstance(RegisterResponse, {
                userId: savedUser.id,
                username: savedUser.username,
                email: savedUser.email,
                phoneNumber: savedUser.phoneNumber,
                roles: savedUser.roles,
                avatar: savedUser.avatar,
            }),
        }
    }

    /**
     * Validate username and password
     * @param username is the username of the user
     * @param password is the password of the user
     * @returns user if valid, null if invalid
     */
    public async validateUser(loginRequest: LoginRequest): Promise<User | null> {
        // const user = await this.userRepository.findOne({ where: {username: loginRequest.username}});    
        const user = await this.userRepository.findUserWithRole(loginRequest.username);   
        if (!user) {
            return null;
        }
        const isValidPassword = await bcrypt.compare(loginRequest.password, user.password);
        if (!isValidPassword) {
            return null;
        }
        return user;
    }

    /**
     * Validate user registration details
     * @param registerUserDto is the information of the user to register
     * @throws ConflictException if username, email or phone number already exists
     * @returns void
     */
    public async validateUserRegister(registerUserDto: RegisterRequest): Promise<void> {
        const { username, email, phoneNumber} = registerUserDto;
        const existingUser = await this.userRepository.findOne({
            where: [
                { username },
                { email },
                { phoneNumber }
            ]
        });
        
        const  reponse = new BaseResponseApiDto<UserResponseDto>();
        if (existingUser) {
            if (existingUser.username === username) {
                throw new ConflictException(USER_MESSAGES.USERNAME_EXISTS);
            }
            if (existingUser.email === email) {
                throw new ConflictException(USER_MESSAGES.EMAIL_EXISTS);
            }
            if (existingUser.phoneNumber === phoneNumber) {
                throw new ConflictException(USER_MESSAGES.PHONE_NUMBER_EXISTS);
            }
        }
    }

}