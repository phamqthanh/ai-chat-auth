import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const url = new URL("http://localhost:3000/api/oauth");
  return res.json({
    // issuer: "https://accounts.google.com",
    authorization_endpoint: url.href + "/auth",
    device_authorization_endpoint: "https://oauth2.googleapis.com/device/code",
    token_endpoint: url.href + "/token",
    userinfo_endpoint: url.href + "/userinfo",
    revocation_endpoint: "https://oauth2.googleapis.com/revoke",
    jwks_uri: "https://www.googleapis.com/oauth2/v3/certs",
    response_types_supported: [
      "code",
      "token",
      "id_token",
      "code token",
      "code id_token",
      "token id_token",
      "code token id_token",
      "none",
    ],
    subject_types_supported: ["public"],
    id_token_signing_alg_values_supported: ["HS256"],
    scopes_supported: ["openid", "email", "profile"],
    token_endpoint_auth_methods_supported: ["client_secret_post", "client_secret_basic"],
    claims_supported: [
      "aud",
      "email",
      "email_verified",
      "exp",
      "family_name",
      "given_name",
      "iat",
      "iss",
      "locale",
      "name",
      "picture",
      "sub",
    ],
    code_challenge_methods_supported: ["plain", "S256"],
    grant_types_supported: [
      "authorization_code",
      "refresh_token",
      "urn:ietf:params:oauth:grant-type:device_code",
      "urn:ietf:params:oauth:grant-type:jwt-bearer",
    ],
  });
}
