import { authOptions } from "@/libs/auth";
import { User } from "@/services/user";
import { isString } from "@/utilities/validator";
import { AxiosError } from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const token = req.query.token;
    if (isString(token)) {
      const response = await User.verifyEmail(token).catch(
        (e: AxiosError) => e.response!.data as Response.Format
      );
      if (response.statusCode !== 200) throw new Error(response.message.join(", "));
      const session = await getServerSession(req, res, authOptions);
      if (!session) {
        const url = new URL("http://localhost:3000/auth/login");
        url.searchParams.set("message", response.message.join(","));
        res.redirect(url.href);
        return;
      } else {
        const url = new URL("http://localhost:3000/");
        res.redirect(url.href);
        return;
      }
    }
    throw new Error("Mã xác thực không đúng");
  } catch (error: any) {
    const url = new URL("http://localhost:3000/auth/login");
    url.searchParams.set("error", error.message);
    res.redirect(url.href);
    return;
  }
}
