/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'relay-nextjs',
  tagline: 'Relay Hooks integration for Next.js apps',
  url: 'https://reverecre.github.io',
  baseUrl: '/relay-nextjs/',
  organizationName: 'RevereCRE',
  projectName: 'relay-nextjs',
  trailingSlash: false,
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'RevereCRE', // Usually your GitHub org/user name.
  projectName: 'relay-nextjs', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'relay-nextjs',
      items: [
        {
          to: 'docs/',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
        },
        {
          href: 'https://github.com/RevereCRE/relay-nextjs',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      copyright: `Copyright © ${new Date().getFullYear()} Revere CRE, Inc. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/RevereCRE/relay-nextjs/edit/main/website/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
