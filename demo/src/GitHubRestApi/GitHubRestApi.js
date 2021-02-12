import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import createStore from './create-store';
import reducer from './reducer';
import UserSelect from './UserSelect';
import UserInfo from './UserInfo';

const store = createStore( reducer );

const GitHubRestApi = () => {
	return (
		<ReduxProvider store={ store }>
			<div className="App-DemoBody">
				<header className="GH-header">
					<h2><a className="GH-title" href="https://developer.github.com/v3">GitHub REST API</a></h2>
				</header>
				<UserSelect>
					{ ( userName ) => (
						<UserInfo userName={ userName } />
					) }
				</UserSelect>
			</div>
		</ReduxProvider>
	);
}

export default GitHubRestApi;
