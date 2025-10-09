import {NodeLatchOutputBySwitch} from "./NodeOutputBySwitch";
import type {ReteEditorInterface} from "../../ReteEditorInterface";
import {NodeFlyListCatchLatch} from "./NodeFlyListCatchLatch";
import {NodeFlyListMerge} from "./NodeFlyListMerge";

export const NodeToolsLibTypeT = [
	NodeLatchOutputBySwitch,
	NodeFlyListCatchLatch,
	NodeFlyListMerge,
] as const;
export type NodeToolsLibType =
	NodeLatchOutputBySwitch |
	NodeFlyListCatchLatch |
	NodeFlyListMerge
	;

export const NodeMenuToolsLib = (editor: ReteEditorInterface): [string, () => Promise<NodeToolsLibType>][] => {
	return [
		["碰撞事件过滤锁存器", async () => NodeLatchOutputBySwitch.create(editor),],
		["无人机碰撞匹配器", async () => NodeFlyListCatchLatch.create(editor),],
		["无人机端口合并器", async () => NodeFlyListMerge.create(editor),],
	] as const;
};

export const NodeToolsLibKeyL = NodeToolsLibTypeT.map(n => n.nodeTypeStatic);

export const NodeToolsLibCreateTable = [
	[NodeLatchOutputBySwitch.nodeTypeStatic, NodeLatchOutputBySwitch.deserialize],
	[NodeFlyListCatchLatch.nodeTypeStatic, NodeFlyListCatchLatch.deserialize],
	[NodeFlyListMerge.nodeTypeStatic, NodeFlyListMerge.deserialize],
] as const;
