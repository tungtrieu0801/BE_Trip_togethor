import { Injectable } from '@nestjs/common';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from './dto';
import { BaseResponseApiDto } from 'src/base/dto/base-response-api.dto';
import { UserService } from '../user/user.service';
import { STATUS_CODE, USER_MESSAGES } from 'src/constants';
import { plainToInstance } from 'class-transformer';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { gennerateJwtToken } from 'src/utils';

@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}
  
    public async login (loginRequest: LoginRequest): Promise<BaseResponseApiDto<LoginResponse>> {

        const user = await this.userService.validateUser(loginRequest);
        if (!user) {
            return {
                statuCode: STATUS_CODE.UNAUTHORIZED,
                message: USER_MESSAGES.INVALID_CREDENTIALS,
                data: null,
            };
        }

        const payLoad = {
            sub: user.id,
            username: user.username,
        }
        const accessToken = gennerateJwtToken(payLoad, this.jwtService);
        
        const loginResponse = plainToInstance(LoginResponse, {
            id: user.id,
            username: user.username,
            email: user.email,
            phoneNumber: user.phoneNumber,
            roles: user.roles.map(role => role.name),
            accessToken: accessToken,
            avatar: user.avatar,
        })
        
        return {
            statuCode: STATUS_CODE.OK,
            message: USER_MESSAGES.LOGIN_SUCCESS,
            data: loginResponse,
        }
    }

    public register (registerRequest: RegisterRequest): Promise<BaseResponseApiDto<RegisterResponse>> {
        return this.userService.createUser(registerRequest);
    }

}
