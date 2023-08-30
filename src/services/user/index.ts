import { BaseModel, get, post } from "..";
export interface LoginParams {
  email: string;
  password: string;
}
export interface RegisterParams extends LoginParams {
  name: string;
}
class UserClass extends BaseModel {
  // Login
  public login(payload: LoginParams) {
    return post<{ user: Model.User; access_token: string }>("/auth/login", payload);
  }
  public register(payload: RegisterParams) {
    return post<{ user: Model.User; access_token: string }>("/auth/register", payload);
  }

  // Info
  public info(access_token?: string) {
    return get<Model.User>("/auth/profile", {
      headers: access_token ? { Authorization: "Bearer " + access_token } : undefined,
    });
  }

  // verify email
  public verifyEmail(token: string, access_token?: string) {
    return post<{ user: Pick<Model.User, "is_verified_email" | "id"> }>(
      "/auth/verify-email",
      { token },
      { headers: access_token ? { Authorization: "Bearer " + access_token } : undefined }
    );
  }
  public verifyOtp(payload: { phone: string; otp: string }) {
    return post<{ firebase_user: Model.FirebaseUser }>("/auth/verify-otp", payload);
  }
  public sendOtp(phone: string) {
    return post("/auth/send-otp", { phone });
  }
}

export const User = new UserClass();
