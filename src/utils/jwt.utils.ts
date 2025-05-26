import { JwtService } from "@nestjs/jwt";

export function gennerateJwtToken(
    payload: Record<string, any>,
    jwtService: JwtService,
): string {
    return jwtService.sign(payload);
}