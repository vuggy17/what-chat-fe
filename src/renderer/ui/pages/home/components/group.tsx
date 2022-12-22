import Modal from 'antd/es/modal/Modal';
import React from 'react';
import NewGroupContent from './new-group';

/**
 * new group chat layout
 * @returns JSX.Element
 */
export default function Group({
  open,
  toggleOpen,
}: {
  open: boolean;
  toggleOpen: () => void;
}) {
  return (
    <Modal
      key={Math.random()}
      title="Create new group"
      centered
      open={open}
      onCancel={toggleOpen}
      // okText="Create group"
      footer={null}
    >
      <NewGroupContent closeModal={toggleOpen} />
    </Modal>
  );
}
