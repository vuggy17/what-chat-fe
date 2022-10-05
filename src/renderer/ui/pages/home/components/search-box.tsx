import { LoadingOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import React, { useState } from 'react';

export default function SearchBox() {
  const [loading, setLoading] = useState(false);
  const searchMessage = (keyword: string) => {
    console.log('Search message', keyword);
  };

  return (
    <Input.Search
      suffix={loading && <LoadingOutlined />}
      placeholder="Type a keyword to search"
      onSearch={searchMessage}
    />
  );
}
