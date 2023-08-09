import type { OAuthConfig, OAuthUserConfig } from "next-auth/providers/oauth";

export interface CustomProfile extends Record<string, any> {
  // id: string;
  // picture: FacebookPicture;
}

export default function CustomProvider<P extends CustomProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "custom_provider",
    name: "Custom Provider",
    type: "oauth",
    // authorization: "https://oauth.zaloapp.com/v4/permission",
    // token: "https://oauth.zaloapp.com/v4/access_token",
    // authorization: "http://localhost:3000/api/oauth/authorization",
    // token: "http://localhost:3000/api/oauth/access_token",
    wellKnown: "http://localhost:3000/api/oauth/.well-known/openid-configuration",
    client: {
      id_token_signed_response_alg: "HS256",
    },
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: profile.picture,
      } as any;
    },
    // wellKnown: "https://www.facebook.com/.well-known/openid-configuration/",
    // userinfo: {
    //   url: "https://graph.facebook.com/me",
    //   // https://developers.facebook.com/docs/graph-api/reference/user/#fields
    //   params: { fields: "id,name,email,picture" },
    //   async request({ tokens, client, provider }: any) {
    //     return await client.userinfo(tokens.access_token!, {
    //       params: provider.userinfo?.params,
    //     });
    //   },
    // },
    // profile(profile: ZaloProfile) {
    //   return {
    //     id: profile.id,
    //     name: profile.name,
    //     email: profile.email,
    //     image: profile.picture.data.url,
    //   };
    // },
    options,
  };
}
