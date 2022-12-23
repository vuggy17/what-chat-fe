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
} from 'antd';
import React, { useRef, useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { currentUser } from 'renderer/hooks/use-user';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { CameraOutlined, LoadingOutlined } from '@ant-design/icons';
import debounce from 'lodash.debounce';
import { createGroup as createGroupSocket } from 'renderer/usecase/group.usecase';
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

const GroupUpload: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();

  const handleChange: UploadProps['onChange'] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as RcFile, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <CameraOutlined className="text-lg" />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Upload
      name="avatar"
      listType="picture-card"
      showUploadList={false}
      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
      beforeUpload={beforeUpload}
      onChange={handleChange}
    >
      {imageUrl ? (
        <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
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
  const [selectedFriend, setSelectedFriend] = useState(new Set<Id>());
  const [loading, setLoading] = useState(false);

  const handleSearchUser = debounce((e: any) => {
    console.log('seaching', e.target.value);
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
      <Layout style={{ background: 'white', minHeight: 500 }}>
        <Space direction="vertical" className="flex-1">
          <span>
            <GroupUpload />
            <Input
              bordered={false}
              ref={groupNameInput}
              style={{
                padding: '8px 0px',
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
            dataSource={userFriends}
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
