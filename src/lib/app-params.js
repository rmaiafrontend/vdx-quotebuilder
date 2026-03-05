const isNode = typeof window === 'undefined';

const getAppParams = () => {
	if (isNode) return {};

	const urlParams = new URLSearchParams(window.location.search);

	// Limpar tokens se solicitado via URL
	if (urlParams.get('clear_access_token') === 'true') {
		localStorage.removeItem('admin_token');
		localStorage.removeItem('vidraceiro_token');
		urlParams.delete('clear_access_token');
		const newUrl = `${window.location.pathname}${urlParams.toString() ? `?${urlParams.toString()}` : ''}${window.location.hash}`;
		window.history.replaceState({}, document.title, newUrl);
	}

	return {
		fromUrl: window.location.href,
	};
};

export const appParams = {
	...getAppParams()
};
