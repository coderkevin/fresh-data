import { createStore } from 'redux';

const createGitHubRestApiStore = ( reducer ) => {
	return createStore(
		reducer,
		window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
	);
};

export default createGitHubRestApiStore;
