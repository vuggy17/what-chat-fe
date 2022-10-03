/* eslint-disable global-require */
/* eslint-disable prefer-destructuring */
/* eslint-disable react/jsx-props-no-spreading */
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { Dropdown, Menu, Space, Modal } from 'antd';
import { BrowserWindow } from 'electron';
import React, { HtmlHTMLAttributes } from 'react';

const { confirm } = Modal;

interface ActionMenuProps extends HtmlHTMLAttributes<HTMLDivElement> {
  chatId: Id;
  messageId: Id;
  actions: Array<'delete' | 'edit'>;
}

export default function BubbleActionRightClickContext({
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
    console.log('message edited');
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
