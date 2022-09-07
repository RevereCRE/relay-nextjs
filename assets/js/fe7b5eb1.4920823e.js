(window.webpackJsonp=window.webpackJsonp||[]).push([[13],{84:function(e,n,t){"use strict";t.r(n),t.d(n,"frontMatter",(function(){return o})),t.d(n,"metadata",(function(){return i})),t.d(n,"toc",(function(){return l})),t.d(n,"default",(function(){return p}));var r=t(3),a=t(7),c=(t(0),t(88)),o={title:"Relay Document API"},i={unversionedId:"document-api",id:"document-api",isDocsHomePage:!1,title:"Relay Document API",description:"relay-nextjs/document is a set of APIs intended for use with a custom",source:"@site/docs/document-api.md",slug:"/document-api",permalink:"/relay-nextjs/docs/document-api",editUrl:"https://github.com/RevereCRE/relay-nextjs/edit/main/website/docs/document-api.md",version:"current",sidebar:"docs",previous:{title:"Relay Page API",permalink:"/relay-nextjs/docs/page-api"},next:{title:"Relay App API",permalink:"/relay-nextjs/docs/app-api"}},l=[{value:"<code>createRelayDocument</code>",id:"createrelaydocument",children:[]},{value:"<code>RelayDocument</code>",id:"relaydocument",children:[{value:"<code>enhance</code>",id:"enhance",children:[]},{value:"<code>Script</code>",id:"script",children:[]}]}],u={toc:l};function p(e){var n=e.components,t=Object(a.a)(e,["components"]);return Object(c.b)("wrapper",Object(r.a)({},u,t,{components:n,mdxType:"MDXLayout"}),Object(c.b)("p",null,Object(c.b)("inlineCode",{parentName:"p"},"relay-nextjs/document")," is a set of APIs intended for use with a custom\n",Object(c.b)("inlineCode",{parentName:"p"},"Document")," in Next.js."),Object(c.b)("h2",{id:"createrelaydocument"},Object(c.b)("inlineCode",{parentName:"h2"},"createRelayDocument")),Object(c.b)("p",null,"Creates a new ",Object(c.b)("a",{parentName:"p",href:"#relaydocument"},Object(c.b)("inlineCode",{parentName:"a"},"RelayDocument")),"."),Object(c.b)("h2",{id:"relaydocument"},Object(c.b)("inlineCode",{parentName:"h2"},"RelayDocument")),Object(c.b)("p",null,"Collects state needed for serialization when rendering on the server."),Object(c.b)("h3",{id:"enhance"},Object(c.b)("inlineCode",{parentName:"h3"},"enhance")),Object(c.b)("p",null,"Enhances the ",Object(c.b)("inlineCode",{parentName:"p"},"renderPage")," API exposed by Next.js. Example usage:"),Object(c.b)("pre",null,Object(c.b)("code",{parentName:"pre",className:"language-tsx"},"// src/pages/_document.tsx\nimport { createRelayDocument, RelayDocument } from 'relay-nextjs/document';\n\ninterface DocumentProps {\n  relayDocument: RelayDocument;\n}\n\nclass MyDocument extends Document<MyDocumentProps> {\n  static async getInitialProps(ctx: DocumentContext) {\n    const relayDocument = createRelayDocument();\n\n    const renderPage = ctx.renderPage;\n    ctx.renderPage = () =>\n      renderPage({\n        enhanceApp: (App) => relayDocument.enhance(App),\n      });\n\n    const initialProps = await Document.getInitialProps(ctx);\n\n    return {\n      ...initialProps,\n      relayDocument,\n    };\n  }\n\n  render() {\n    // ...\n  }\n}\n")),Object(c.b)("h3",{id:"script"},Object(c.b)("inlineCode",{parentName:"h3"},"Script")),Object(c.b)("p",null,"A React component that renders a script tag containing serialized state. Exmaple\nusage:"),Object(c.b)("pre",null,Object(c.b)("code",{parentName:"pre",className:"language-tsx"},"class MyDocument extends Document<MyDocumentProps> {\n  static async getInitialProps(ctx: DocumentContext) {\n    // ...\n  }\n\n  render() {\n    const { relayDocument } = this.props;\n\n    return (\n      <Html>\n        <Head>\n          {/* ... */}\n          <relayDocument.Script />\n        </Head>\n        {/* ... */}\n      </Html>\n    );\n  }\n}\n")))}p.isMDXComponent=!0},88:function(e,n,t){"use strict";t.d(n,"a",(function(){return s})),t.d(n,"b",(function(){return b}));var r=t(0),a=t.n(r);function c(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function i(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){c(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function l(e,n){if(null==e)return{};var t,r,a=function(e,n){if(null==e)return{};var t,r,a={},c=Object.keys(e);for(r=0;r<c.length;r++)t=c[r],n.indexOf(t)>=0||(a[t]=e[t]);return a}(e,n);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);for(r=0;r<c.length;r++)t=c[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var u=a.a.createContext({}),p=function(e){var n=a.a.useContext(u),t=n;return e&&(t="function"==typeof e?e(n):i(i({},n),e)),t},s=function(e){var n=p(e.components);return a.a.createElement(u.Provider,{value:n},e.children)},d={inlineCode:"code",wrapper:function(e){var n=e.children;return a.a.createElement(a.a.Fragment,{},n)}},m=a.a.forwardRef((function(e,n){var t=e.components,r=e.mdxType,c=e.originalType,o=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),s=p(t),m=r,b=s["".concat(o,".").concat(m)]||s[m]||d[m]||c;return t?a.a.createElement(b,i(i({ref:n},u),{},{components:t})):a.a.createElement(b,i({ref:n},u))}));function b(e,n){var t=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var c=t.length,o=new Array(c);o[0]=m;var i={};for(var l in n)hasOwnProperty.call(n,l)&&(i[l]=n[l]);i.originalType=e,i.mdxType="string"==typeof e?e:r,o[1]=i;for(var u=2;u<c;u++)o[u]=t[u];return a.a.createElement.apply(null,o)}return a.a.createElement.apply(null,t)}m.displayName="MDXCreateElement"}}]);