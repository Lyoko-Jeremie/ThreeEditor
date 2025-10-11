// from Gemini
import type {SerializationExportDataType} from "./ReteSerializationTypeDef";

/**
 * 使用 Kahn 算法对图进行拓扑排序。
 * @param data 以 SerializationExportDataType 格式表示的图数据。
 * @returns 排序后的节点 ID 数组，如果检测到循环则返回 null。
 */
export function kahnTopologicalSort(data: SerializationExportDataType): string[] | null {
	// 一个用于存储邻接列表的 Map (节点 ID -> 相连的节点 ID 列表)
	const adj: Map<string, string[]> = new Map();
	// 一个用于存储每个节点入度的 Map
	const inDegree: Map<string, number> = new Map();

	// 1. 初始化数据结构
	for (const node of data.nodes) {
		adj.set(node.id, []);
		inDegree.set(node.id, 0);
	}

	// 2. 构建邻接列表并计算入度
	for (const connection of data.connections) {
		const sourceId = connection.source;
		const targetId = connection.target;

		// 检查源节点和目标节点是否都在图中存在
		if (adj.has(sourceId) && adj.has(targetId)) {
			// 添加从源节点到目标节点的边
			adj.get(sourceId)?.push(targetId);
			// 增加目标节点的入度
			inDegree.set(targetId, (inDegree.get(targetId) || 0) + 1);
		}
	}

	// 3. 使用所有入度为 0 的节点初始化队列
	const queue: string[] = [];
	for (const [nodeId, degree] of inDegree.entries()) {
		if (degree === 0) {
			queue.push(nodeId);
		}
	}

	// 4. 处理节点并构建排序列表
	const sortedNodes: string[] = [];
	let visitedCount = 0;

	while (queue.length > 0) {
		const nodeId = queue.shift()!; // 出队一个节点
		sortedNodes.push(nodeId);
		visitedCount++;

		// 获取当前节点的邻居
		const neighbors = adj.get(nodeId) || [];
		for (const neighborId of neighbors) {
			// 减少邻居节点的入度
			const newInDegree = (inDegree.get(neighborId) || 0) - 1;
			inDegree.set(neighborId, newInDegree);

			// 如果邻居的入度变为 0，则将其加入队列
			if (newInDegree === 0) {
				queue.push(neighborId);
			}
		}
	}

	// 5. 检查是否存在循环
	// 如果排序后的节点数小于总节点数，则存在循环。
	if (visitedCount < data.nodes.length) {
		console.error("Error: The graph contains a cycle and cannot be topologically sorted.");
		return null;
	}

	return sortedNodes;
}


/**
 * 在已知图无环的前提下，使用迭代式 DFS（基于栈）来检测新边是否会形成环。
 *
 * @param data 现有的图数据。
 * @param newConnectionSource 新边的源节点 ID。
 * @param newConnectionTarget 新边的目标节点 ID。
 * @returns 如果添加新边会形成环则返回 true，否则返回 false。
 */
export function willAddConnectionCreateCycleIterativeSimple(
	data: SerializationExportDataType,
	newConnectionSource: string,
	newConnectionTarget: string
): boolean {
	const stack: string[] = [];
	const visited = new Set<string>();

	const connectionMap = new Map<string, string[]>();
	for (const conn of data.connections) {
		if (!connectionMap.has(conn.source)) {
			connectionMap.set(conn.source, []);
		}
		connectionMap.get(conn.source)!.push(conn.target);
	}

	// 1. 检查新边所涉及的节点是否存在
	const sourceExists = data.nodes.some(n => n.id === newConnectionSource);
	const targetExists = data.nodes.some(n => n.id === newConnectionTarget);
	if (!sourceExists || !targetExists) {
		return false;
	}

	// 2. 将新边的目标节点压入栈中
	stack.push(newConnectionTarget);
	visited.add(newConnectionTarget);

	// 3. 迭代遍历
	while (stack.length > 0) {
		const u = stack.pop()!;

		// 如果我们从目标节点回溯到了源节点，就找到了一个环
		if (u === newConnectionSource) {
			visited.clear();
			connectionMap.clear();
			return true;
		}

		// 动态查找邻居
		for (const neighbor of connectionMap.get(u) || []) {
			if (!visited.has(neighbor)) {
				visited.add(neighbor);
				stack.push(neighbor);
			}
		}
	}

	visited.clear();
	connectionMap.clear();
	return false;
}
