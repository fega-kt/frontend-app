import { groupService, IUpsertGroup, Permission } from '@/api/services/group';
import { col_1_1_1_1, formItemLayout } from '@/constant';
import { Button } from '@/ui/button';
import { DialogFooter } from '@/ui/dialog';
import { InputText } from '@/ui/InputText';
import ModalWrapper, { ModalWrapperRef } from '@/ui/ModalWrapper';
import { MultiPeoplePicker } from '@/ui/MultiPeoplePicker';
import SelectItem from '@/ui/SelectItem';
import { Col, Form, Spin } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { pick } from 'lodash';
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { toast } from 'sonner';

let guard: (res?: { hasChange?: boolean }) => void;

export interface GroupDetailModalRef {
  open: (id?: string) => Promise<{ hasChange?: boolean }>;
  close: () => void;
}

interface GroupDetailModalProps {
  title?: string;
}

const GroupDetailModal = forwardRef<GroupDetailModalRef, GroupDetailModalProps>(
  (_, ref) => {
    const [groupId, setGroupId] = useState<string>();

    const [loading, setLoading] = useState<boolean>(false);
    const modalWrapperRef = useRef<ModalWrapperRef>(null);

    const [form] = useForm<IUpsertGroup>();

    const close = useCallback((hasChange?: boolean) => {
      modalWrapperRef.current?.close();
      setGroupId(undefined);
      setLoading(false);
      guard({ hasChange });
    }, []);

    const handleOpen = useCallback(
      async (id?: string) => {
        setGroupId(id);
        modalWrapperRef.current?.open();

        form.resetFields();

        if (id) {
          try {
            setLoading(true);
            const group = await groupService.getById(id);

            const value = pick(group, ['code', 'name', 'permissions', 'users']);
            form.setFieldsValue({
              ...value,
              permissions: (value.permissions || []).map((permission) => ({
                id: permission,
                name: permission,
              })),
            });
          } catch (error) {
            console.log(`error get detail group:: `, error);
            close();
          } finally {
            setLoading(false);
          }
        }
      },
      [close, form]
    );

    useImperativeHandle(ref, () => ({
      open: async (id?: string) => {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise<{ hasChange?: boolean }>(async (resolve) => {
          guard = resolve as (res?: { hasChange?: boolean }) => void;
          handleOpen(id);
        });
      },
      close: () => close(),
    }));

    const handleOk = useCallback(async () => {
      try {
        await form.validateFields();
        setLoading(true);
        if (!groupId) {
          await groupService.add(form.getFieldsValue());
          toast.success('Add success!');
          close(true);
          return;
        }
        await groupService.update(groupId, form.getFieldsValue());
        toast.success('Update success!');
        close(true);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }, [close, form, groupId]);

    return (
      <ModalWrapper
        ref={modalWrapperRef}
        title={groupId ? 'Edit group' : 'Add group'}
        closable
        hasTag
        width={window.innerWidth - 10 > 1200 ? 1000 : window.innerWidth - 10}
      >
        <Spin spinning={loading}>
          <Form
            form={form}
            {...formItemLayout}
            labelAlign="left"
            className="custom-form-item"
            autoComplete="off"
          >
            <Col {...col_1_1_1_1} className="mt-3">
              <Form.Item
                label={'Code'}
                name="code"
                rules={[{ required: true, message: '', whitespace: true }]}
              >
                <InputText />
              </Form.Item>

              <Form.Item
                label={'Name'}
                name="name"
                rules={[{ required: true, message: '', whitespace: true }]}
              >
                <InputText />
              </Form.Item>
              <Form.Item label={'Users'} name="users">
                <MultiPeoplePicker />
              </Form.Item>
              <Form.Item label={'Permissions'} name="permissions">
                <SelectItem
                  dataSource={Object.values(Permission).map((permission) => ({
                    id: permission,
                    name: permission,
                  }))}
                  mode="multiple"
                />
              </Form.Item>
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
          </Form>
        </Spin>
      </ModalWrapper>
    );
  }
);

export default GroupDetailModal;
