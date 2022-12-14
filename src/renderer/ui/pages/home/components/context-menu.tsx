/* eslint-disable global-require */
/* eslint-disable prefer-destructuring */
/* eslint-disable react/jsx-props-no-spreading */
import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { Dropdown, Space, Modal, message, MenuProps } from 'antd';
import { HtmlHTMLAttributes, useRef } from 'react';
import { MessageBubbleProps } from './type';

const { confirm } = Modal;
interface ActionMenuProps extends HtmlHTMLAttributes<HTMLDivElement> {
  actions: Array<'delete' | 'edit' | 'download'>;
  msg: MessageBubbleProps;
  // onDownload?: (
  //   percentage: number,
  //   transferredBytes?: number,
  //   totalBytes?: number
  // ) => void;
  // onCompleted?: (payload: DownloadFileCompletedPayload) => void;
}

export default function BubbleActionMenu({
  actions,
  // onDownload,
  msg,
  ...props
}: ActionMenuProps) {
  const { chatId, id, ...restProperties } = msg;
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
  const notiRef = useRef<string>('');

  const handleEdit = () => {
    // open edit image lib
    alert('editing');
    console.log('message edited');
  };

  const download = () => {
    notiRef.current = `download_${restProperties.name}`;
    message.loading({
      key: notiRef.current,
      content: 'Downloading..',
      duration: 3,
    });

    if (restProperties.attachments instanceof File) {
      restProperties.attachments?.arrayBuffer().then((buffer) => {
        const buff = Buffer.from(buffer);
        window.electron.ipcRenderer.sendMessage(
          'save-file',
          restProperties.name,
          buff
        );
        message.destroy(notiRef.current);

        console.log(
          `Saving ${JSON.stringify({
            name: restProperties.name,
            size: restProperties.size,
          })}`
        );
        return null;
      });
    } else {
      console.log(notiRef.current);
      message.destroy(notiRef.current);
      window.electron.ipcRenderer.sendMessage('download-url', {
        url: restProperties.attachments,
      });
      // console.error('Download attachments is a link is not supported yet');
      // message.info('Download attachments is a link is not supported yet');
    }
  };

  const menuItems: MenuProps['items'] = actions.map((action) => {
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
  });

  return (
    <Dropdown menu={{ items: menuItems }} trigger={['contextMenu']}>
      <div {...props}>{props.children}</div>
    </Dropdown>
  );
}
