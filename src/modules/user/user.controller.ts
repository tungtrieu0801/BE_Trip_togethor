import { Controller, Get, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { JwtAuthGuard } from "../auth/guards";

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseGuards(JwtAuthGuard)
    @Get('getAll')
    public getAllUsers() {
        return this.userService.getAllUsers();
    }

    @Get('searchByPhone')
    public searchUserByPhoneNumber(phoneNumber: string) {
        return this.userService.searchUserByPhoneNumber(phoneNumber);
    }
}