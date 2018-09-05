module.exports = {
  avatarUrl: process.env.LYREBIRD_AVATAR_URL,
  myvoiceUrl: process.env.LYREBIRD_MYVOICE_URL,
  publicUrl: process.env.PUBLIC_URL,
  client: {
    id: process.env.LYREBIRD_CLIENT_ID,
    secret: process.env.LYREBIRD_CLIENT_SECRET,
    redirectUri: process.env.LYREBIRD_CLIENT_REDIRECT
  },
  db: {
    url: process.env.DB_URL,
    name: process.env.DB_NAME
  },
  port: process.env.PORT
};
