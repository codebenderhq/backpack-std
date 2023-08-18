import React from "https://esm.sh/react";
import ReactDOM from "https://esm.sh/react-dom/server";

export function SdkView({ doc }) {
    return (
        <div className="w-full flex flex-row p-2 max-w-xl">
            <div className="w-1/3">
                {doc.menu.map(item => <li key={name} id={name}>{item.name}</li>)}
            </div>
            <div className="w-2/3">
                
                
            </div>
        </div>
        );
}

export default (doc) => {
    return ReactDOM.renderToString(<SdkView doc={doc}></SdkView>);
};
