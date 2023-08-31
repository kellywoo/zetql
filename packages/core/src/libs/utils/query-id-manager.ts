export class QueryIdManager {
	currentQueryId = '';
	queryIdSet = new Set<string>();

	isCurrentQueryId(id: string) {
		return this.currentQueryId === id;
	}
	setCurrentQueryId(id: string) {
		this.currentQueryId = id;
		this.queryIdSet.add(id);
	}
	markQuerySettled(id: string) {
		this.queryIdSet.delete(id);
	}
	isActiveQuery(id: string) {
		return this.queryIdSet.has(id);
	}
	destroy() {
		this.queryIdSet.clear();
	}
}
