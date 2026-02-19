import { defaultTheme } from "@vuepress/theme-default";

export default {
  title: "Formester",
  description: "Welcome to the Formester documentation! Here you'll find comprehensive information and guides on how to effectively use and integrate Formester with other applications and projects",
  theme: defaultTheme({
    navbar: [
      {
        text: 'Home',
        link: '/',
      },
      {
        text: 'Guide',
        link: '/guide/'
      },
    ],
    sidebar: [
      '/guide/',
      '/formester-api',
      '/formester-api-v1',
      '/formester-api-v2',
      '/paypal-integration',
      '/formester-mcp-server',
    ],
  }),
} 