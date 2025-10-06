import { authService } from '@/api/services/auth';
import healthCheckerService from '@/api/services/health-checker/health-checker.service';
import Page503 from '@/pages/sys/error/Page503';
import PageLoading from '@/pages/sys/error/PageLoading';
import { useUserActions, useUserToken } from '@/store/userStore';
import ModalFullScreenCustom, {
  ModalFullScreenCustomRef,
} from '@/ui/modal-fullscreen-custom';
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from '../hooks';

type Props = {
  children: React.ReactNode;
};
export default function LoginAuthGuard({ children }: Props) {
  const router = useRouter();
  const { accessToken } = useUserToken();
  const modalFullScreenCustom = useRef<ModalFullScreenCustomRef>(null);
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
    const visible = modalFullScreenCustom.current?.getVisible();
    try {
      setComp(<PageLoading />);
      if (!visible && !isLoaded.current) {
        modalFullScreenCustom.current?.open();
      }

      await healthCheckerService.healthDatabase();
      const userInfo = await authService.me();
      setUserInfo(userInfo);
      modalFullScreenCustom.current?.close();
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

    const intervalId = setInterval(() => {
      fetchUserInfo();
    }, 60000);

    return () => clearInterval(intervalId);
  }, [fetchUserInfo]);

  if (!accessToken) {
    return null;
  }

  return (
    <>
      {children}
      <ModalFullScreenCustom ref={modalFullScreenCustom}>
        {comp}
      </ModalFullScreenCustom>
    </>
  );
}
