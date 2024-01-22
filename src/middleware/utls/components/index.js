


export const getComponents = (doc) => {
      const regex = /<([a-z]+-[a-z]+)(\s+[a-z-]+="[^"]*")*\/?>/g;
      return doc.match(regex);
}

const getComponentsAtributes = (component) => {
    const atribute_regex = /([a-z-]+)="([^"]*)"/g;
    const attribute_match = component.match(atribute_regex)
    console.log(attribute_match);
}

export const compileDoc = async (html, elements) => {
    const element = await import("../../../components/app-head.jsx")
    return html.replace(elements[0], element.default())
}