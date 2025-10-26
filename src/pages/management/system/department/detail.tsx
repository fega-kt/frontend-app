import { DepartmentEntity } from '@/api/services/department';
import { departmentService } from '@/api/services/department/department.service';
import { UserInfo } from '@/types/entity';
import { Button } from '@/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/ui/form';
import { InputText } from '@/ui/InputText';
import { PeoplePicker } from '@/ui/PeoplePicker';
import { Spin } from 'antd';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { useForm } from 'react-hook-form';

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
>(({ title }, ref) => {
  const [visible, setVisible] = useState<boolean>();
  const [departmentId, setDepartmentId] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<FormValue>({});

  const close = useCallback(() => {
    setVisible(false);
    setDepartmentId(undefined);
    setLoading(false);
  }, []);

  const handleOpen = useCallback(async (id?: string) => {
    setDepartmentId(id);
    setVisible(true);
    await form.reset({});

    if (id) {
      try {
        setLoading(true);
        const department = await departmentService.getById(id);
        form.reset(department);
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

  useEffect(() => {
    console.log('After reset:', form.getValues());
  }, [form]); // Theo dõi form state changes

  return (
    <Dialog open={visible} onOpenChange={close}>
      <DialogContent className="!max-w-[min(100vw-20px,theme(maxWidth.5xl))] w-full">
        <Spin spinning={loading}>
          <DialogHeader>
            <DialogTitle>
              {(title ?? departmentId) ? 'Edit department' : 'Add Department'}
            </DialogTitle>
            <hr />
          </DialogHeader>
          <Form {...form}>
            <div className="grid grid-cols-1 items-center gap-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem className="grid gap-2 sm:grid-cols-4 sm:items-center sm:gap-4">
                    <FormLabel className="text-right">Code</FormLabel>
                    <div className="col-span-3">
                      <FormControl>
                        <InputText {...field} />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="grid gap-2 sm:grid-cols-4 sm:items-center sm:gap-4">
                    <FormLabel className="text-right">Name</FormLabel>
                    <div className="col-span-3">
                      <FormControl>
                        <InputText {...field} />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="parent.code"
                render={({ field }) => (
                  <FormItem className="grid gap-2 sm:grid-cols-4 sm:items-center sm:gap-4">
                    <FormLabel className="text-right">
                      Đơn vị cấp trên
                    </FormLabel>
                    <div className="col-span-3">
                      <FormControl>
                        <InputText {...field} />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="manager"
                render={({ field }) => (
                  <FormItem className="grid gap-2 sm:grid-cols-4 sm:items-center sm:gap-4">
                    <FormLabel className="text-right">Manager</FormLabel>
                    <div className="col-span-3">
                      <FormControl>
                        <PeoplePicker {...field} classNameTrigger="w-full" />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deputy"
                render={({ field }) => (
                  <FormItem className="grid gap-2 sm:grid-cols-4 sm:items-center sm:gap-4">
                    <FormLabel className="text-right">Deputy</FormLabel>
                    <div className="col-span-3">
                      <FormControl>
                        <PeoplePicker {...field} classNameTrigger="w-full" />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </Form>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={async () => {
                form.reset({ name: '' });
                console.log(form.getValues());
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              onClick={() => {
                console.log(form.getValues());
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </Spin>
      </DialogContent>
    </Dialog>
  );
});

export default DepartmentDetailModal;
