import React, { PropsWithChildren } from "react";

type Props = {};

const LayoutCono = (props: PropsWithChildren) => {
  return <div className="flex">{props.children}</div>;
};

export default LayoutCono;
