/* eslint-disable react/require-default-props */
import React, { useEffect, useState } from 'react';

interface AppSwitchProps extends HasChildren {
  onChange?: (checked: boolean) => void;
  CheckedComponent: (props: any) => JSX.Element;
  defaultChecked?: boolean;
}

export default function AppSwitch({
  onChange,
  CheckedComponent,
  defaultChecked = false,
  ...props
}: AppSwitchProps) {
  const [checked, setChecked] = useState(defaultChecked);

  const handleComponentClick = () => {
    setChecked(!checked);
  };

  useEffect(() => {
    if (typeof onChange === 'function') onChange(checked);
  }, [checked, onChange]);

  if (checked) return <CheckedComponent toggleState={handleComponentClick} />;
  return (
    <>
      {props.children({
        toggleState: handleComponentClick,
      })}
    </>
  );
}
