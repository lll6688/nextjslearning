interface ICookieInfo {
  userId: number
  nickname: string
  avatar: string
}

export const setCookies = (cookies, {userId, avatar, nickname} : ICookieInfo) =>  {
  // 登陆失效24小时
  const expires = new Date(Date.now() + 24  * 60 * 60 * 1000)

  const path = '/'

  cookies.set('userId', userId, {
    path,
    expires
  })


  cookies.set('nickname', nickname, {
    path,
    expires
  })

  cookies.set('avatar', avatar, {
    path,
    expires
  })
}

export const clearCookies =  (cookies) => {
  const expires = new Date(Date.now() + 24  * 60 * 60 * 1000)

  const path = '/'

  cookies.set('userId', '', {
    path,
    expires
  })


  cookies.set('nickname', '', {
    path,
    expires
  })

  cookies.set('avatar', '', {
    path,
    expires
  })
}