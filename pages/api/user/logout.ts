import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ISession } from '..';
import { ironOptions } from 'config';

import { Cookie } from 'next-cookie';
import { clearCookies } from 'utils';

export default withIronSessionApiRoute(logout, ironOptions);

export async function logout(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  const cookies = Cookie.fromApiRoute(req, res);

  await session.destroy();

  clearCookies(cookies);

  res.status(200).json({
    code: 0,
    msg: '退出成功',
    data: {},
  });
}
