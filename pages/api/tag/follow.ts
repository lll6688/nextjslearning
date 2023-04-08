import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config/index';
import { ISession } from 'pages/api/index';
import { prepareConnection } from 'db/index';
import { User, Tag } from 'db/entity/index';
import { EXCEPTION_USER, EXCEPTION_TAG } from 'pages/api/config/codes';

export default withIronSessionApiRoute(follow, ironOptions);

async function follow(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  const { type, tagId } = req.body;
  const { userId } = session;
  const db = await prepareConnection();
  const tagRepo = db.getRepository(Tag);
  const userRepo = db.getRepository(User);

  const user = await userRepo
    .createQueryBuilder('User')
    .where('user.id = :userId', { userId })
    .getOne();

  console.log(user);
  const tag = await tagRepo.findOne({
    relations: ['users'],
    where: {
      id: tagId,
    },
  });

  if (!user) {
    res?.status(200).json({
      ...EXCEPTION_USER?.NOT_LOGIN,
    });
    return;
  }

  if (tag?.users) {
    if (type === 'follow') {
      tag.users = tag?.users?.concat([user]);
      tag.follow_count = tag?.follow_count + 1;
    } else if (type === 'unfollow') {
      tag.users = tag?.users?.filter((user) => user.id !== userId);
      tag.follow_count = tag?.follow_count - 1;
    }
  }

  if (tag) {
    const resTag = await tagRepo?.save(tag);
    console.log(resTag);
    res?.status(200)?.json({
      code: 0,
      msg: '',
      data: resTag,
    });
  } else {
    res?.status(200)?.json({
      ...EXCEPTION_TAG?.FOLLOW_FAILED,
    });
  }
}
