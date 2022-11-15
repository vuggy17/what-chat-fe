/* eslint-disable react/jsx-props-no-spreading */
import { UploadOutlined } from '@ant-design/icons';
import {
  AutoComplete,
  Button,
  Cascader,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Select,
  Upload,
  UploadProps,
} from 'antd';
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { REGISTER_USER } from 'renderer/config/api.routes';
import HttpClient from 'renderer/services/http';
import { BASEURL, LOGIN } from 'renderer/shared/constants';

const { Option } = Select;
const props: UploadProps = {
  name: 'file',
  action: `${BASEURL}/upload`,
  maxCount: 1,
  multiple: false,
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
          message.success({
            content: 'Registration successful. You can now login.',
            key: 'msg_register_success',
          });

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

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select
        disabled
        style={{
          width: 70,
        }}
      >
        <Option value="84">+84</Option>
      </Select>
    </Form.Item>
  );
  const suffixSelector = (
    <Form.Item name="suffix" noStyle>
      <Select
        style={{
          width: 70,
        }}
      >
        <Option value="USD">$</Option>
        <Option value="CNY">¥</Option>
      </Select>
    </Form.Item>
  );
  const [autoCompleteResult, setAutoCompleteResult] = useState([]);

  return (
    <Form
      {...formItemLayout}
      labelAlign="left"
      form={form}
      // layout="vertical".
      name="register"
      onFinish={onFinish}
      initialValues={{
        prefix: '+84',
      }}
      scrollToFirstError
    >
      <Form.Item
        name="username"
        label="Username"
        rules={[
          {
            min: 6,
            max: 20,
            required: true,
            message: 'Please input your E-mail!',
          },
        ]}
      >
        <Input showCount maxLength={20} minLength={6} />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[
          {
            min: 6,
            max: 30,
            required: true,
            message: 'Please input your password!',
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
              if (!value || getFieldValue('password') === value) {
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

      {/* <Form.Item
        name="nickname"
        label="Nickname"
        tooltip="What do you want others to call you?"
        rules={[
          {
            required: true,
            message: 'Please input your nickname!',
            whitespace: true,
          },
        ]}
      >
        <Input />
      </Form.Item> */}

      {/* <Form.Item
        name="phone"
        label="Phone Number"
        rules={[
          {
            required: true,
            message: 'Please input your phone number!',
          },
        ]}
      >
        <Input
          addonBefore={prefixSelector}
          style={{
            width: '100%',
          }}
        />
      </Form.Item> */}

      {/* <Form.Item
        name="gender"
        label="Gender"
        rules={[
          {
            required: true,
            message: 'Please select gender!',
          },
        ]}
      >
        <Select placeholder="select your gender">
          <Option value="male">Male</Option>
          <Option value="female">Female</Option>
          <Option value="other">Other</Option>
        </Select>
      </Form.Item> */}

      {/* <Form.Item name="intro" label="Intro">
        <Input.TextArea showCount maxLength={100} />
      </Form.Item> */}

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
