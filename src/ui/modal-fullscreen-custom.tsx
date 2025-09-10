import { Modal } from 'antd';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import './modal-fullscreen-custom.scss';
export interface ModalFullScreenCustomRef {
  open: () => void;
  close: () => void;
  getVisible: () => boolean;
}

interface ModalFullScreenCustomProps {
  title?: string;
  children?: React.ReactNode;
  autoOpen?: boolean;
}

const ModalFullScreenCustom = forwardRef<
  ModalFullScreenCustomRef,
  ModalFullScreenCustomProps
>(({ title, autoOpen, children }, ref) => {
  const [visible, setVisible] = useState<boolean>(!!autoOpen);

  useImperativeHandle(ref, () => ({
    open: () => setVisible(true),
    close: () => setVisible(false),
    getVisible: () => !!visible,
  }));

  return (
    <Modal
      className={`ct_ant_modal_content !border-0 !max-w-full !top-0 !h-full xsm:!m-0 !rounded-none`}
      width="100%"
      title={title}
      visible={visible}
      onCancel={() => {
        close();
      }}
      footer={false}
      closable={false}
    >
      <div
        style={{
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#fff',
        }}
      >
        {children}
      </div>
    </Modal>
  );
});

export default ModalFullScreenCustom;
