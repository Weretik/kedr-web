import { useState, type ReactNode } from 'react';
import { View } from 'react-native';

type TreeNode = { children?: TreeNode[]; id: number; name: string };
type RowProps = { checkedValue: boolean; isExpanded: boolean; level: number; node: TreeNode; onCheck: () => void; onExpand: () => void };

export function TreeView({ CustomNodeRowComponent: Row, data, onCheck, preselectedIds = [] }: { CustomNodeRowComponent: (props: RowProps) => ReactNode; data: TreeNode[]; onCheck?: (ids: number[]) => void; preselectedIds?: number[] }) {
  const [expanded, setExpanded] = useState<Set<number>>(() => new Set());
  const [selected, setSelected] = useState<number[]>(preselectedIds);
  const renderNode = (node: TreeNode, level: number): ReactNode => {
    const onExpand = () => setExpanded((current) => { const next = new Set(current); if (next.has(node.id)) next.delete(node.id); else next.add(node.id); return next; });
    const onSelect = () => { const next = selected.includes(node.id) ? [] : [node.id]; setSelected(next); onCheck?.(next); };
    return <View key={node.id}><Row checkedValue={selected.includes(node.id)} isExpanded={expanded.has(node.id)} level={level} node={node} onCheck={onSelect} onExpand={onExpand} />{expanded.has(node.id) ? node.children?.map((child) => renderNode(child, level + 1)) : null}</View>;
  };
  return <View>{data.map((node) => renderNode(node, 0))}</View>;
}
