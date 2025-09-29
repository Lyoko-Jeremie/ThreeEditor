import {NodeLatchOutputBySwitch} from "./NodeOutputBySwitch";
import type {ReteEditorInterface} from "../../ReteEditorInterface";

export const NodeToolsLibTypeT = [
	NodeLatchOutputBySwitch
] as const;
export type NodeToolsLibType = NodeLatchOutputBySwitch;

export const NodeMenuToolsLib = (editor: ReteEditorInterface): [string, () => Promise<NodeToolsLibType>][] => {
	return [
		["碰撞事件过滤锁存器", async () => NodeLatchOutputBySwitch.create(editor),],
	] as const;
};

export const NodeToolsLibKeyL = NodeToolsLibTypeT.map(n => n.nodeTypeStatic);

export const NodeToolsLibCreateTable = [
	[NodeLatchOutputBySwitch.nodeTypeStatic, NodeLatchOutputBySwitch.deserialize],
] as const;
