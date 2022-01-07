export const config = {
  // Your Github Converted Token To Know How To Get Your Token Look at Readme.md
  githubConvertedToken: process.env.REACT_APP_GITHUB_CONVERTED_TOKEN,

  // Your Github UserName
  githubUserName: "RasenGuy",

  // Your Github Repo Name Where You Have your issues as Blog
  githubRepo: "blog",

  // Set it to true if you have a Github app to add to this project
  // and fill the client ID & secret
  enableOAuth: true,
  OAuthClientID: process.env.REACT_APP_GITHUB_OAUTH_CLIENT_ID,
  OAuthSecret: process.env.REACT_APP_GITHUB_OAUTH_SECRET, 

  // Your Personal Blog Title
  title : "Personal Blog" ,

  // Your Personal Blog Subtitle
  subtitle : "Smart Contract Developer & Fullstack Engineer",

  // Header customization
  header: {
    backgroundColor: '#f1f6f8', // can be a CSS gradient
    backgroundColorDark: '#4C566A',
    titleColor: '#ff5252',
    titleColorDark: '#16a085',
    subtitleColor: '#37474f',
    subtitleColorDark: '#D8DEE9',
  },
};
