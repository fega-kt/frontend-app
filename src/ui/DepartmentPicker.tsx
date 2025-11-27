import { DepartmentEntity } from '@/api/services/department';
import { departmentService } from '@/api/services/department/department.service';
import { cn } from '@/utils';
import { buildTree } from '@/utils/tree';
import { TreeSelect, TreeSelectProps } from 'antd';
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './hover-card';
import { RenderAvatar } from './render-avatar';

interface DepartmentProps
  extends Omit<TreeSelectProps<string>, 'options' | 'onChange' | 'value'> {
  className?: string;
  readonly?: boolean;
  value?: DepartmentEntity;
  itemDisabled?: DepartmentEntity;
  onChange?: (value?: DepartmentEntity) => void;
}

export interface DepartmentDetailRef {
  setData: (data?: DepartmentEntity) => void;
}

export const DepartmentPicker = forwardRef<
  DepartmentDetailRef,
  DepartmentProps
>(
  (
    { className = '', readonly, value, onChange, itemDisabled, ...rest },
    ref
  ) => {
    const isLoaded = useRef<boolean>(false);
    const [departments, setDepartment] = useState<DepartmentEntity[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const handleOnFocus = useCallback(async () => {
      if (isLoaded.current) {
        return;
      }
      try {
        setLoading(true);
        const data = await departmentService.dataTree();
        setDepartment(data);
        isLoaded.current = true;
      } catch (error) {
        console.error('error get departments:: ', error);
        setDepartment([]);
      } finally {
        setLoading(false);
      }
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        setData: (data?: DepartmentEntity) => {
          if (data) setDepartment([data]);
        },
      }),
      []
    );

    const treeData = useMemo(
      () => buildTree(departments, itemDisabled),
      [departments, itemDisabled]
    );

    const renderDepartment = useCallback(
      (department?: DepartmentEntity) => {
        if (!department) return null;
        return (
          <div className={cn(className, 'items-center')}>
            <HoverCard openDelay={10}>
              <HoverCardTrigger asChild>
                <span className="text-sm">{department.name}</span>
              </HoverCardTrigger>
              <HoverCardContent side={'top'} align="center">
                <div className="w-full max-w-lg p-4 shadow-md border rounded-md bg-card">
                  <div className="grid gap-2">
                    {/* Row 1 */}
                    <div className="grid grid-cols-[100px_1fr] items-center gap-4 border-b border-gray-200 dark:border-gray-700 pb-3">
                      <div className="text-muted-foreground font-medium">
                        Tên Phòng ban
                      </div>
                      <div className="text-foreground  font-semibold">
                        {department.name}
                      </div>
                    </div>

                    {/* Row 2 */}
                    {department.manager ? (
                      <div className="grid grid-cols-[100px_1fr] items-center gap-4 border-b border-gray-200 dark:border-gray-700 pb-3">
                        <div className="text-muted-foreground font-medium">
                          Trưởng phòng
                        </div>
                        <div className="flex items-center gap-2 min-w-0">
                          <RenderAvatar
                            avatar={department.manager?.avatar}
                            size={28}
                            className="rounded-full"
                            name={department.manager?.fullName}
                          />
                          <span className="text-foreground font-medium truncate">
                            {department.manager?.fullName}
                          </span>
                        </div>
                      </div>
                    ) : null}

                    {/* Row 3 */}

                    {department.deputy ? (
                      <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                        <div className="text-gray-500 dark:text-gray-400 font-medium">
                          Phó Phòng
                        </div>
                        <div className="flex items-center gap-2 min-w-0">
                          <RenderAvatar
                            avatar={department.deputy?.avatar}
                            size={28}
                            className="rounded-full"
                            name={department.deputy?.fullName}
                          />
                          <span className="text-gray-900 dark:text-gray-100 font-medium truncate">
                            {department.deputy?.fullName}
                          </span>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
        );
      },
      [className]
    );

    if (readonly) {
      return <>{renderDepartment(value)}</>;
    }

    return (
      <div className={cn(className, 'items-center')}>
        <TreeSelect
          showSearch
          loading={loading}
          notFoundContent={loading ? <span>Đang tải...</span> : null}
          treeDataSimpleMode
          style={{ width: '100%' }}
          value={value?.id}
          styles={{
            popup: { root: { maxHeight: 400, overflow: 'auto' } },
          }}
          placeholder="Please select"
          onChange={(data) => {
            const select = departments.find((it) => it.id === data);
            onChange?.(select);
          }}
          onFocus={handleOnFocus}
          treeData={treeData}
          {...rest}
        />
      </div>
    );
  }
);
