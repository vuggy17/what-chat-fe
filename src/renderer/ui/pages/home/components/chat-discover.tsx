import { Avatar, Select, SelectProps, Spin, Tag, Typography } from 'antd';
import React, { useMemo, useRef, useState } from 'react';
import debounce from 'lodash.debounce';
import { faker } from '@faker-js/faker';
import type { CustomTagProps } from 'rc-select/lib/BaseSelect';

// Usage of DebounceSelect
interface UserValue {
  label: string;
  value: string;
}

export interface DebounceSelectProps<ValueType = any>
  extends Omit<SelectProps<ValueType | ValueType[]>, 'options' | 'children'> {
  fetchOptions: (search: string) => Promise<ValueType[]>;
  debounceTimeout?: number;
}

const tagRender = (props: CustomTagProps) => {
  const { label, value, closable, onClose } = props;
  const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <Tag
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      className="py-2 px-2 w-fit text-sm"
    >
      <Typography.Text strong>{label}</Typography.Text>
    </Tag>
  );
};

export default function ChatDiscover<
  ValueType extends {
    key?: string;
    label: React.ReactNode;
    value: string | number;
    avatar: string;
  } = any
>({ fetchOptions, debounceTimeout, ...props }: DebounceSelectProps<ValueType>) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState<ValueType[]>([]);
  const fetchRef = useRef(0);

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value: string) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);

      fetchOptions(value)
        .then((newOptions) => {
          if (fetchId !== fetchRef.current) {
            // for fetch callback order
            return -1;
          }

          setOptions(newOptions);
          setFetching(false);
          return 0;
        })
        .catch((err) => console.error(err));
    };

    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout]);

  return (
    <Select
      labelInValue
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      dropdownAlign={{
        offset: [0, 20],
      }}
      tagRender={tagRender}
      optionLabelProp="label"
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    >
      {options.map((opt) => (
        <Select.Option value={opt.value} label={opt.label} key={opt.value}>
          <div className="flex items-center gap-2">
            <Avatar src={opt.avatar} />
            <Typography.Text>{opt.label}</Typography.Text>
          </div>
        </Select.Option>
      ))}
    </Select>
  );
}

ChatDiscover.defaultProps = {
  debounceTimeout: 300,
};
