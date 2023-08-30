import React from "react";
import { Button } from "./button";
import { FaGithub, FaTwitter } from "react-icons/fa";
import Link from "next/link";

type Props = {};

const ExternalOAuth = (props: Props) => {
  return null;
  return (
    <div>
      <div>
        <div className="relative overflow-hidden text-center mt-10">
          <div className="divider-hr text-gray-200 text-sm">
            <span className="text-gray-900">Or continue with</span>
          </div>
        </div>
        <div className="grid mt-10 grid-cols-2 gap-4">
          <Button className="gap-3 rounded-md px-3 py-1.5 bg-[#1D9BF0] text-white">
            <FaTwitter size={20} />
            <span className="text-sm font-semibold">Twitter</span>
          </Button>
          <Button className="gap-3 rounded-md px-3 py-1.5 bg-[#24292F] text-white">
            <FaGithub size={20} />
            <span className="text-sm font-semibold">GitHub</span>
          </Button>
        </div>
      </div>

      <p className="mt-10 text-center text-sm text-gray-500">
        Not a member?{" "}
        <Link href="/" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
          Start a 14 day free trial
        </Link>
      </p>
    </div>
  );
};

export default ExternalOAuth;
