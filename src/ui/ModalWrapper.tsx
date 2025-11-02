import { cn } from '@/utils';
import { Modal, ModalProps } from 'antd';
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import './modal-wrapper.scss';

export interface ModalWrapperRef {
  open: () => void;
  close: () => void;
  getVisible: () => boolean;
}

interface ModalWrapperProps extends ModalProps {
  isfullScreen?: boolean;
  hasTag?: boolean;
}

const ModalWrapper = forwardRef<ModalWrapperRef, ModalWrapperProps>(
  ({ title, isfullScreen, children, className, hasTag, ...rest }, ref) => {
    const [visible, setVisible] = useState<boolean>();

    const close = useCallback(() => {
      setVisible(false);
    }, []);

    useImperativeHandle(ref, () => ({
      open: () => setVisible(true),
      close: () => close(),
      getVisible: () => !!visible,
    }));

    return (
      <Modal
        className={cn(
          '!border-0',
          isfullScreen
            ? 'ct_ant_modal_content !max-w-full !h-full !rounded-none !top-0 xsm:!m-0'
            : '',
          className
        )}
        width={isfullScreen ? '100%' : ''}
        title={title}
        open={visible}
        onCancel={close}
        footer={false}
        closable={false}
        {...rest}
      >
        <div
          className={cn(
            isfullScreen
              ? 'h-full flex items-center justify-center'
              : ' bg-[#fff]'
          )}
        >
          {hasTag ? <hr /> : null}

          {children}
        </div>
      </Modal>
    );
  }
);

export default ModalWrapper;
