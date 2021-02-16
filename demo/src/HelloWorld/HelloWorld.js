import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { ApiProvider } from '@fresh-data/react-provider';
import createStore from './create-store';
import Message from './Message';
import reducer from './reducer';
import testApi from './test-api';

const store = createStore( reducer );

const HelloWorld = () => {
	return (
		<ReduxProvider store={ store } >
			<ApiProvider apiName={ 'test-api' } apiSpec={ testApi }>
				<div className="App-DemoBody">
					<Message />
				</div>
			</ApiProvider>
		</ReduxProvider>
	);
}

export default HelloWorld;
