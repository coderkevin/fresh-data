import { createStore } from 'redux';

const helloWorldCreateStore = ( reducer ) => {
	return createStore(
		reducer,
		window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
	);
};

export default helloWorldCreateStore;
