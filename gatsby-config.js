const siteMetadata = {
  name: 'Gatsby Strict Starter',
  description:
    'Demo for a Gatsby starter with strict linting and auto-formatting rules.',
};

module.exports = {
  siteMetadata,
  plugins: [
    'gatsby-plugin-emotion',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        ...siteMetadata,
        display: 'minimal-ui',
        theme_color: '#ff4f7a',
        background_color: 'white',
        icon: 'src/assets/logo.svg',
        lang: 'en-US',
        start_url: '/',
      },
    },
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-typescript',
    'gatsby-plugin-offline',
  ],
};
