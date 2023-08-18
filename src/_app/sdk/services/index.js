import { doc } from "https://deno.land/x/deno_doc/mod.ts";
import sdkView from "../../../components/sdk.jsx";

export default (props) => {
  document.getElementById("view").innerHTML = props.onServerResult.view;
};

const docfilter = (doc, kind) => {
  return doc.namespaceDef.elements
    .filter((element) => element.kind === kind)
    .map((item) => ({
      name: item.name,
      docs: docsSanitizer(item.jsDoc),
      def: item.functionDef,
    }));
};

const docsSanitizer = (doc) => {
  if (doc) {
    const category = doc.tags.filter((tag) => tag.kind === "category")[0].doc;
    const raw_return = doc.tags.filter((tag) => tag.kind === "return")[0];
    const returnDef = { type: raw_return.type, doc: raw_return.doc };

    return { doc: doc.doc, category, returnDef };
  }

  return {};
};

export const onServer = async (path, req) => {
  const interfacePath = new URL(
    "../../../sdk/interfaces/mod.ts",
    import.meta.url,
  ).toString();
  const interfaceDoc = await doc(interfacePath);

  const menu = docfilter(interfaceDoc[0], "interface");
  const sub_menu = docfilter(interfaceDoc[0], "function");

  return { view: sdkView({ menu, sub_menu }) };
};
