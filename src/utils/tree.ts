import { DepartmentEntity } from '@/api/services/department';
import { chain } from 'ramda';

/**
 * Flatten an array containing a tree structure
 * @param {T[]} trees - An array containing a tree structure
 * @returns {T[]} - Flattened array
 */
export function flattenTrees<T extends { children?: T[] }>(
  trees: T[] = []
): T[] {
  return chain((node) => {
    const children = node.children || [];
    return [node, ...flattenTrees(children)];
  }, trees);
}

/**
 * Convert an array to a tree structure
 * @param items - An array of items
 * @returns A tree structure
 */
export function convertToTree<T extends { children?: T[] }>(items: T[]): T[] {
  const tree = items.map((item) => ({
    ...item,
    children: convertToTree(item.children || []),
  }));

  return tree;
}

/**
 * Convert a flat array with parentId to a tree structure
 * @param items - An array of items with parentId
 * @returns A tree structure with children property
 */
export function convertFlatToTree<T extends { id: string; parentId: string }>(
  items: T[]
): (T & { children: T[] })[] {
  const itemMap = new Map<string, T & { children: T[] }>();
  const result: (T & { children: T[] })[] = [];

  // First pass: create a map of all items
  for (const item of items) {
    itemMap.set(item.id, { ...item, children: [] });
  }

  // Second pass: build the tree
  for (const item of items) {
    const node = itemMap.get(item.id);
    if (!node) continue;

    if (item.parentId === '') {
      result.push(node);
    } else {
      const parent = itemMap.get(item.parentId);
      if (parent) {
        parent.children.push(node);
      }
    }
  }

  return result;
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
  const { id, name, children, path, ...rest } = node;

  return {
    ...rest,
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

export function buildTree(
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
