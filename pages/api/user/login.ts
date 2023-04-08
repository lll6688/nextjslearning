import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config';

import { ISession } from '..';
import { prepareConnection } from 'db';
import { User, UserAuth } from 'db/entity';
import { Cookie } from 'next-cookie';
import { setCookies } from 'utils';
export default withIronSessionApiRoute(login, ironOptions);
export async function login(req: NextApiRequest, res: NextApiResponse) {
  const { phone, verify, identity_type = 'phone' } = req.body;
  const session: ISession = req.session;

  const db = await prepareConnection();

  const cookies = Cookie.fromApiRoute(req, res);
  const userAuthRepo = db.getRepository(UserAuth);

  if (String(session.verifyCode) === String(verify)) {
    const userAuth = await userAuthRepo.findOne({
      where: {
        identity_type,
        identifier: phone,
      },
      relations: ['user'],
    });
    if (userAuth) {
      const user = userAuth.user;
      const { id, nickname, avatar } = user;
      session.userId = id;
      session.nickname = nickname;
      session.avatar = avatar;

      await session.save();

      setCookies(cookies, { userId: id, nickname, avatar });
      res?.status(200).json({
        code: 0,
        msg: '登录成功',
        data: {
          userId: id,
          nickname,
          avatar,
        },
      });
    } else {
      const user = new User();
      user.nickname = `用户_${Math.floor(Math.random() * 10000)}`;
      user.avatar = `/images/avatar.jpg`;
      user.job = '暂无';

      const userAuth = new UserAuth();
      userAuth.identifier = phone;
      userAuth.identity_type = identity_type;
      userAuth.credential = session.verifyCode;

      userAuth.user = user;

      const resUserAuth = await userAuthRepo.save(userAuth);

      const {
        user: { id, nickname, avatar },
      } = resUserAuth;

      session.userId = id;
      session.nickname = nickname;
      session.avatar = avatar;

      await session.save();

      return res.status(200).json({
        code: 0,
        message: '登陆成功',
        data: {
          id,
          nickname,
          avatar,
        },
      });
    }
  } else {
    return res.status(200).json({
      code: -1,
      msg: '验证码错误',
    });
  }
}
