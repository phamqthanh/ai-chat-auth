declare namespace Model {
  interface Base {
    id: string;
    created_at: DateString;
    updated_at: DateString;
  }
  interface User extends Base {
    id: string;
    name: string;
    picture: string;
    email: string;
    phone_number: string;
    workspace_id: string?;
    is_verified_email: boolean;
    is_verified_phone: boolean;
  }
  interface FirebaseUser {
    uid: string;
    email: string;
    emailVerified: boolean;
    phoneNumber: string;
    disabled: boolean;
    metadata: {
      lastSignInTime: null;
      creationTime: string;
      lastRefreshTime: null;
    };
    tokensValidAfterTime: string;
    providerData: Array<{
      uid: string;
      providerId: string;
      phoneNumber: string;
    }>;
  }
}
