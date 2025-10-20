import { UserInfo } from '@/types/entity';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/ui/form';
import { Input } from '@/ui/input';
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
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
}

const DepartmentDetailModal = forwardRef<
  DepartmentDetailModalRef,
  DepartmentDetailModalProps
>(({ title }, ref) => {
  const [visible, setVisible] = useState<boolean>();
  const [departmentId, setDepartmentId] = useState<string>();
  const form = useForm<FormValue>({});

  const close = useCallback(() => {
    setVisible(false);
  }, []);

  const handleOpen = useCallback((id?: string) => {
    console.info(id);
    setDepartmentId(id);
    setVisible(true);
  }, []);

  useImperativeHandle(ref, () => ({
    open: handleOpen,
    close: () => close(),
  }));

  return (
    <Dialog open={visible} onOpenChange={close}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>
            {(title ?? departmentId) ? 'Edit department' : 'Add Department'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <div className="grid grid-cols-2 items-center gap-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Label</FormLabel>
                  <div className="col-span-3">
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Label</FormLabel>
                  <div className="col-span-3">
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Label</FormLabel>
                  <div className="col-span-3">
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                  <FormLabel className="text-right">Label</FormLabel>
                  <div className="col-span-3">
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
});

export default DepartmentDetailModal;
