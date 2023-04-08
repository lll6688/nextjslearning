export const ironOptions = {
  cookieName: process.env.SESSION_COOKIE_NAME as string,
  password: process.env.SESSION_PASSWORD as string,
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000,
  },
};

export const oauthOptions = {
  github: {
    client_id: '23b07388e6412ca7762f',
    client_secret: '66d5826e170b5feebcd76346ae51a3c8de945f39'
  }
}