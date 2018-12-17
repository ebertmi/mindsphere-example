import { combineReducers } from 'redux';
import {
  SELECT_ASSET,
  SELECT_ASPECT,
  SHOW_SESSION_MODAL,
  INTERVAL_START_LATEST,
  FETCH_ASPECTS_FAILED,
  FETCH_ASSETS_FAILED,
  FETCH_ASPECTS_SUCCESS,
  FETCH_ASSETS_SUCCESS
} from '../actions';

import {
  AggregationIntervalUnits
} from '../models';

const INITIAL_UI_STATE = {
  isSessionModalVisible: false,
  isFetching: false,
  assetFetchingError: null,
  aspectFetchingError: null
};

function ui(state = INITIAL_UI_STATE, action) {
  switch (action.type) {
    case SHOW_SESSION_MODAL:
      return {
        ...state,
        isSessionModalVisible: true
      };
    case FETCH_ASPECTS_FAILED:
      return {
        ...state,
        aspectFetchingError: action.error
      }
    case FETCH_ASSETS_FAILED:
      return {
        ...state,
        assetFetchingError: action.error
      }
    case FETCH_ASPECTS_SUCCESS:
      return {
        ...state,
        aspectFetchingError: null
      }
      case FETCH_ASSETS_SUCCESS:
      return {
        ...state,
        assetFetchingError: null 
      }
    default:
      return state;
  }
}

const INITIAL_IOT_STATE = {
  assets: [],
  selectedAsset: null,
  selectedAspect: null,
  intervalUnit: AggregationIntervalUnits.Minute,
  intervalValue: 2,
  intervalStartDate: INTERVAL_START_LATEST,
  interval: {
    from: null,
    to: null,
    data: []
  } 
}

function iot(state = INITIAL_IOT_STATE, action) {
  switch (action.type) {
    case FETCH_ASSETS_SUCCESS:
      return {
        ...state,
        assets: action.assets,
        selectedAsset: action.assets.length > 0 ? action.assets[0] : null,
        selectedAspect: null
      };
    case FETCH_ASPECTS_SUCCESS:
      // ToDo: update aspect for asset and aspect selection
      return {
        ...state,
        selectedAspect: action.asset.getAspects().length > 0 ? action.asset.getAspects()[0] : null
      };
    case SELECT_ASSET:
      return {
        ...state,
        selectedAsset: action.asset,
        selectedAspect: action.asset.getAspects().length > 0 ? action.asset.getAspects()[0] : null
      }
    case SELECT_ASPECT:
      return {
        ...state,
        selectedAspect: action.aspect
      }
    default:
      return state;
  }
}

const app = combineReducers({
  ui,
  iot
});

export default app;