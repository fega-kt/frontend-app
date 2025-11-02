import { DepartmentEntity } from '@/api/services/department';
import { departmentService } from '@/api/services/department/department.service';
import { cn } from '@/utils';
import { convertFlatToTree } from '@/utils/tree';
import { TreeSelect, TreeSelectProps } from 'antd';
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';

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

interface DepartmentTree extends DepartmentEntity {
  children?: DepartmentTree[];
  parentId: string;
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

    const treeData = useMemo(() => {
      const data = (departments || []).map((it) => {
        return {
          ...it,
          parentId: it.parent?.id || '',
          disabled:
            itemDisabled?.path && it.path
              ? it.path.startsWith(itemDisabled.path)
              : false,
        };
      });
      return convertFlatToTree<DepartmentTree>(data);
    }, [departments, itemDisabled]);

    if (readonly) {
      return (
        <>
          <div className={cn(className, 'items-center')}>{value?.name}</div>
        </>
      );
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
          fieldNames={{
            label: 'name',
            value: 'id',
          }}
          {...rest}
        />
      </div>
    );
  }
);
