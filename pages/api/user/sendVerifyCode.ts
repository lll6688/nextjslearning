import { format } from 'date-fns';
import { NextApiRequest, NextApiResponse } from 'next';
import md5 from 'md5';
import { encode } from 'js-base64';
import requestInstance from 'services/fetch';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config';
import { ISession } from '..'; 
export default withIronSessionApiRoute(sendVerfifyCode, ironOptions);
async function sendVerfifyCode(req: NextApiRequest, res: NextApiResponse) {
  let session: ISession = req.session
  const { to = '', templateId } = req.body;
  const AccountId = '2c94811c865849b80186af98cde11203';
  const AuthToken = 'de9d4637a9e34b8c8de5acb53c842c42';
  const NowDate = format(new Date(), 'yyyyMMddHHmmss');
  const SigParameter = md5(`${AccountId}${AuthToken}${NowDate}`);
  const AppId = '2c94811c865849b80186af98cecd120a';
  const Authorization = encode(`${AccountId}:${NowDate}`);
  const verifyCode = Math.floor(Math.random() * (9999 - 1000)) + 1000;
  const expireMinute = 5;
  const url = `https://app.cloopen.com:8883/2013-12-26/Accounts/${AccountId}/SMS/TemplateSMS?sig=${SigParameter}`;

  const response = await requestInstance.post(
    url,
    {
      to,
      templateId,
      appId: AppId,
      datas: [verifyCode, expireMinute],
    },
    {
      headers: {
        Authorization,
      },
    }
  );
  const { statusCode, statusMsg, TemplateSMS } = response as any
  if(statusCode === '000000') {
    console.log(verifyCode);
    session.verifyCode = verifyCode
    await session.save()
    return res.status(200).json({
      code: 0,
      msg: statusMsg,
      data: {
        TemplateSMS
      }
    })
  }else {
    return res.status(200).json({
      code: statusCode,
      msg: statusMsg
    })
  }
}
