/* eslint-disable global-require */
/* eslint-disable prefer-destructuring */
/* eslint-disable react/jsx-props-no-spreading */
import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { Dropdown, Menu, Space, Modal, message } from 'antd';
import React, { HtmlHTMLAttributes } from 'react';
import messageController from 'renderer/controllers/message.controller';
import messageManager from 'renderer/data/message.manager';
import { FileMessage } from 'renderer/domain';
import { ipcRenderer } from 'electron';

const { confirm } = Modal;

interface ActionMenuProps extends HtmlHTMLAttributes<HTMLDivElement> {
  chatId: Id;
  messageId: Id;
  actions: Array<'delete' | 'edit' | 'download'>;
}

export default function BubbleActionMenu({
  chatId,
  messageId,
  actions,
  ...props
}: ActionMenuProps) {
  const handleDelete = () => {
    confirm({
      title: 'Are you sure delete this message?',
      icon: <ExclamationCircleOutlined />,
      content: 'Action canot be unverted',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      mask: false,
      centered: true,
      transitionName: '',
      onOk() {
        console.log('OK');
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const handleEdit = () => {
    // open edit image lib
    alert('editing');
    console.log('message edited');
  };

  const download = () => {
    console.log('downloading');
    const file = messageManager.getMessageById(messageId) as FileMessage;

    message.loading({
      key: `download_${file.name}`,
      content: 'Downloading..',
      duration: 3,
    });

    if (file) {
      file.content?.arrayBuffer().then((buffer) => {
        const buff = Buffer.from(buffer);
        window.electron.ipcRenderer.sendMessage('save-file', [file.name, buff]);
        console.log(
          `Saving ${JSON.stringify({ name: file.name, size: file.size })}`
        );
        return null;
      });
    }
  };

  const menuItems = (
    <Menu
      items={actions.map((action) => {
        switch (action) {
          case 'edit':
            return {
              key: 'edit',
              onClick: handleEdit,
              label: (
                <Space>
                  <EditOutlined />
                  Edit
                </Space>
              ),
            };
          case 'download':
            return {
              key: 'download',
              onClick: download,
              label: (
                <Space>
                  <DownloadOutlined />
                  Save
                </Space>
              ),
            };
          default:
            return {
              key: 'delete',
              danger: true,
              onClick: handleDelete,
              label: (
                <Space>
                  <DeleteOutlined />
                  Delete
                </Space>
              ),
            };
        }
      })}
    />
  );

  return (
    <Dropdown overlay={menuItems} trigger={['contextMenu']}>
      <div {...props}>{props.children}</div>
    </Dropdown>
  );
}
