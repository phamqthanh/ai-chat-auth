export class CustomException<D> extends Error {
  data: D;
  constructor(data?: D);
  constructor(message?: string);
  constructor(message?: string | undefined, data?: D);
  constructor(message?: D | string | undefined, data?: D) {
    if (typeof message !== "string") {
      data = message;
      message = "Lỗi";
    }
    super(message);
    this.data = data!;
  }
}

// null
export class UnkwonException<D> extends CustomException<D> {}
// 404
export class NotFoundException<D> extends CustomException<D> {}
// 400
export class InvalidParamsException<D> extends CustomException<D> {}
// 403
export class ExpiredAuthException<D> extends CustomException<D> {}

export class ServerException<D> extends CustomException<D> {}

export enum OTPStatus {
  INVALID,
  EXPIRED,
  BOTH,
}
export class OtpErrorException extends Error {
  status: OTPStatus;
  constructor(option?: Partial<{ message: string; status: OTPStatus }>) {
    super(option?.message || "Mã otp không hợp lệ hoặc đã hết hạn");
    this.status = option?.status || OTPStatus.BOTH;
  }
}
