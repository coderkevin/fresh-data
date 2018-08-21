import { Component } from 'react';
import { connect } from 'react-redux';
import debugFactory from 'debug';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import * as actions from './actions';
import ApiClient from '../client';

const debug = debugFactory( 'fresh-data:api-provider' );

export class ApiProvider extends Component {
	static propTypes = {
		children: PropTypes.node,
		apiName: PropTypes.string.isRequired,
		apiSpec: PropTypes.object.isRequired, // TODO: Add shape for api spec
		rootPath: PropTypes.oneOfType( [
			PropTypes.arrayOf( PropTypes.oneOfType( [ PropTypes.string, PropTypes.number ] ) ),
			PropTypes.string,
		] ),
		rootData: PropTypes.object.isRequired,
		dataRequested: PropTypes.func.isRequired,
		dataReceived: PropTypes.func.isRequired,
	};

	static defaultProps = {
		rootPath: [ 'freshData' ],
	};

	static childContextTypes = {
		getApiClient: PropTypes.func.isRequired,
	};

	constructor( props ) {
		super( ...arguments );
		this.apiClient = null;
		this.update( props );
	}

	getChildContext() {
		return { getApiClient: this.getApiClient };
	}

	componentDidMount() {
		this.update( this.props );
	}

	componentDidUpdate() {
		this.update( this.props );
	}

	shouldComponentUpdate( nextProps ) {
		const { apiSpec, rootData } = nextProps;
		return ( this.lastApi !== apiSpec || this.lastRootData !== rootData );
	}

	update( props ) {
		const { dataRequested, dataReceived } = this;
		const { apiName, apiSpec, rootData } = props;
		const apiChanged = apiSpec && this.lastApi !== apiSpec;
		const stateChanged = apiSpec && this.lastRootData !== rootData;

		if ( apiChanged ) {
			debug( `Updating apiSpec ${ apiName }: `, apiSpec );
			this.apiClient = new ApiClient( apiSpec );
			this.apiClient.setDataHandlers( { dataRequested, dataReceived } );
			this.lastApi = apiSpec;
		}

		if ( stateChanged || apiChanged ) {
			debug( 'Updating root data: ', rootData );
			this.apiClient.setState( rootData[ apiName ] || {} );
			this.lastRootData = rootData;
		}
	}

	getApiClient = () => {
		return this.apiClient;
	}

	dataRequested = ( resourceNames ) => {
		const { apiName } = this.props;
		const { dataRequested } = this.props;
		dataRequested( apiName, resourceNames );
	}

	dataReceived = ( resources ) => {
		const { apiName } = this.props;
		const { dataReceived } = this.props;
		dataReceived( apiName, resources );
	};

	render() {
		return this.props.children;
	}
}

export function mapStateToProps( state, ownProps ) {
	const { rootPath } = ownProps;
	const rootData = get( state, rootPath, {} );
	return { rootData };
}

const ConnectedApiProvider = connect( mapStateToProps, actions )( ApiProvider );

// Ensure the defaults props are assigned the first time mapStateToProps() is run.
ConnectedApiProvider.defaultProps = ApiProvider.defaultProps;

export default ConnectedApiProvider;
