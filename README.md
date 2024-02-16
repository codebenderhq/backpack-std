# oomph

You learn code for the same reason you learned to read and write

It is a way for you to communicate, your beliefs

Express your passion and build value not just for yourself but for others

And that is what oomph aims to help you get right, building solutions that not only improve your life but those of your friends too

What do you want to build?

## Getting Started

Below is an example of a simple server using oomph core libaries, that
servers an html site

```
import {
  asset_middlware,
  html_middleware,
} from "jsr:@oomph/core@0.0.2";


Deno.serve((request) => {
     let { pathname } = new URL(request.url);
     
     window._app = `${Deno.cwd()}/src/_app`
     if(pathname.includes('.')){
      return asset_middlware(request);
     }else{
      return html_middleware(request);
     }
});
```

## Tech Debt

- [ ] migrate to typescript
- [ ] improve documentation