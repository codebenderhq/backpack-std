import { exists } from "https://deno.land/std/fs/mod.ts";

export const getComponents = (doc) => {
  const regex = /<([a-z]+-[a-z]+)(\s+[a-z-]+="[^"]*")*\/?>/g;
  return doc.match(regex);
};

const getComponentsAtributes = (component) => {
  const atribute_regex = /([a-z-]+)="([^"]*)"/g;
  return component.match(atribute_regex);
};

const getGlobalElementPath = (element_name) => {
  return `../../../components/${element_name}.jsx`;
};
const globalElements = ["app-head"];
export const compileDoc = async (html, elements, path) => {
  let new_doc = html;
  let shell_doc;
  const app_source = window._cwd;

  const app_shell_exp = /<!--content shell-->([\s\S]*?)<!--content shell-->/;
  const index_shell = `${window._app}/index.html`;
  const shell = await Deno.readTextFile(index_shell);

  const match = shell.match(app_shell_exp);
  //    new a way to overide the main shell
  if (match) {
    shell_doc = shell.replace(match[0], "<p>hello world test</p>");
  }

  //    get children elements

  const children_element_exp = /<([a-z]+-[a-z]+)>([\s\S]*?)<\/\1>/g;
  const children_elements = html.matchAll(children_element_exp);
  if (children_elements) {
    children_elements.forEach(async (element) => {
      const { default: container } = await import(
        getGlobalElementPath(element[1])
      );
      const _doc = (await container()).replace("children", element[2]);
      new_doc = new_doc.replace(element[0], _doc);
    });
  }
  
  await Promise.all(elements.map(async (element) => {
    const element_name_regex = /<([a-z]+-[a-z]+)(\s+[^>]+)?\/>/;
    const element_name_match = element.match(element_name_regex);
  
    const element_name = element_name_match ? element_name_match[1] : undefined;

    const paths = [
      { path: `file:///${app_source}/src/components${path}/${element_name}/index.jsx` }, // private_local_path
      {
        path: `file:///${app_source}/src/components/${
          path.split("/")[1]
        }/${element_name}/index.jsx`,
      }, // local_path
      { path: `file:///${app_source}/src/components/global/${element_name}/index.jsx` }, //local_global
      {
        path: `../../../components/${element_name}.jsx`,
        included: globalElements.includes(element_name),
      }, //global
    ];

    let element_src;
    for (let { path, included } of paths) {
      //
      if (await exists(path) || included) {
        element_src = await import(path);
        break;
      }
    }

    if (element_src) {
      const element_atrribute = getComponentsAtributes(element);
      const atrributes = {};
      if (element_atrribute) {
        element_atrribute.forEach((attribute) => {
          const split_attribute = attribute.split("=");
          const attribute_value_regexp = /"([^"]*)"/;
          //                                        will have to make a check to see the type of value sent through the atrribute
          atrributes[split_attribute[0]] =
            split_attribute[1].match(attribute_value_regexp)[1];
        });
      }

 
      new_doc = new_doc.replace(element, await element_src.default(atrributes));
    }
  }));

  return new_doc;
};
