import { APIClient } from '@/api/service-base';
import { iconWarningDelete } from '@/components/icon/icon';
import { col_1_1_1_1 } from '@/constant';
import { Button } from '@/ui/button';
import { DialogFooter } from '@/ui/dialog';
import ModalWrapper, { ModalWrapperRef } from '@/ui/ModalWrapper';
import { Col, Spin } from 'antd';
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { toast } from 'sonner';

let guard: (res?: { deleted?: boolean }) => void;

export interface DeleteModalRef {
  open: (id?: string) => Promise<{ deleted?: boolean }>;
  close: () => void;
}

interface DeleteModalProps {
  title?: string;
  service: APIClient;
}

const DeleteModal = forwardRef<DeleteModalRef, DeleteModalProps>(
  ({ service }, ref) => {
    const [deleteId, setDeleteId] = useState<string>();

    const [loading, setLoading] = useState<boolean>(false);
    const modalWrapperRef = useRef<ModalWrapperRef>(null);

    const close = useCallback((deleted?: boolean) => {
      modalWrapperRef.current?.close();
      setDeleteId(undefined);
      setLoading(false);
      guard({ deleted });
    }, []);

    const handleOpen = useCallback(async (id?: string) => {
      setDeleteId(id);
      modalWrapperRef.current?.open();
    }, []);

    useImperativeHandle(ref, () => ({
      open: async (id?: string) => {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise<{ deleted?: boolean }>(async (resolve) => {
          guard = resolve as (res?: { deleted?: boolean }) => void;
          handleOpen(id);
        });
      },
      close: () => close(),
    }));

    const handleOk = useCallback(async () => {
      if (!deleteId) {
        return;
      }
      try {
        setLoading(true);
        await service.delete(deleteId);
        toast.success('Delete success!');
        close(true);
      } catch (error) {
        toast.error('Delete action failed. Please try again.');
        console.log(error);
      } finally {
        setLoading(false);
      }
    }, [close, deleteId, service]);

    return (
      <ModalWrapper
        ref={modalWrapperRef}
        title={'Delete item'}
        closable
        hasTag
        width={window.innerWidth - 10 > 1000 ? 800 : window.innerWidth - 10}
      >
        <Spin spinning={loading}>
          <Col {...col_1_1_1_1} className="mt-3">
            <div className="flex gap-4">
              <div>{iconWarningDelete}</div>

              <div>
                <div className="font-bold">
                  Are you sure you want to delete this data?
                </div>
                <div>
                  Once deleted, it will be permanently removed from the system
                  and cannot be recovered. Do you want to continue?
                </div>
              </div>
            </div>
          </Col>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                close();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="default" onClick={handleOk}>
              Confirm
            </Button>
          </DialogFooter>
        </Spin>
      </ModalWrapper>
    );
  }
);

export default DeleteModal;
