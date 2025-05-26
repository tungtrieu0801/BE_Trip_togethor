import { Expose } from "class-transformer";

export class RegisterResponse {

    @Expose()
    userId: string;

    @Expose()
    username: string;

    @Expose()
    email: string;

    @Expose()
    phoneNumber: string;

    role: string[];
}