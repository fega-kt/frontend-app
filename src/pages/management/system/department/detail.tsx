import { DepartmentEntity } from '@/api/services/department';
import { departmentService } from '@/api/services/department/department.service';
import { col_1_1_1_1, formItemLayout } from '@/constant';
import { UserInfo } from '@/types/entity';
import { Button } from '@/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/ui/dialog';
import { InputText } from '@/ui/InputText';
import { PeoplePicker } from '@/ui/PeoplePicker';
import { Col, Form, Spin } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { pick } from 'lodash';
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react';

export interface DepartmentDetailModalRef {
  open: (id?: string) => void;
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
  const [visible, setVisible] = useState<boolean>();
  const [departmentId, setDepartmentId] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const [form] = useForm<FormValue>();

  const close = useCallback(() => {
    setVisible(false);
    setDepartmentId(undefined);
    setLoading(false);
  }, []);

  const handleOpen = useCallback(async (id?: string) => {
    setDepartmentId(id);
    setVisible(true);
    form.resetFields();

    if (id) {
      try {
        setLoading(true);
        const department = await departmentService.getById(id);
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
  }, []);

  useImperativeHandle(ref, () => ({
    open: handleOpen,
    close: () => close(),
  }));

  return (
    <Dialog open={visible} onOpenChange={close}>
      <DialogContent className="!max-w-[min(100vw-20px,theme(maxWidth.5xl))] w-full">
        <Spin spinning={loading}>
          <DialogHeader>
            <DialogTitle>
              {departmentId ? 'Edit department' : 'Add Department'}
            </DialogTitle>
            <hr />
          </DialogHeader>
          <Form
            form={form}
            {...formItemLayout}
            labelAlign="left"
            className="custom-form-item"
          >
            <Col {...col_1_1_1_1} className="mt-3">
              <Form.Item label={'Code'} name="code" hidden={!departmentId}>
                <InputText disabled />
              </Form.Item>

              <Form.Item
                label={'Name'}
                name="name"
                rules={[{ required: true, message: '', whitespace: true }]}
              >
                <InputText />
              </Form.Item>

              <Form.Item label={'Parent'} name="parent">
                <InputText />
              </Form.Item>

              <Form.Item label={'Manager'} name="manager">
                <PeoplePicker classNameTrigger="w-full" allowClear />
              </Form.Item>

              <Form.Item label={'Deputy'} name="deputy">
                <PeoplePicker classNameTrigger="w-full" allowClear />
              </Form.Item>
            </Col>
            <DialogFooter>
              <Button variant="outline" onClick={close}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="default"
                onClick={() => {
                  console.log(form.getFieldsValue());
                }}
              >
                Confirm
              </Button>
            </DialogFooter>
          </Form>
        </Spin>
      </DialogContent>
    </Dialog>
  );
});

export default DepartmentDetailModal;
