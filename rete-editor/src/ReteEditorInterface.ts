import type {NeedSkipBuffer} from "./NodeLib/OpInterface";

export interface ReteEditorInterface {

	updateOneNodeSize(node: NeedSkipBuffer): Promise<void>;

	updateMinimap(): void;

	reLayout(): Promise<void>;
}
