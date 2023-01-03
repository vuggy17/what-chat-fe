/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable promise/catch-or-return */
/* eslint-disable react/jsx-props-no-spreading */
import {
  Avatar,
  Button,
  Divider,
  Input,
  InputRef,
  Layout,
  List,
  Radio,
  Space,
  Tag,
  Typography,
  message,
  Upload,
  Image,
} from 'antd';
import React, { useRef, useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { currentUser } from 'renderer/hooks/use-user';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import {
  CameraOutlined,
  LoadingOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import debounce from 'lodash.debounce';
import { createGroup as createGroupSocket } from 'renderer/usecase/group.usecase';
import CreateGroup from 'renderer/usecase/pipeline/socket.creategroup';
import HttpClient from 'renderer/services/http';
// #region upload group avatar
const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};

const GroupUpload: React.FC<{
  onCompleted: (url: string) => void;
  url: string | null;
}> = ({ onCompleted, url }) => {
  const [uploading, setUploading] = useState(false);

  const customRequest = async ({ file, onError, ...rest }: any) => {
    setUploading(true);
    const uploader = new CreateGroup();
    uploader
      .uploadGroupAvatar(file as File)
      .then((link) => {
        onCompleted(link);
        // message.success('upload successfully.');
        return 1;
      })
      .catch((err) => {
        message.error('upload failed.');
        // console.error(err);
        onError(err);
      })
      .finally(() => {
        setUploading(false);
      });
    return 1;
  };

  const props: UploadProps = {
    beforeUpload: () => {
      return true;
    },
    customRequest,
    multiple: false,
    name: 'avatar',
    listType: 'picture-card',
    showUploadList: false,
  };

  const uploadButton = (
    <div>
      {uploading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Upload {...props}>
      {url ? (
        <div className="bg-black w-full h-full flex items-center justify-center overflow-hidden">
          <img
            src={url || undefined}
            alt="avatar"
            style={{
              minWidth: '100%',
              minHeight: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
      ) : (
        uploadButton
      )}
    </Upload>
  );
};

// #endregion
const SEARCH_DELAY = 200;
export default function NewGroupContent({
  closeModal,
}: {
  closeModal: () => void;
}) {
  const groupNameInput = useRef<InputRef>(null);
  const userRef = useRef<InputRef>(null);
  const userFriends = useRecoilValue(currentUser)?.friends;

  const [searchUser, setSearchUser] = useState(userFriends);
  const [selectedFriend, setSelectedFriend] = useState(new Set<Id>());
  const [avatar, setAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearchUser = debounce(async (e: any) => {
    const res = await HttpClient.get(`/user/friend?name=${e.target.value}`);
    setSearchUser(res.data);
  }, SEARCH_DELAY);

  const createGroup = async () => {
    if (!groupNameInput.current?.input?.value) {
      groupNameInput.current?.focus();
      return;
    }
    if (selectedFriend.size === 0) {
      userRef.current?.focus();
      return;
    }
    setLoading(true);
    // create group
    await createGroupSocket(Array.from(selectedFriend));
    // TODO: create group
    setLoading(false);
    closeModal();
  };
  useEffect(() => {
    groupNameInput.current?.focus({
      cursor: 'all',
    });
  }, []);

  return (
    <div>
      <Layout style={{ background: 'white', minHeight: 500, maxHeight: 500 }}>
        <Space direction="vertical" className="flex-1">
          <span>
            <GroupUpload onCompleted={(url) => setAvatar(url)} url={avatar} />
            <Input
              bordered={false}
              ref={groupNameInput}
              style={{
                padding: '8px 0px 0px 12px',
                height: 38,
              }}
              placeholder="Group name"
            />
            <Divider className="no-margin" />
          </span>
          <Space>
            <Typography.Text strong>Add friend to group</Typography.Text>
            {selectedFriend.size > 0 && (
              <Typography.Text strong className="text-primary">
                ({selectedFriend.size})
              </Typography.Text>
            )}
          </Space>
          <Input
            ref={userRef}
            placeholder="Friend name"
            onChange={handleSearchUser}
            style={{ marginBottom: 12 }}
            suffix={loading ? <LoadingOutlined /> : null}
          />
          <Tag.CheckableTag
            key="all-tag"
            checked
            // onChange={(checked) => handleChange(tag, checked)}
          >
            All
          </Tag.CheckableTag>
          <Divider className="no-margin" />
          <List
            dataSource={searchUser}
            renderItem={(item) => {
              return (
                <List.Item
                  style={{ paddingLeft: 0 }}
                  className="cursor-pointer"
                  onClick={() => {
                    if (selectedFriend.has(item.id)) {
                      selectedFriend.delete(item.id);
                    } else {
                      selectedFriend.add(item.id);
                    }
                    setSelectedFriend(new Set(selectedFriend));
                  }}
                >
                  <Space>
                    <Radio checked={selectedFriend.has(item.id)} />
                    <Space>
                      <Avatar src={item.avatar} />
                      <Typography.Text>{item.name}</Typography.Text>
                    </Space>
                  </Space>
                </List.Item>
              );
            }}
          />
        </Space>
        <div>
          <span className="w-full flex justify-end gap-2">
            <Button onClick={closeModal}>Cancel</Button>
            <Button
              type="primary"
              disabled={selectedFriend.size === 0}
              onClick={() => createGroup()}
              loading={loading}
            >
              Create group
            </Button>
          </span>
        </div>
      </Layout>
    </div>
  );
}
