import dynamic from 'next/dynamic';
import { NextPage } from 'next';
import {  useState, ChangeEvent, useEffect } from 'react';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import styles from './index.module.scss';
import { Button, Input, Select, message } from 'antd';
import request from 'services/fetch';
import { observer } from 'mobx-react-lite';
import { useStore } from 'store';
import { useRouter } from 'next/router';
const Editor = dynamic(() => import('@uiw/react-md-editor'), {
  ssr: false,
});
const NewEditor: NextPage = () => {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [allTags, setAllTags] = useState([]);
  const [tagIds, setTagIds] = useState([]);
  const store = useStore()
  const { push } = useRouter()
  const { userId } = store.user.userInfo
  useEffect(() => {
    request.get('/api/tag/get').then((res: any) => {
      if (res?.code === 0) {
        setAllTags(res?.data?.allTags || [])
      }
    })
  }, []);
  const handleSelectTag = (value: []) => {
    setTagIds(value);
  }
  const handlePublish = () => { 
    if(!title) {
      return message.warning('请输入标题')
    }
    
    request.post('/api/article/publish', {
      title,
      content,
      tagIds
    }).then((res:any) => {
      if(res.code === 0){
        userId ? push(`/user/${userId}`) : push('/')
        message.success('发布成功')
      }else {
        message.error(res?.message || '发布失败')
      }
    })
  };
  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };
  return (
    <div className={styles.container}>
      <div className={styles.operation}>
        <Input
          className={styles.title}
          placeholder="请输入文章标题"
          value={title}
          onChange={handleTitleChange}
        />
        <Select
          className={styles.tag}
          mode="multiple"
          allowClear
          placeholder="请选择标签"
          onChange={handleSelectTag}
        >{allTags?.map((tag: any) => (
          <Select.Option key={tag?.id} value={tag?.id}>{tag?.title}</Select.Option>
        ))}</Select>
        <Button
          className={styles.button}
          type="primary"
          onClick={handlePublish}
        >
          发布
        </Button>
      </div>
      <Editor
        value={content}
        onChange={(value) => setContent(value)}
        height={1080}
      />
    </div>
  );
};

(NewEditor as any).layout = null;

export default observer(NewEditor);
