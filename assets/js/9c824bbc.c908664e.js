"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[12],{3905:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>y});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var s=r.createContext({}),p=function(e){var t=r.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},u=function(e){var t=p(e.components);return r.createElement(s.Provider,{value:t},e.children)},c="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,s=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),c=p(n),m=a,y=c["".concat(s,".").concat(m)]||c[m]||d[m]||i;return n?r.createElement(y,o(o({ref:t},u),{},{components:n})):r.createElement(y,o({ref:t},u))}));function y(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,o=new Array(i);o[0]=m;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l[c]="string"==typeof e?e:a,o[1]=l;for(var p=2;p<i;p++)o[p]=n[p];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},2231:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>o,default:()=>d,frontMatter:()=>i,metadata:()=>l,toc:()=>p});var r=n(7462),a=(n(7294),n(3905));const i={title:"Relay Page API"},o=void 0,l={unversionedId:"page-api",id:"page-api",title:"Relay Page API",description:"withRelay",source:"@site/docs/page-api.md",sourceDirName:".",slug:"/page-api",permalink:"/relay-nextjs/docs/page-api",draft:!1,editUrl:"https://github.com/RevereCRE/relay-nextjs/edit/main/website/docs/page-api.md",tags:[],version:"current",frontMatter:{title:"Relay Page API"},sidebar:"docs",previous:{title:"Lazy-loaded Queries",permalink:"/relay-nextjs/docs/lazy-loaded-query"},next:{title:"Relay App API",permalink:"/relay-nextjs/docs/app-api"}},s={},p=[{value:"<code>withRelay</code>",id:"withrelay",level:2},{value:"Arguments",id:"arguments",level:3},{value:"<code>RelayOptions</code>",id:"relayoptions",level:2},{value:"Properties",id:"properties",level:3}],u={toc:p},c="wrapper";function d(e){let{components:t,...n}=e;return(0,a.kt)(c,(0,r.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h2",{id:"withrelay"},(0,a.kt)("inlineCode",{parentName:"h2"},"withRelay")),(0,a.kt)("p",null,"Wraps a component, GraphQL query, and a set of options to manage loading the\npage and its data, as specified by the query. Example usage:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-tsx"},"// src/pages/user/[uuid].tsx\nimport { withRelay, RelayProps } from 'relay-nextjs';\nimport { graphql, usePreloadedQuery } from 'react-relay/hooks';\n\n// The $uuid variable is injected automatically from the route.\nconst ProfileQuery = graphql`\n  query profile_ProfileQuery($uuid: ID!) {\n    user(id: $uuid) {\n      id\n      firstName\n      lastName\n    }\n  }\n`;\n\nfunction UserProfile({ preloadedQuery }: RelayProps<{}, profile_ProfileQuery>) {\n  const query = usePreloadedQuery(ProfileQuery, preloadedQuery);\n\n  return (\n    <div>\n      Hello {query.user.firstName} {query.user.lastName}\n    </div>\n  );\n}\n\nexport default withRelay(UserProfile, UserProfileQuery, options);\n")),(0,a.kt)("h3",{id:"arguments"},"Arguments"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"component"),": A\n",(0,a.kt)("a",{parentName:"li",href:"https://nextjs.org/docs/basic-features/pages"},"Next.js page component")," to\nrecieve the preloaded query from ",(0,a.kt)("inlineCode",{parentName:"li"},"relay-nextjs"),"."),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"query"),": A GraphQL query using the ",(0,a.kt)("inlineCode",{parentName:"li"},"graphql")," tag from Relay."),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"options"),": A ",(0,a.kt)("a",{parentName:"li",href:"#relayoptions"},(0,a.kt)("inlineCode",{parentName:"a"},"RelayOptions"))," object.")),(0,a.kt)("h2",{id:"relayoptions"},(0,a.kt)("inlineCode",{parentName:"h2"},"RelayOptions")),(0,a.kt)("p",null,"Interface for configuring ",(0,a.kt)("inlineCode",{parentName:"p"},"withRelay"),". Example usage:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-tsx"},"const options: RelayOptions<{ token: string }> = {\n  fallback: <Loading />,\n  fetchPolicy: 'store-and-network',\n  createClientEnvironment: () => getClientEnvironment()!,\n  serverSideProps: async (ctx) => {\n    const { getTokenFromCtx } = await import('lib/server/auth');\n    const token = await getTokenFromCtx(ctx);\n    if (token == null) {\n      return {\n        redirect: { destination: '/login', permanent: false },\n      };\n    }\n\n    return { token };\n  },\n  createServerEnvironment: async (ctx, { token }) => {\n    const { createServerEnvironment } = await import('lib/server_environment');\n    return createServerEnvironment(token);\n  },\n};\n")),(0,a.kt)("h3",{id:"properties"},"Properties"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"fallback?"),": React component to use as a loading indicator. See\n",(0,a.kt)("a",{parentName:"li",href:"https://reactjs.org/docs/concurrent-mode-suspense.html"},"React Suspense docs"),"."),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"fetchPolicy?"),": Relay fetch policy. Defaults to ",(0,a.kt)("inlineCode",{parentName:"li"},"store-and-network"),". See\n",(0,a.kt)("a",{parentName:"li",href:"https://relay.dev/docs/guided-tour/reusing-cached-data/fetch-policies/"},"Relay docs"),"."),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"clientSideProps?"),": Provides props to the page on client-side navigations. Not\nrequired."),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"createClientEnvironment"),": A function that returns a ",(0,a.kt)("inlineCode",{parentName:"li"},"RelayEnvironment"),".\nShould return the same environment each time it is called."),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"serverSideProps?"),": Fetch any server-side only props such as authentication\ntokens. Note that you should import server-only deps with\n",(0,a.kt)("inlineCode",{parentName:"li"},"await import('...')"),"."),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"createServerEnvironment"),": A function that returns a ",(0,a.kt)("inlineCode",{parentName:"li"},"RelayEnvironment"),". First\nargument is ",(0,a.kt)("inlineCode",{parentName:"li"},"NextPageContext")," and the second is the object returned by\n",(0,a.kt)("inlineCode",{parentName:"li"},"serverSideProps"),"."),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"variablesFromContext?"),": Function that extracts GraphQL query variables from\n",(0,a.kt)("inlineCode",{parentName:"li"},"NextPageContext"),". Run on both the client and server. If omitted query\nvariables are set to ",(0,a.kt)("inlineCode",{parentName:"li"},"ctx.query"),"."),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("inlineCode",{parentName:"li"},"serverSidePostQuery?"),": Function that is called during server side rendering\nafter fetching the query is finished. First parameter gives you access to the\ndata returned by your query and the second parameter gives access to\n",(0,a.kt)("inlineCode",{parentName:"li"},"NextPageContext"),". This function can be used for example to set your response\nstatus to 404 if your query didn't return data.")))}d.isMDXComponent=!0}}]);