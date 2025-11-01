import { DepartmentEntity } from '@/api/services/department';
import { departmentService } from '@/api/services/department/department.service';
import { col_1_1_1_1, formItemLayout } from '@/constant';
import { UserInfo } from '@/types/entity';
import { Button } from '@/ui/button';
import { DepartmentDetailRef, DepartmentPicker } from '@/ui/Department';
import { DialogFooter } from '@/ui/dialog';
import { InputText } from '@/ui/InputText';
import ModalWrapper, { ModalWrapperRef } from '@/ui/ModalWrapper';
import { PeoplePicker } from '@/ui/PeoplePicker';
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

export interface DepartmentDetailModalRef {
  open: (id?: string) => Promise<{ hasChange?: boolean }>;
  close: () => void;
}

interface DepartmentDetailModalProps {
  title?: string;
}

interface FormValue {
  name: string;
  code: string;
  manager: UserInfo;
  deputy: UserInfo;
  parent: DepartmentEntity;
}

const DepartmentDetailModal = forwardRef<
  DepartmentDetailModalRef,
  DepartmentDetailModalProps
>((_, ref) => {
  const [departmentId, setDepartmentId] = useState<string>();
  const [currentDepartment, setCurrentDepartment] =
    useState<DepartmentEntity>();

  const [loading, setLoading] = useState<boolean>(false);
  const modalWrapperRef = useRef<ModalWrapperRef>(null);
  const departmentDetailRef = useRef<DepartmentDetailRef>(null);

  const [form] = useForm<FormValue>();

  const close = useCallback((hasChange?: boolean) => {
    modalWrapperRef.current?.close();
    setDepartmentId(undefined);
    setLoading(false);
    guard({ hasChange });
  }, []);

  const handleOpen = useCallback(
    async (id?: string) => {
      setDepartmentId(id);
      setCurrentDepartment(undefined);
      modalWrapperRef.current?.open();

      form.resetFields();

      if (id) {
        console.log(departmentDetailRef);

        try {
          setLoading(true);
          const department = await departmentService.getById(id);
          setCurrentDepartment(department);
          departmentDetailRef.current?.setData(department.parent);

          const value = pick(department, [
            'code',
            'name',
            'parent',
            'manager',
            'deputy',
          ]);
          form.setFieldsValue(value);
        } catch (error) {
          console.log(`error get detail department:: `, error);
          close();
        } finally {
          setLoading(false);
        }
      }
    },
    [form]
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
      if (!departmentId) {
        await departmentService.add(form.getFieldsValue());
        toast.success('Add success!');
        close(true);
        return;
      }
      await departmentService.update(departmentId, form.getFieldsValue());
      toast.success('Update success!');
      close(true);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [form, departmentId]);

  return (
    <ModalWrapper
      ref={modalWrapperRef}
      title={departmentId ? 'Edit department' : 'Add Department'}
      closable
      width={window.innerWidth - 10 > 1200 ? 1000 : window.innerWidth - 10}
    >
      <Spin spinning={loading}>
        <Form
          form={form}
          {...formItemLayout}
          labelAlign="left"
          className="custom-form-item"
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

            <Form.Item label={'Parent'} name="parent">
              <DepartmentPicker
                children="w-full"
                allowClear
                itemDisabled={currentDepartment}
                ref={departmentDetailRef}
              />
            </Form.Item>

            <Form.Item label={'Manager'} name="manager">
              <PeoplePicker classNameTrigger="w-full" allowClear size={24} />
            </Form.Item>

            <Form.Item label={'Deputy'} name="deputy">
              <PeoplePicker classNameTrigger="w-full" allowClear size={24} />
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
});

export default DepartmentDetailModal;
