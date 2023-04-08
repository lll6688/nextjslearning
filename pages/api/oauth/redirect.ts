import { NextApiRequest, NextApiResponse } from 'next';
import requestInstance from 'services/fetch';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config';

import { ISession } from '..';
import { prepareConnection } from 'db';
import { User, UserAuth } from 'db/entity';
import { Cookie } from 'next-cookie';
import { setCookies } from 'utils';
import { oauthOptions } from 'config';
export default withIronSessionApiRoute(redirect, ironOptions);
export async function redirect(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;

  const { code } = req.query;

  const params = {
    client_id: oauthOptions.github.client_id,
    client_secret: oauthOptions.github.client_secret,
    code,
  };

  const result = await requestInstance.post(
    'https://github.com/login/oauth/access_token',
    params,
    {
      headers: { Accept: 'application/json' },
    }
  );

  console.log(result);
  const { access_token } = result as any;

  const userResult = await requestInstance.get('https://api.github.com/user', {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  console.log(userResult);
  const githubUserInfo = userResult;
  console.log(githubUserInfo);

  const cookies = Cookie.fromApiRoute(req, res);
  const db = await prepareConnection();
  const userAuthRepo = db.getRepository(UserAuth);

  const userAuth = await userAuthRepo.findOne({
    where: {
      identity_type: 'github',
      identifier: oauthOptions.github.client_id,
    },
    relations: ['user'],
  });

  if (userAuth) {
    const user = userAuth.user;
    console.log(123);
    console.log(user);
    const { id, nickname, avatar } = user;

    userAuth.credential = access_token;

    session.userId = id;
    session.nickname = nickname;
    session.avatar = avatar;

    await session.save();

    setCookies(cookies, { userId: id, nickname, avatar });

    res.writeHead(302, {
      Location: '/',
    });
    res.end();
  } else {
    const { login = '', avatar_url = '' } = githubUserInfo as any;
    const user = new User();

    user.nickname = login;
    user.avatar = avatar_url;

    const userAuth = new UserAuth();

    userAuth.identity_type = 'github';
    userAuth.identifier = oauthOptions.github.client_id;
    userAuth.credential = access_token;
    userAuth.user = user;

    const userAuthRepo = db.getRepository(UserAuth);

    const resUserAuth = await userAuthRepo.save(userAuth);

    console.log(resUserAuth);

    const { id, nickname, avatar } = resUserAuth?.user || {};

    session.userId = id;
    session.nickname = nickname;
    session.avatar = avatar;

    await session.save();

    setCookies(cookies, { userId: id, nickname, avatar });

    res.writeHead(302, {
      Location: '/',
    });
  }
}
