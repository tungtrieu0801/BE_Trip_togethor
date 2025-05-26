import { DataSource, Repository } from "typeorm";
import { User } from "./user.entity";
import { Injectable } from "@nestjs/common";
import { RegisterRequest } from "../auth/dto";

@Injectable()
export class UserRepository extends Repository<User> {
    constructor(private dataSource: DataSource) {
        super(User, dataSource.createEntityManager());
    }

    async createUserWithDefaultsRole(registerUserDto: RegisterRequest): Promise<User> {
        const result = await this.dataSource.query(
            `
            WITH new_user AS (
                INSERT INTO "users" (username, email, password, phone_number, is_active, created_at, updated_at, last_login,
                is_email_verified, is_phone_number_verified)
                VALUES ($1, $2, $3, $4, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, FALSE, FALSE)
                RETURNING *
            ),
            inserted_role AS (
                INSERT INTO "user_roles" (user_id, role_id)
                SELECT id, 2 FROM new_user
                RETURNING *
            )
            SELECT
                u.id, u.username, u.email, u.phone_number, u.is_active, u.created_at, u.updated_at, u.last_login,
                u.is_email_verified, u.is_phone_number_verified
            FROM new_user u
            LEFT JOIN user_roles ur ON u.id = ur.user_id
            LEFT JOIN roles r ON ur.role_id = r.id
            `,
            [
                registerUserDto.username,
                registerUserDto.email,
                registerUserDto.password,
                registerUserDto.phoneNumber,
            ]
        );
        const user = {
            id: result[0].id,
            username: result[0].username,
            email: result[0].email,
            password: result[0].password,
            phoneNumber: result[0].phone_number,
            isActive: result[0].is_active,
            createdAt: result[0].created_at,
            updatedAt: result[0].updated_at,
            isEmailVerified: result[0].is_email_verified,
            isPhoneNumberVerified: result[0].is_phone_number_verified,
            roles: [
                {
                id: result[0].role_id,
                name: result[0].role_name,
                },
            ],
        };

    return user as User;
    }
}