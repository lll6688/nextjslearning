import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ISession } from '..';
import { ironOptions } from 'config';

import { prepareConnection } from 'db';
import { Article, User, Tag } from 'db/entity';
import { EXCEPTION_ARTICLE } from '../config/codes';

export default withIronSessionApiRoute(publish, ironOptions);

export async function publish(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  const { tagIds = [], title = '', content = '' } = req.body;

  const db = await prepareConnection();

  const userRepo = db.getRepository(User);

  const articleRepo = db.getRepository(Article);

  const tagRepo = db.getRepository(Tag);

  const tags = await tagRepo
    .createQueryBuilder('tag')
    .where('tag.id IN (:...ids)', { ids: tagIds })
    .getMany();
  console.log(tags);
  const article = new Article();

  article.title = title;
  article.content = content;
  article.create_time = new Date();
  article.update_time = new Date();

  article.views = 0;

  article.is_delete = 0;

  const user = await userRepo.findOne({
    where: { id: session.userId },
  });

  if (user) {
    article.user = user;
  }

  if (tags) {
    const newTags = tags?.map((tag) => {
      tag.article_count = tag?.article_count + 1;
      return tag;
    });
    article.tags = newTags;
  }
  const resArticle = await articleRepo.save(article);

  if (resArticle) {
    res.status(200).json({
      code: 0,
      message: '发布成功',
      data: resArticle,
    });
  } else {
    res.status(200).json({
      ...EXCEPTION_ARTICLE.PUBLISH_FAILED,
      data: 0,
    });
  }
}
