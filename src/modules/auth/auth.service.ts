import { Injectable } from '@nestjs/common';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from './dto';
import { BaseResponseApiDto } from 'src/base/dto/base-response-api.dto';
import { log } from 'console';

@Injectable()
export class AuthService {
  
    public login (loginDto: LoginRequest): BaseResponseApiDto<LoginResponse> {

        const shit = new BaseResponseApiDto<LoginResponse>();
        shit.message = "dang ki thanh cong";
        shit.data = new LoginResponse();
        shit.statuCode = 200;
        
        return shit;
    }

    public register (registerDto: RegisterRequest): BaseResponseApiDto<RegisterResponse> {
        const data = new RegisterResponse();
        data.email = "123";
        const shit = new BaseResponseApiDto<RegisterResponse>();
        shit.message = "dang ki thanh cong";
        shit.data = data;

        shit.statuCode = 200;
        
        return shit;
    }
}
