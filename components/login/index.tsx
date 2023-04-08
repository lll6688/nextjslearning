import styles from './index.module.scss';
import { ChangeEvent, useState } from 'react';
import Countdown from '../countdown/countdown';
import { message } from 'antd';
import request from 'services/fetch';
import { useStore } from '../../store/index';
import { observer } from 'mobx-react-lite';
import { oauthOptions } from 'config';
interface IProps {
  isShow: boolean;
  onClose: Function;
}

const Login = (props: IProps) => {
  const { isShow = false, onClose } = props;
  const store = useStore();
  const [isShowVerifyCode, setIsShowVerifyCode] = useState(false);
  const [form, setForm] = useState({
    phone: '',
    verify: '',
  });
  const handleClose = () => {
    onClose && onClose();
  };
  const handleGetVerifyCode = () => {
    if (!form.phone) {
      return message.warning('请输入手机号');
    }

    request
      .post('/api/user/sendVerifyCode', {
        to: form.phone,
        templateId: 1,
      })
      .then((res: any) => {
        if (res.code === 0) {
          setIsShowVerifyCode(true);
        } else {
          message.error(res?.msg || '未知错误');
        }
      });
  };
  const handleLogin = () => {
    request
      .post('/api/user/login', {
        ...form,
        identity_type: 'phone',
      })
      .then((res: any) => {
        if (res?.code === 0) {
          /// 登陆成功
          console.log(res.data);
          store.user.setUserInfo(res.data);
          console.log(store);
          onClose && onClose();
        } else {
          message.error(res.msg || '未知错误');
        }
      });
  };
  const handleOAuthGithub = () => {
    const githubClientid = oauthOptions.github.client_id;
    window.open(
      `https://github.com/login/oauth/authorize?client_id=${githubClientid}`
    );
  };

  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };
  const handleCountdownEnd = () => {
    setIsShowVerifyCode(false);
  };
  return isShow ? (
    <div className={styles.loginArea}>
      <div className={styles.loginBox}>
        <div className={styles.loginTitle}>
          <div>手机号登陆</div>
          <div className={styles.close} onClick={handleClose}>
            X
          </div>
        </div>
        <input
          name="phone"
          type="text"
          placeholder="请输入手机号"
          value={form.phone}
          onChange={handleFormChange}
        />
        <div className={styles.verifyCodeArea}>
          <input
            name="verify"
            type="text"
            placeholder="请输入验证码"
            value={form.verify}
            onChange={handleFormChange}
          />
          <span className={styles.verifyCode} onClick={handleGetVerifyCode}>
            {isShowVerifyCode ? (
              <Countdown time={10} onEnd={handleCountdownEnd} />
            ) : (
              '获取验证码'
            )}
          </span>
        </div>
        <div className={styles.loginBtn} onClick={handleLogin}>
          登陆
        </div>
        <div className={styles.otherLogin} onClick={handleOAuthGithub}>
          使用github登陆
        </div>
        <div className={styles.loginPrivacy}>
          注册登陆即表示同意
          <a
            href="https://moco.imooc.com/privacy.html"
            target="_blank"
            rel="noreferrer"
          >
            隐私政策
          </a>
        </div>
      </div>
    </div>
  ) : null;
};

export default observer(Login);
