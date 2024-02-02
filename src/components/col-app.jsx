import React from "npm:react";
import { renderToString } from "npm:react-dom/server";

import { exists } from "https://deno.land/std/fs/mod.ts";

const ColumnApp = ({ content }) => {
  return (
    <body className="bg-gray-100 w-screen h-screen flex flex-col space-y-4">
      {content}
    </body>
  );
};

export default async () => {
  return renderToString(<ColumnApp content={"children"} />);
};
