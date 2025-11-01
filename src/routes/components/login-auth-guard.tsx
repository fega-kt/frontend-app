import { authService } from '@/api/services/auth';
import healthCheckerService from '@/api/services/health-checker/health-checker.service';
import Page503 from '@/pages/sys/error/Page503';
import PageLoading from '@/pages/sys/error/PageLoading';
import { useUserActions, useUserToken } from '@/store/userStore';

import ModalWrapper, { ModalWrapperRef } from '@/ui/ModalWrapper';
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from '../hooks';

type Props = {
  children: React.ReactNode;
};
export default function LoginAuthGuard({ children }: Props) {
  const router = useRouter();
  const { accessToken } = useUserToken();
  const modalWrapperRef = useRef<ModalWrapperRef>(null);
  const isLoaded = useRef<boolean>(false);

  const [comp, setComp] = useState<ReactNode>(null);
  const check = useCallback(() => {
    if (!accessToken) {
      router.replace('/auth/login');
    }
  }, [router, accessToken]);

  useEffect(() => {
    check();
  }, [check]);

  const { setUserInfo } = useUserActions();

  const fetchUserInfo = useCallback(async () => {
    const visible = modalWrapperRef.current?.getVisible();
    try {
      setComp(<PageLoading />);
      if (!visible && !isLoaded.current) {
        modalWrapperRef.current?.open();
      }

      await healthCheckerService.healthDatabase();
      const userInfo = await authService.me();
      setUserInfo(userInfo);
      modalWrapperRef.current?.close();
    } catch {
      if (!visible && isLoaded.current) {
        setComp(<Page503 />);
      }
    } finally {
      isLoaded.current = true;
    }
  }, [setUserInfo]);

  useEffect(() => {
    fetchUserInfo();

    const intervalId = setInterval(
      () => {
        fetchUserInfo();
      },
      15 * 60 * 1000
    );

    return () => clearInterval(intervalId);
  }, [fetchUserInfo]);

  if (!accessToken) {
    return null;
  }

  return (
    <>
      {children}
      <ModalWrapper ref={modalWrapperRef} isfullScreen>
        {comp}
      </ModalWrapper>
    </>
  );
}
