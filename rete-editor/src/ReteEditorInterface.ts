import type {NeedSkipBuffer} from "./NodeLib/OpInterface";

export interface ReteEditorInterface {

	updateOneNodeSize(node: NeedSkipBuffer): Promise<void>;

	updateMinimap(): Promise<void>;

	reLayout(): Promise<void>;
}
