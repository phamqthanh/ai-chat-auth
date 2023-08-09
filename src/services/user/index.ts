import { BaseModel, get, post } from "..";

export class User extends BaseModel {
  static login(params: { email: string; password: string }) {
    return post<{ user: Model.User; access_token: string }>("/auth/login", params);
  }
  static register() {
    return post<{ user: Model.User; access_token: string }>("/auth/register");
  }

  static info(access_token?: string) {
    return get<Model.User>("/auth/profile", {
      headers: access_token ? { Authorization: "Bearer " + access_token } : undefined,
    });
  }

  static verifyEmail(token: string, access_token?: string) {
    return post<{ user: Pick<Model.User, "is_verified_email" | "id"> }>(
      "/auth/verify-email",
      { token },
      { headers: access_token ? { Authorization: "Bearer " + access_token } : undefined }
    );
  }
  static verifyOtp(payload: { phone: string; otp: string }) {
    return post<{ firebase_user: Model.FirebaseUser }>("/auth/verify-otp", payload);
  }
  static sendOtp(phone: string) {
    return post("/auth/send-otp", { phone });
  }
}
