/* eslint-disable react/require-default-props */
import React, { useEffect, useState } from 'react';

interface AppSwitchProps extends HasChildren {
  onChange?: (checked: boolean) => void;
  CheckedComponent: ({
    toggleState,
  }: {
    toggleState: () => void;
  }) => JSX.Element;
  defaultChecked?: boolean;
}

export default function AppSwitch({
  onChange,
  CheckedComponent,
  defaultChecked,
  ...props
}: AppSwitchProps) {
  const [checked, setChecked] = useState(defaultChecked || false);

  const handleComponentClick = () => {
    const nextState = !checked;
    if (typeof onChange === 'function') onChange(nextState);
    setChecked(nextState);
  };

  useEffect(() => {
    setChecked(defaultChecked || false);
  }, [defaultChecked]);

  if (checked) return <CheckedComponent toggleState={handleComponentClick} />;
  return (
    <>
      {props.children({
        toggleState: handleComponentClick,
      })}
    </>
  );
}
