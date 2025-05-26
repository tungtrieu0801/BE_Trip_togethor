import { DataSource, Repository } from "typeorm";
import { User } from "./user.entity";
import { Injectable } from "@nestjs/common";
import { RegisterRequest } from "../auth/dto";
import { hashPassword } from "src/utils";

@Injectable()
export class UserRepository extends Repository<User> {
    constructor(private dataSource: DataSource) {
        super(User, dataSource.createEntityManager());
    }

    async findUserWithRole (username: string): Promise<User | null> {
        return this.dataSource.getRepository(User)
            .createQueryBuilder ('user')
            .leftJoinAndSelect('user.roles', 'role')
            .where('user.username = :username', { username })
            .getOne();
    }

    async createUserWithDefaultsRole(registerUserDto: RegisterRequest): Promise<User> {
        // Common Table Expressions (CTE) + Chained Inserts
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
                SELECT u.id, $5::int
                FROM new_user u
                RETURNING user_id, role_id
            )
            SELECT
                u.id,
                u.username,
                u.email,
                u.password,
                u.phone_number,
                u.is_active,
                u.created_at,
                u.updated_at,
                u.last_login,
                u.is_email_verified,
                u.is_phone_number_verified,
                u.avatar,
                r.name AS role_name
            FROM new_user u
            LEFT JOIN inserted_role ir ON u.id = ir.user_id
            LEFT JOIN roles r ON ir.role_id = r.id
            `,
            [
                registerUserDto.username,
                registerUserDto.email,
                await hashPassword(registerUserDto.password, 10),
                registerUserDto.phoneNumber,
                2 //Role user
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
            avatar: result[0].avatar,
            roles: [result[0].role_name],
        };
        return user as User;
    }

}