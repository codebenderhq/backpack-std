import React from "https://esm.sh/react";
import ReactDOM from "https://esm.sh/react-dom/server";
import Markdoc from "https://esm.sh/@markdoc/markdoc";

const parseMarkDoc = (source) => {
  const ast = Markdoc.parse(source);
  const content = Markdoc.transform(ast /* config */);

  console.log(content);
  return Markdoc.renderers.react(content, React);
};

export function SdkView({ doc }) {
  return (
    <div className="w-full flex flex-row p-2 max-w-6xl">
      <div className="w-1/4 flex flex-col space-y-2">
        {doc.menu.map((item) => (
          <a href={`#${item.name}`} key={item.name}>{item.name}</a>
        ))}
      </div>
      <div className="w-3/4">
        {doc.menu.map((item) => (
          <div
            id={item.name}
            className={"w-full hidden target:flex flex-col space-y-4 max-w-md"}
          >
            {item.docs.doc ? parseMarkDoc(item.docs.doc) : <>'Do you best'</>}
            {doc.sub_menu.filter((sub) => sub.docs.category === item.name).map(
              (sub_item) => <li>{sub_item.name}</li>,
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default (doc) => {
  return ReactDOM.renderToString(<SdkView doc={doc}></SdkView>);
};
