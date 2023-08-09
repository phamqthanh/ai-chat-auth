import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const [path] = req.query.path as string[];
  switch (path) {
    case "auth": {
      const { client_id, redirect_uri, response_type, scope, state } = req.query as Record<
        "client_id" | "scope" | "response_type" | "redirect_uri" | "state",
        string
      >;
      // return res.status(200).json({});
      const uri = new URL(redirect_uri);
      uri.searchParams.set("code", "123123123");
      uri.searchParams.set("state", state);
      res.redirect(uri.href).end();
      return;
    }
    case "token": {
      // This step covert from code to token
      console.log("token", req.body);
      return res.json({
        id_token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJhdWQiOjExMjMsImV4cCI6MTczNjIzOTAyMn0.-HDaAB9ILcJiJqd7nTzZe0buDcEX_TLj0JjYY5bBZnQ",
      });
    }
    default:
      break;
  }
  return res.status(200).json({});
}
