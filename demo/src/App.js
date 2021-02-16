import React, { useState } from 'react';
import GitHubRestApi from './GitHubRestApi';
import HelloWorld from './HelloWorld';
import WPRestApi from './WPRestApi';
import './App.css';

if ( 'development' === process.env.NODE_ENV ) {
	window.__FRESH_DATA_DEV_INFO__ = true;
}

const demos = {
	'Hello World': HelloWorld,
	'GitHub REST': GitHubRestApi,
	'WordPress REST': WPRestApi,
};

function DemoPlaceholder() {
	return (
		<div className="App-DemoBody">
			<p>Select a button above to view API data using Fresh Data</p>
		</div>
	);
}

function App() {
	const [selectedDemo, setSelectedDemo] = useState(null);

	const renderDemoButtons = () => {
		return Object.keys(demos).map(name => {
			return (
				<button
					key={name}
					className={`App-DemoButton ${selectedDemo === name ? "App-DemoButton-selected" : ""}`}
					onClick={() => setSelectedDemo(name)}
				>
					{name}
				</button>
			);
		});
	};

	const Demo = selectedDemo ? demos[selectedDemo] : DemoPlaceholder;

  return (
    <div className="App">
      <header className="App-header">
				<h1>Fresh Data 🥕</h1>
      </header>
			<div className="App-DemoButtonPanel">
				{renderDemoButtons()}
			</div>
			<div className="App-Line" />
			<Demo />
    </div>
  );
}

export default App;
