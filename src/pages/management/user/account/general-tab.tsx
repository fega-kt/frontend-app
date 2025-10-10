import { userService } from '@/api/services/user';
import {
  SingleUploadAvatar,
  SingleUploadAvatarRef,
} from '@/components/upload/single-upload-avatar';
import { useUserInfo } from '@/store/userStore';
import { Button } from '@/ui/button';
import { Card, CardContent, CardFooter } from '@/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/ui/form';
import { Input } from '@/ui/input';
import { Switch } from '@/ui/switch';
import { Textarea } from '@/ui/textarea';
import { Text } from '@/ui/typography';
import { faker } from '@faker-js/faker';
import { useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
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
  const { avatar, email, id } = useUserInfo();
  const form = useForm<FieldType>({
    defaultValues: {
      // name: username,
      email,
      phone: faker.phone.number(),
      address: faker.location.county(),
      city: faker.location.city(),
      code: faker.location.zipCode(),
      about: faker.lorem.paragraphs(),
    },
  });

  const handleClick = useCallback(() => {
    console.log(form.getValues());
    const file = singleUploadAvatarRef.current?.getFile();
    toast.success('Update success!');
    if (id) {
      userService.updateUser(id, {}, file as unknown as File);
    }
  }, [form]);

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
            <Form {...form}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  disabled
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Code</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="mt-4">
                <FormField
                  control={form.control}
                  name="about"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>About</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
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
