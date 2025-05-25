export class BaseResponseApiDto<T> {
    data: T;
    message: string;
    statuCode: number;
}