import { NextPage } from 'next';
import styles from './index.module.scss';
import { navs } from './config';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button, Avatar, Dropdown, Menu, message } from 'antd';
import { useState } from 'react';
import Login from '../login';
import { useStore } from 'store';
import { LoginOutlined, HomeOutlined } from '@ant-design/icons';
import request from 'services/fetch';
import { observer } from 'mobx-react-lite';
const Navbar: NextPage = () => {
  const store = useStore();
  const { userId, avatar } = store.user.userInfo;
  const { push, pathname } = useRouter();
  const [isShowLogin, setIsShowLogin] = useState(false);
  const handleGoToEditorPage = () => {
    if (userId) {
      push('/editor/new');
    } else {
      message.warning('请先登录');
    }
  };
  const handleLogin = () => {
    setIsShowLogin(true);
  };
  const handleClose = () => {
    setIsShowLogin(false);
  };

  const handleLogout = () => {
    request.post('/api/user/logout').then((res: any) => {
      if (res.code === 0) {
        store.user.setUserInfo({});
      }
    });
  };
  const handleGotoPersonalPage = () => {
    console.log(123);
    push(`/user/${userId}`);
  };
  const renderDropDownMenu = () => {
    return (
      <Menu>
        <Menu.Item onClick={handleGotoPersonalPage}>
          <HomeOutlined /> &nbsp;个人主页
        </Menu.Item>
        <Menu.Item onClick={handleLogout}>
          <LoginOutlined />
          &nbsp; 退出登陆
        </Menu.Item>
      </Menu>
    );
  };
  return (
    <div className={styles.navbar}>
      <section className={styles.logoArea}>BLOG-C</section>
      <section className={styles.linkArea}>
        {navs?.map((nav) => (
          <Link key={nav.label} href={nav.value}>
            <a className={pathname === nav.value ? styles.active : ''}>
              {nav?.label}
            </a>
          </Link>
        ))}
      </section>
      <section className={styles.opreationArea}>
        <Button onClick={handleGoToEditorPage}>写文章</Button>
        {userId ? (
          <>
            <Dropdown overlay={renderDropDownMenu()} placement="bottomLeft">
              <Avatar src={avatar} size={38}></Avatar>
            </Dropdown>
          </>
        ) : (
          <Button type="primary" onClick={handleLogin}>
            登陆
          </Button>
        )}
      </section>
      <Login isShow={isShowLogin} onClose={handleClose} />
    </div>
  );
};

export default observer(Navbar);
