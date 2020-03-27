const siteMetadata = {
  name: 'COVID19 API Map',
  description: 'Map created using covid19api.',
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
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: 'UA-126651057-3',
        head: true,
        respectDNT: true,
      },
    },
  ],
};
