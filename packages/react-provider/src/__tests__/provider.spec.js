import * as rtl from '@testing-library/react';
import React from 'react';
import PropTypes from 'prop-types';
import { actions } from '@fresh-data/framework';
import { ApiProvider, mapStateToProps } from '../provider';
import '@testing-library/jest-dom/extend-expect';

describe( 'ApiProvider', () => {
	let apiSpec;

	beforeEach( () => {
		apiSpec = {
			name: 'testApiSpec',
		};
	} );

	describe( '#getApiClient', () => {
		it( 'should create new API client and pass it down to children via context.', () => {
			const ChildComponent = ( props, context ) => {
				const apiClient = context.getApiClient();

				return (
					<div data-testid="apiClient">
						ApiClient: { apiClient.getName() }
					</div>
				);
			};
			ChildComponent.contextTypes = { getApiClient: PropTypes.func };

			const { getByTestId } = rtl.render(
				<ApiProvider
					apiSpec={ apiSpec }
					apiName={ 'test-api' }
					rootData={ {} }
					dataRequested={ actions.dataRequested }
					dataReceived={ actions.dataReceived }
				>
					<ChildComponent />
				</ApiProvider>
			);

			expect( getByTestId( 'apiClient' ) ).toHaveTextContent(
				'ApiClient: testApiSpec'
			);
		} );

		it( 'ApiClient should be null if no apiSpec prop is set.', () => {
			console.error = jest.fn(); // eslint-disable-line no-console

			const ChildComponent = ( props, context ) => {
				const apiClient = context.getApiClient();

				return (
					<div data-testid="apiClient">
						ApiClient: { JSON.stringify( apiClient ) }
					</div>
				);
			};
			ChildComponent.contextTypes = { getApiClient: PropTypes.func };

			const { getByTestId } = rtl.render(
				<ApiProvider
					apiSpec={ null }
					apiName={ 'test-api' }
					rootData={ {} }
					dataRequested={ actions.dataRequested }
					dataReceived={ actions.dataReceived }
				>
					<ChildComponent />
				</ApiProvider>
			);

			expect( getByTestId( 'apiClient' ) ).toHaveTextContent(
				'ApiClient: null'
			);
		} );
	} );

	describe( '#mapStateToProps', () => {
		const ownProps = { rootPath: 'freshData' };

		it( 'should map rootData based on rootPath', () => {
			const myState = { freshDataState: true };
			const state = {
				freshData: myState,
			};

			const derivedProps = mapStateToProps( state, ownProps );
			expect( derivedProps.rootData ).toBe( myState );
		} );

		it( 'should default to empty object', () => {
			const state = {};

			const derivedProps = mapStateToProps( state, ownProps );
			expect( derivedProps.rootData ).toEqual( {} );
		} );
	} );
} );
