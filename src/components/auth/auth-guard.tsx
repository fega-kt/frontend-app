import healthCheckerService from "@/api/services/health-checker/health-checker.service";
import userService from "@/api/services/userService";
import Page503 from "@/pages/sys/error/Page503";
import PageLoading from "@/pages/sys/error/PageLoading";
import { useUserActions } from "@/store/userStore";
import ModalFullScreenCustom from "@/ui/modal-fullscreen-custom";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useAuthCheck } from "./use-auth";

interface AuthGuardProps {
	/**
	 * The content to be rendered if the user has the required permissions/roles
	 */
	children: ReactNode;
	/**
	 * The fallback content to be rendered if the user doesn't have the required permissions/roles
	 */
	fallback?: ReactNode;
	/**
	 * The permission/role to check
	 */
	check?: string;
	/**
	 * The permissions/roles to check (any one of them)
	 */
	checkAny?: string[];
	/**
	 * The permissions/roles to check (all of them)
	 */
	checkAll?: string[];
	/**
	 * The type of check to perform: 'role' or 'permission'
	 * @default 'permission'
	 */
	baseOn?: "role" | "permission";
}

/**
 * A wrapper component that conditionally renders its children based on user permissions/roles
 *
 * @example
 * // Check single permission
 * <AuthGuard check="user.create">
 *   <button>Create User</button>
 * </AuthGuard>
 *
 * @example
 * // Check multiple permissions (any)
 * <AuthGuard checkAny={["user.create", "user.edit"]}>
 *   <button>Edit User</button>
 * </AuthGuard>
 *
 * @example
 * // Check multiple permissions (all)
 * <AuthGuard checkAll={["user.create", "user.edit"]}>
 *   <button>Advanced Edit</button>
 * </AuthGuard>
 *
 * @example
 * // With fallback content
 * <AuthGuard check="admin" baseOn="role" fallback={<div>Access Denied</div>}>
 *   <AdminPanel />
 * </AuthGuard>
 */
export const AuthGuard = ({
	children,
	fallback = null,
	check,
	checkAny,
	checkAll,
	baseOn = "permission",
}: AuthGuardProps) => {
	const checkFn = useAuthCheck(baseOn);

	const hasAccess = check
		? checkFn.check(check)
		: checkAny
			? checkFn.checkAny(checkAny)
			: checkAll
				? checkFn.checkAll(checkAll)
				: true;

	const [errorAuthenticated, setErrorAuthenticated] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);

	const { setUserInfo } = useUserActions();

	const fetchUserInfo = useCallback(async () => {
		try {
			setLoading(true);
			await healthCheckerService.healthDatabase();
			const userInfo = await userService.me();
			setErrorAuthenticated(false);
			setUserInfo(userInfo);
		} catch {
			setErrorAuthenticated(true);
		} finally {
			setLoading(false);
		}
	}, [setUserInfo]);

	useEffect(() => {
		fetchUserInfo();

		const intervalId = setInterval(() => {
			fetchUserInfo();
		}, 60000);

		return () => clearInterval(intervalId);
	}, [fetchUserInfo]);

	if (loading) {
		return (
			<ModalFullScreenCustom autoOpen>
				<PageLoading />
			</ModalFullScreenCustom>
		);
	}

	if (errorAuthenticated) {
		return (
			<ModalFullScreenCustom autoOpen>
				<Page503 />
			</ModalFullScreenCustom>
		);
	}
	return hasAccess ? children : fallback;
};
