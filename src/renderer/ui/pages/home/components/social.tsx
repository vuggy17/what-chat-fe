import { Modal } from 'antd';
import SocialContent from './social-content';

export default function Social({
  open,
  toggleOpen,
}: {
  open: boolean;
  toggleOpen: () => void;
}) {
  return (
    <Modal
      key={Math.random()}
      title="Find a friend"
      centered
      open={open}
      onCancel={toggleOpen}
      // okText="Create group"
      footer={null}
    >
      <SocialContent handleClose={toggleOpen} />
    </Modal>
  );
}
