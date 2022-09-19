import { LoadingOutlined } from '@ant-design/icons';
import { Navigate } from 'react-router-dom';

import { LOGIN, PRIMARY_COLOR } from './constants';

const LoginCheckPoint = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-slate-200">
      <div className="bg-white shadow flex flex-col rounded justify-between p-6 gap-3 h-[450px] w-[364px]">
        <h2 className="font-bold text-3xl rounded text-center mb-2 mt-8 tracking-wide text-orange-600">
          ZaChat
        </h2>
        <div className="flex flex-col items-center mb-32 gap-4">
          Loggin in
          <LoadingOutlined
            style={{ color: PRIMARY_COLOR, fontSize: '1.5rem' }}
          />
        </div>
      </div>
      {/* <AuthProvider>
        <LoginCheckPoint />
      </AuthProvider> */}
      {/* <Navigate to={LOGIN} /> */}
    </div>
  );
};
/// xuwr li bat dong vo o dau, js engine, js chay nhu the nao, xem lai v8 goole,    settimeout async chay the nao, xu li bt dong bo o dau, life cycle, so sanh cac loai db

export default LoginCheckPoint;
