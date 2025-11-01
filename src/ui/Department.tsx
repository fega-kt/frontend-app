import { DepartmentEntity } from '@/api/services/department';
import { departmentService } from '@/api/services/department/department.service';
import { cn } from '@/utils';
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

interface RawNode {
  id: string;
  name: string;
  parent?: RawNode | null;
  children?: NodeWithChildren[];
  path: string;
}

type NodeWithChildren = RawNode & { children: RawNode[] };

interface TreeSelectNode {
  title: string;
  value: string;
  key: string;
  id: string;
  path: string;
  children?: TreeSelectNode[];
  disabled?: boolean;
}

function transform(
  node: NodeWithChildren,
  itemDisabled?: DepartmentEntity
): TreeSelectNode {
  const { id, name, children, path } = node;

  return {
    title: name,
    value: id,
    key: id,
    id,
    path,
    children: children?.length
      ? children.map((n) => transform(n, itemDisabled))
      : [],
    disabled: itemDisabled?.path ? path.startsWith(itemDisabled.path) : false,
  };
}

function buildTree(
  nodes: RawNode[],
  itemDisabled?: DepartmentEntity
): TreeSelectNode[] {
  const map = new Map<string, NodeWithChildren>();
  const roots: NodeWithChildren[] = [];
  nodes.forEach((node) => map.set(node.id, { ...node, children: [] }));

  nodes.forEach((node) => {
    const currentNode = map.get(node.id)!;
    if (node.parent?.id && node.parent.id !== node.id) {
      const parentNode = map.get(node.parent.id);

      if (parentNode) {
        parentNode.children.push(currentNode);
      }
    } else {
      roots.push(currentNode);
    }
  });

  return roots.map((n) => transform(n, itemDisabled));
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
        console.error('error get users:: ', error);
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

    if (readonly) {
      return (
        <>
          <div className={cn(className, 'items-center')}>{value?.name}</div>
        </>
      );
    }

    const treeData = useMemo(
      () => buildTree(departments, itemDisabled),
      [departments, itemDisabled]
    );

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
