import { userService } from '@/api/services/user';
import {
  SingleUploadAvatar,
  SingleUploadAvatarRef,
} from '@/components/upload/single-upload-avatar';
import { col_1_1_1_1, formItemLayout_24 } from '@/constant';
import { useUserActions, useUserInfo } from '@/store/userStore';
import { Button } from '@/ui/button';
import { Card, CardContent, CardFooter } from '@/ui/card';
import { DepartmentPicker } from '@/ui/DepartmentPicker';
import { InputText } from '@/ui/InputText';
import { Switch } from '@/ui/switch';
import { Text } from '@/ui/typography';
import { Col, Form } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useCallback, useRef } from 'react';
import { toast } from 'sonner';

type FieldType = {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  code?: string;
  about: string;
};

export default function GeneralTab() {
  const singleUploadAvatarRef = useRef<SingleUploadAvatarRef>(null);
  const { avatar, email, id, firstName, lastName, department } = useUserInfo();
  const { setUserInfo } = useUserActions();

  const [form] = useForm<FieldType>();

  const handleClick = useCallback(async () => {
    console.log(form.getFieldsValue());
    const file = singleUploadAvatarRef.current?.getFile();
    if (id) {
      try {
        const user = await userService.updateUser(
          id,
          {},
          file as unknown as File
        );
        setUserInfo(user);
        toast.success('Update success!');
        singleUploadAvatarRef.current?.clearFile();
      } catch {
        toast.error('Update error!');
      }
    }
  }, [form, id, setUserInfo]);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="col-span-1">
        <Card className="flex-col items-center px-6! pb-10! pt-20!">
          <SingleUploadAvatar
            defaultAvatar={avatar}
            ref={singleUploadAvatarRef}
          />

          <div className="flex items-center py-6 gap-2 w-40">
            <Text variant="body1">Public Profile</Text>
            <Switch />
          </div>

          <Button variant="destructive" className="w-40">
            Delete User
          </Button>
        </Card>
      </div>
      <div className="col-span-1">
        <Card>
          <CardContent>
            <Form
              form={form}
              {...formItemLayout_24}
              labelAlign="left"
              className="custom-form-item"
              initialValues={{ email, firstName, lastName, department }}
            >
              <Col {...col_1_1_1_1} className="mt-3">
                <Form.Item
                  label={'Email'}
                  name="email"
                  rules={[{ required: true, message: '', whitespace: true }]}
                >
                  <InputText disabled />
                </Form.Item>
                <Form.Item
                  label={'First name'}
                  name="firstName"
                  rules={[{ required: true, message: '', whitespace: true }]}
                >
                  <InputText />
                </Form.Item>

                <Form.Item
                  label={'Last name'}
                  name="lastName"
                  rules={[{ required: true, message: '', whitespace: true }]}
                >
                  <InputText />
                </Form.Item>

                <Form.Item label={'Department'} name="department">
                  <DepartmentPicker allowClear readonly />
                </Form.Item>
              </Col>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleClick}>Save Changes</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
