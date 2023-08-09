import Layout from "@/components/layout";
import { withServerSideSession } from "@/libs/auth";
import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import React from "react";

type PageProps = {};
const PageChatDetail: NextPage<PageProps> = (props) => {
  return (
    <div>
      <div>
        <Link href="/" shallow>
          Go back home
        </Link>
      </div>
      <div>
        <Link href={{ pathname: "/c/[id]", query: { id: Math.random() } }} shallow>
          Go random page
        </Link>
      </div>
    </div>
  );
};

PageChatDetail.getLayout = Layout;
export default PageChatDetail;
export const getServerSideProps: GetServerSideProps = withServerSideSession();
