/* eslint-disable promise/catch-or-return */
/* eslint-disable react/jsx-props-no-spreading */
import { UploadOutlined } from '@ant-design/icons';
import {
  Button,
  Form,
  Input,
  message,
  Select,
  Upload,
  UploadProps,
} from 'antd';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASEURL, LOGIN } from 'renderer/shared/constants';
import CreateGroup from 'renderer/usecase/pipeline/socket.creategroup';

function hashCode(s: string) {
  return s.split('').reduce(function (a, b) {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);
}

const props: UploadProps = {
  name: 'file',
  maxCount: 1,
  multiple: false,
  action: `${BASEURL}/upload-single`,
  onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.destroy('msg_register_forcewait');
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.destroy('msg_register_forcewait');
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

const formItemLayout = {
  labelCol: {
    xs: {
      span: 2,
    },
    sm: {
      span: 5,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 24,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

type RegisterPayload = {
  username: string;
  password: string;
  repeatPassword: string;
  name: string;
  avatar: any;
};

const Register = () => {
  const [form] = Form.useForm<RegisterPayload>();
  const navigate = useNavigate();
  const [formLoading, setLoading] = useState(false);
  const onFinish = (values: RegisterPayload) => {
    try {
      const avatarUrl = values.avatar.file.response.url;
      setLoading(true);
      axios
        .post('/user/register', {
          ...values,
          avatar: avatarUrl,
        })
        .then((res) => {
          message.destroy('msg_register_forcewait');
          // message.success({
          //   content: 'Registration successful. You can now login.',
          //   key: 'msg_register_success',
          // });

          setTimeout(() => {
            message.destroy('msg_register_success');
            navigate(`/${LOGIN}`);
          }, 700);
          return -1;
        })
        .catch((err) => {
          message.error('Register failed, please try again');
          setLoading(false);
        });
    } catch (error) {
      message.info({
        content: 'Please wait until avatar is uploaded',
        key: 'msg_register_forcewait',
      });
    }
  };

  return (
    <Form
      {...formItemLayout}
      labelAlign="left"
      form={form}
      labelWrap
      // layout="vertical".
      name="register"
      onFinish={onFinish}
      initialValues={{
        prefix: '+84',
      }}
      scrollToFirstError
    >
      <Form.Item
        name="name"
        label="Name"
        tooltip="What do you want others to call you?"
        rules={[
          {
            required: true,
            message: 'Please input your name!',
            whitespace: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="username"
        label="Username"
        rules={[
          {
            required: true,
            message: 'Please input your username!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[
          {
            min: 6,
            max: 30,
            required: true,
            message: 'Password must be between 6 and 30 characters!',
          },
        ]}
        hasFeedback
      >
        <Input.Password showCount maxLength={30} minLength={6} />
      </Form.Item>

      <Form.Item
        name="confirm"
        label="Confirm Password"
        dependencies={['password']}
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Please confirm your password!',
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              // hash password
              if (!value || getFieldValue('password') === value) {
                hashCode(value);
                console.log('hashcode', hashCode(value));
                return Promise.resolve();
              }

              return Promise.reject(
                new Error('The two passwords that you entered do not match!')
              );
            },
          }),
        ]}
      >
        <Input.Password showCount maxLength={30} minLength={6} />
      </Form.Item>

      <Form.Item
        name="avatar"
        label="Avatar"
        rules={[
          {
            required: true,
            message: 'Please upload avatar!',
          },
        ]}
      >
        <Upload {...props}>
          <Button icon={<UploadOutlined />}>Click to upload</Button>
        </Upload>
      </Form.Item>
      <br />
      <Form.Item {...tailFormItemLayout}>
        <Button
          type="primary"
          htmlType="submit"
          style={{ marginRight: 8 }}
          loading={formLoading}
        >
          Register
        </Button>
        <Button
          htmlType="button"
          onClick={() => {
            form.resetFields();
          }}
        >
          Reset
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Register;
