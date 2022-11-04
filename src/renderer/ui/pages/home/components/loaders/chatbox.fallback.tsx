import { Skeleton, Space } from 'antd';
import { randomNumber } from 'renderer/utils/common';
import Input from '../input';
import HeaderFallback from './header.fallback';

export default function ChatBoxFallback() {
  return (
    <div className=" flex flex-col min-h-0 h-full pb-4 pr-2">
      <HeaderFallback />
      <div className="flex-auto relative pl-4 pr-3 transition-all transform duration-700 overflow-hidden">
        {/* if switching lists, unmount virtuoso so internal state gets reset */}
        {Array.from({ length: randomNumber(3, 7) }).map((_, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <div className="mt-5" key={`message-sk-${i}`}>
            <Space className="w-full">
              <Skeleton.Avatar shape="circle" size={40} />
              <Skeleton.Input block={randomNumber(1, 3) === 1} active />
            </Space>
          </div>
        ))}
      </div>
      <Input onSubmit={() => console.log('im just a placeholder')} />
    </div>
  );
}
