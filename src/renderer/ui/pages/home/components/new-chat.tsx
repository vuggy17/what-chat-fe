import { Divider, Typography } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { CHAT, FRIEND } from 'renderer/config/api.routes';
import { Chat, MessageWithTotalCount } from 'renderer/domain';
import User from 'renderer/domain/user.entity';
import { activeChatIdState } from 'renderer/hooks/use-chat';
import { currentUser } from 'renderer/hooks/use-user';
import HttpClient from 'renderer/services/http';
import ChatBox from '../pages/chat-box';
import ChatDiscover from './chat-discover';
import StateFullMessageList from './message-list';

interface UserValue {
  label: string;
  value: string;
  avatar: string;
}

type ChatResponse = {
  chat: Chat;
  message: MessageWithTotalCount;
};

async function fetchUserFriend(username: string): Promise<UserValue[]> {
  return axios.get<User[]>(`${FRIEND}?name=${username}`).then((res) => {
    return res.data.map((user: User) => {
      return {
        label: user.name,
        value: user.id,
        avatar: user.avatar,
      };
    });
  });
}

const DEFAULT_CHAT: Chat = {
  id: 'default_chat_id',
  participants: [],
  name: '',
  lastUpdate: Date.now(),
};

const DEFAULT_VALUE = {
  chat: DEFAULT_CHAT,
  message: {
    total: 0,
    data: [],
  },
};
export default function NewChat() {
  const [values, setValue] = useState<UserValue[]>([]);
  const [chatSubject, setChatSubject] = useState<ChatResponse>(DEFAULT_VALUE);
  const user = useRecoilValue(currentUser);
  const [hasEditor, setHasEditor] = useState(false);

  useEffect(() => {
    // find chat with <user_name>
    if (values.length === 1) {
      (async () => {
        // console.log('====================================');
        // console.log('fetch chat with user', values[0].label);
        // console.log('====================================');
        const chat = await HttpClient.get<ChatResponse>(
          `${CHAT}/${values[0].value}`
        );

        // console.log('====================================');
        // console.log('chat', chat.data);
        // console.log('====================================');
        setChatSubject(chat.data);
        setHasEditor((editorOn) => !editorOn);
      })();
    }
  }, [values]);

  return (
    <div className="h-full w-screen ">
      <ChatBox
        chat={chatSubject.chat}
        hasSearch={false}
        header={
          <>
            <table className="mt-6 w-full ">
              <tbody>
                <tr>
                  <td
                    style={{
                      width: 40,
                      paddingLeft: '1rem',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <Typography.Text strong>To :</Typography.Text>
                  </td>
                  <td colSpan={2}>
                    <ChatDiscover
                      size="large"
                      bordered={false}
                      style={{ width: '100%' }}
                      mode="multiple"
                      placeholder="Type a name"
                      value={values}
                      fetchOptions={fetchUserFriend}
                      onChange={(newValue) => setValue(newValue as UserValue[])}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <Divider className="my-0" />
          </>
        }
        hasEditor={hasEditor}
        messagesContainer={
          chatSubject === DEFAULT_VALUE ? null : (
            <StateFullMessageList chat={chatSubject.chat} />
          )
        }
      />
    </div>
  );
}
