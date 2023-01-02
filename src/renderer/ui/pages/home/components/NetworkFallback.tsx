import { Avatar, Skeleton } from 'antd';
import React from 'react';

export function NetworkFallback() {
  const fallback = new Array(4).fill(0).map((_, i) => (
    <li>
      <Avatar style={{ backgroundColor: '#f56a00' }} />
      <Skeleton.Input />
    </li>
  ));

  return <ul>{fallback}</ul>;
}
