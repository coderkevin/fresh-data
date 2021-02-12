import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import createStore from './create-store';
import reducer from './reducer';
import SiteSelect from './SiteSelect';
import PostList from './PostList';

const store = createStore( reducer );

const WPRestApi = () => {
	return (
		<ReduxProvider store={ store } >
			<div className="App-DemoBody">
				<header className="WP-header">
					<h2><a className="WP-title" href="http://wp-api.org">WordPress REST API</a></h2>
				</header>
				<SiteSelect>
					<PostList />
				</SiteSelect>
			</div>
		</ReduxProvider>
	);
}

export default WPRestApi;
