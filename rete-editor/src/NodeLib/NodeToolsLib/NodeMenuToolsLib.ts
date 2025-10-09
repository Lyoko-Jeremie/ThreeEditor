import {NodeLatchOutputBySwitch} from "./NodeOutputBySwitch";
import type {ReteEditorInterface} from "../../ReteEditorInterface";
import {NodeFlyListCatchLatch} from "./NodeFlyListCatchLatch";

export const NodeToolsLibTypeT = [
	NodeLatchOutputBySwitch,
	NodeFlyListCatchLatch,
] as const;
export type NodeToolsLibType =
	NodeLatchOutputBySwitch |
	NodeFlyListCatchLatch
	;

export const NodeMenuToolsLib = (editor: ReteEditorInterface): [string, () => Promise<NodeToolsLibType>][] => {
	return [
		["碰撞事件过滤锁存器", async () => NodeLatchOutputBySwitch.create(editor),],
		["无人机碰撞匹配器", async () => NodeFlyListCatchLatch.create(editor),],
	] as const;
};

export const NodeToolsLibKeyL = NodeToolsLibTypeT.map(n => n.nodeTypeStatic);

export const NodeToolsLibCreateTable = [
	[NodeLatchOutputBySwitch.nodeTypeStatic, NodeLatchOutputBySwitch.deserialize],
	[NodeFlyListCatchLatch.nodeTypeStatic, NodeFlyListCatchLatch.deserialize],
] as const;
