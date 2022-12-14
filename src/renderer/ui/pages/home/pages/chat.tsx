import {
  Button,
  Divider,
  Input,
  InputRef,
  Layout,
  Tooltip,
  Typography,
} from 'antd';
import { Suspense, useEffect, useRef, useState } from 'react';

import Icon, {
  CloseOutlined,
  FormOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  Outlet,
  Route,
  Routes,
  createSearchParams,
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import useDebounce from 'renderer/utils/debouce';
import HttpClient from 'renderer/services/http';
import axios from 'axios';
import { serialize } from 'v8';
import { SearchChatProvider, useSearchChatResult } from 'renderer/hooks/use-ui';
import { useRecoilValue } from 'recoil';
import { currentChatIdState, currentChatQuery } from 'renderer/hooks/new-store';
import Conversations from '../components/conversations';
import { ReactComponent as IconMenu } from '../../../../../../assets/icons/menu.svg';
import RecentChat from '../components/recent-chat';
import SearchResult from './search';
import Drawer from '../components/drawer';

const { Header, Sider, Content } = Layout;

function Suffix({
  onClick,
  parentFocused,
}: {
  onClick: () => void;
  parentFocused: boolean;
}) {
  console.log('pr', parentFocused);
  return parentFocused ? (
    <CloseOutlined
      className="text-gray-1 cursor-pointer hover:text-primary duration-150 rotate-180"
      onClick={onClick}
    />
  ) : (
    <SearchOutlined className="text-gray-1" />
  );
}

export default function Chat() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef<InputRef>(null);

  const [searchValue, setSearchValue] = useState('');
  const { setResults } = useSearchChatResult();
  const currentChat = useRecoilValue(currentChatQuery);

  const findChat = async (key: string) => {
    if (!key) {
      if (location.pathname.includes('search')) navigate(-1);
      return;
    }
    const res = await axios.get(
      `/chat/group-or-user?key=${key}&current=${currentChat.id}&isGroup=${currentChat.isGroup}`
    );
    setResults(res.data);
  };

  const debounceSearch = useDebounce(findChat, 500);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (searchRef.current && location.pathname.includes('search')) {
      searchRef.current.focus();
    }
  });

  return (
    <Layout className="h-full" style={{ background: 'white' }}>
      <Layout className="h-full rounded-xl bg-[#f3f3f3]" hasSider>
        <Sider
          theme="light"
          style={{ background: 'white' }}
          width={280}
          collapsedWidth={110}
          breakpoint="lg"
        >
          {/* search box */}
          <div className="mx-2 flex gap-1 items-center py-2 ">
            <Button
              type="text"
              style={{ margin: '6px 4px' }}
              icon={
                <Icon
                  onClick={() => setOpen((opened) => !opened)}
                  component={IconMenu}
                  style={{ fontSize: 18 }}
                />
              }
            />
            <Input
              bordered={false}
              ref={searchRef}
              value={searchValue}
              onClick={() => {
                if (!location.pathname.includes('search')) {
                  navigate({
                    pathname: 'search',
                    search: createSearchParams({
                      chatOnly: 'true',
                    }).toString(),
                  });
                }
              }}
              onChange={(e) => {
                setSearchValue(e.target.value);
                debounceSearch(e.target.value);
              }}
              style={{
                paddingInline: 8,
                background: '#d9d9d990',
                height: 38,
              }}
              placeholder="Search a chat or message"
              className="input-transparent focus-within:ring-2 ring-primary"
              suffix={
                <Suffix
                  onClick={() => {
                    navigate(-1);
                    setSearchValue('');
                    // if (searchRef.current?.input) {
                    // searchRef.current.focus();
                    // }
                  }}
                  parentFocused={location.pathname.includes('search')}
                />
              }
            />
          </div>
          <div>
            <Routes>
              <Route index element={<Conversations />} />
              <Route path="search" element={<SearchResult />} />
            </Routes>
            <Outlet />
          </div>
        </Sider>

        <Divider type="vertical" className="h-full mx-0" />
        <RecentChat />
      </Layout>
      <Drawer
        open={open}
        toggleVisibility={() => setOpen((opened) => !opened)}
      />
    </Layout>
  );
}
