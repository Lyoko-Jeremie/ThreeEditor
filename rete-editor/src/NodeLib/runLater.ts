export function runLater<T extends any = void>(f: () => T | Promise<T>, timeout = 0) {
	const re = Promise.withResolvers<T>();
	setTimeout(() => {
		try {
			const r = f();
			re.resolve(r);
		} catch (e) {
			re.reject(e);
		}
	}, timeout);
	re.promise.finally(() => (void 0));	// do nothing . only to avoid unhandled rejection error
	return re.promise;
}
