"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[125],{3905:(e,n,t)=>{t.d(n,{Zo:()=>c,kt:()=>d});var r=t(7294);function a(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function p(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){a(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function i(e,n){if(null==e)return{};var t,r,a=function(e,n){if(null==e)return{};var t,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||(a[t]=e[t]);return a}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var l=r.createContext({}),s=function(e){var n=r.useContext(l),t=n;return e&&(t="function"==typeof e?e(n):p(p({},n),e)),t},c=function(e){var n=s(e.components);return r.createElement(l.Provider,{value:n},e.children)},u="mdxType",y={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},m=r.forwardRef((function(e,n){var t=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),u=s(t),m=a,d=u["".concat(l,".").concat(m)]||u[m]||y[m]||o;return t?r.createElement(d,p(p({ref:n},c),{},{components:t})):r.createElement(d,p({ref:n},c))}));function d(e,n){var t=arguments,a=n&&n.mdxType;if("string"==typeof e||a){var o=t.length,p=new Array(o);p[0]=m;var i={};for(var l in n)hasOwnProperty.call(n,l)&&(i[l]=n[l]);i.originalType=e,i[u]="string"==typeof e?e:a,p[1]=i;for(var s=2;s<o;s++)p[s]=t[s];return r.createElement.apply(null,p)}return r.createElement.apply(null,t)}m.displayName="MDXCreateElement"},6070:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>l,contentTitle:()=>p,default:()=>y,frontMatter:()=>o,metadata:()=>i,toc:()=>s});var r=t(7462),a=(t(7294),t(3905));const o={title:"Relay App API"},p=void 0,i={unversionedId:"app-api",id:"app-api",title:"Relay App API",description:"relay-nextjs/app exposes a single hook to configure your app to use Relay.",source:"@site/docs/app-api.md",sourceDirName:".",slug:"/app-api",permalink:"/relay-nextjs/docs/app-api",draft:!1,editUrl:"https://github.com/RevereCRE/relay-nextjs/edit/main/website/docs/app-api.md",tags:[],version:"current",frontMatter:{title:"Relay App API"},sidebar:"docs",previous:{title:"Relay Page API",permalink:"/relay-nextjs/docs/page-api"}},l={},s=[{value:"<code>useRelayNextjs</code>",id:"userelaynextjs",level:2}],c={toc:s},u="wrapper";function y(e){let{components:n,...t}=e;return(0,a.kt)(u,(0,r.Z)({},c,t,{components:n,mdxType:"MDXLayout"}),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"relay-nextjs/app")," exposes a single hook to configure your app to use Relay."),(0,a.kt)("h2",{id:"userelaynextjs"},(0,a.kt)("inlineCode",{parentName:"h2"},"useRelayNextjs")),(0,a.kt)("p",null,"Returns an object containing an ",(0,a.kt)("inlineCode",{parentName:"p"},"Environment")," and props needed to render a page\nusing ",(0,a.kt)("inlineCode",{parentName:"p"},"relay-nextjs"),". Example usage:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-tsx"},"// src/pages/_app.tsx\nimport { RelayEnvironmentProvider } from 'react-relay/hooks';\nimport { useRelayNextjs } from 'relay-nextjs/app';\n\n// This function should return a RelayEnvironment pointed at your GraphQL API.\n// Note that this should always return the same object, **not** create a new\n// RelayEnvironment on every call.\nimport { getClientEnvironment } from '../lib/client_environment';\n\nfunction MyApp({ Component, pageProps }: AppProps) {\n  const { env, ...relayProps } = useRelayNextjs(pageProps, {\n    createClientEnvironment: () => getClientSideEnvironment()!,\n  });\n\n  return (\n    <>\n      <RelayEnvironmentProvider environment={env}>\n        <Component {...pageProps} {...relayProps} />\n      </RelayEnvironmentProvider>\n    </>\n  );\n}\n\nexport default MyApp;\n")))}y.isMDXComponent=!0}}]);