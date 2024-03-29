import { prepareConnection } from 'db';

import { Article, Tag } from 'db/entity';
import ListItem from 'components/listItem';
import styles from './index.module.scss';
import { Divider } from 'antd';
import classnames from 'classnames';
import { useEffect, useState } from 'react';
import request from 'services/fetch';
import { IArticle } from './api';

interface ITag {
  id: number;
  title: string;
}

interface IProps {
  articles: IArticle[];
  tags: ITag[];
}

export async function getServerSideProps() {
  const db = await prepareConnection();
  const articles = await db.getRepository(Article).find({
    relations: ['user'],
  });

  const tags = await db.getRepository(Tag).find({
    relations: ['users'],
  });

  return {
    props: {
      articles: JSON.parse(JSON.stringify(articles)) || [],
      tags: JSON.parse(JSON.stringify(tags)) || [],
    },
  };
}

const Home = (props: IProps) => {
  const { articles, tags } = props;
  const [selectTag, setSelectTag] = useState(0);
  const [showAricles, setShowAricles] = useState([...articles]);

  const handleSelectTag = (event: any) => {
    const { tagid } = event?.target?.dataset || {};
    setSelectTag(Number(tagid));
  };

  useEffect(() => {
    selectTag &&
      request.get(`/api/article/get?tag_id=${selectTag}`).then((res: any) => {
        if (res?.code === 0) {
          setShowAricles(res?.data);
        }
      });
  }, [selectTag]);

  return (
    <div>
      <div className={styles.tags} onClick={handleSelectTag}>
        {tags?.map((tag) => (
          <div
            key={tag?.id}
            data-tagid={tag?.id}
            className={classnames(
              styles.tag,
              selectTag === tag?.id ? styles['active'] : ''
            )}
          >
            {tag?.title}
          </div>
        ))}
      </div>
      <div className="content-layout">
        {showAricles?.map((article) => (
          <>
            <ListItem article={article} />
            {/* <DynamicComponent article={article} /> */}
            <Divider />
          </>
        ))}
      </div>
    </div>
  );
};

export default Home;
