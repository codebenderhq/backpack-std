import { exists } from "https://deno.land/std/fs/mod.ts";


export const getComponents = (doc) => {
      const regex = /<([a-z]+-[a-z]+)(\s+[a-z-]+="[^"]*")*\/?>/g;
      return doc.match(regex);
}

const getComponentsAtributes = (component) => {
    const atribute_regex = /([a-z-]+)="([^"]*)"/g;
    return component.match(atribute_regex);
}

const globalElements = ["app-head"]
export const compileDoc = async (html, elements, path) => {
    let new_doc = html;

        await Promise.all(elements.map(async element => {
                const element_name_regex = /<([a-z]+-[a-z]+)(\s+[^>]+)?\/>/;
                const element_name_match = element.match(element_name_regex)
                const element_name = element_name_match[1] //element.replace("<","").replace("/>","");

                const paths = [
                        { path: `${window._app}/src/components${path}/${element_name}/index.jsx`}, // private_local_path
                        { path: `${window._app}/src/components${path[0]}/${element_name}/index.jsx`}, // local_path
                        { path: `${window._app}/src/components/global/${element_name}/index.jsx` }, //local_global
                        { path: `../../../components/${element_name}.jsx`, included: globalElements.includes(element_name) } //global
                ];

                let element_src;
                for (let { path, included } of paths) {
                        if (await exists(path) ||  included) {
                                element_src = await import(path);
                                break;
                        }
                }

                if(element_src){
                        const element_atrribute = getComponentsAtributes(element)
                        const atrributes = {};
                        if(element_atrribute){
                                element_atrribute.forEach(attribute => {
                                        const split_attribute = attribute.split('=');
                                        const attribute_value_regexp = /"([^"]*)"/;
//                                        will have to make a check to see the type of value sent through the atrribute
                                        atrributes[split_attribute[0]] = split_attribute[1].match(attribute_value_regexp)[1];
                                })
                        }

                        new_doc = new_doc.replace(element,await element_src.default(atrributes))
                }

        }))
    return new_doc
}