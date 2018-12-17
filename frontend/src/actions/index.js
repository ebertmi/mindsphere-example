import { getAssets, getAspects } from "../service";

/*
 * action types
 */
export const SET_ASSETS = 'SET_ASSETS';
export const SELECT_ASSET = 'SELECT_ASSET';
export const SELECT_ASPECT = 'SELECT_ASPECT';
export const SHOW_SESSION_MODAL = 'SHOW_SESSION_MODAL';
export const HIDE_SESSION_MODAL = 'HIDE_SESSION_MODAL';
export const CHANGE_INTERVAL_UNIT = 'CHANGE_INTERVAL_UNIT';
export const CHANGE_INTERVAL_VALUE = 'CHANGE_INTERVAL_VALUE ';
export const CHANGE_START_DATE = 'CHANGE_START_DATE ';
export const FETCH_ASSETS = 'FETCH_ASSETS';
export const FETCH_ASPECTS = 'FETCH_ASPECTS';
export const FETCH_ASSETS_FAILED = 'FETCH_ASSETS_FAILED';
export const FETCH_ASSETS_SUCCESS = 'FETCH_ASSETS_SUCCESS ';
export const FETCH_ASPECTS_FAILED = 'FETCH_ASPECTS_FAILED';
export const FETCH_ASPECTS_SUCCESS = 'FETCH_ASPECTS_SUCCESS';

/*
 * other constants
 */
export const INTERVAL_START_NOW = 'INTERVAL_START_NOW';
export const INTERVAL_START_LATEST = 'INTERVAL_START_LATEST';

/*
 * action creators
 */
export function fetchAssets() {
  return async function (dispatch) {
    let assets;
    try {
      assets = await getAssets();
    } catch (e) {
      dispatch({
        type: FETCH_ASSETS_FAILED,
        error: e.properties
      });

      return;
    }

    dispatch({
      type: FETCH_ASSETS_SUCCESS,
      assets
    });
  };
}

export function fetchAspects(asset) {
  return async function (dispatch) {
    let aspects;
    try {
      aspects = await getAspects(asset.assetId);
    } catch (e) {
      dispatch({
        type: FETCH_ASPECTS_FAILED,
        error: e.properties
      });
    }

    dispatch({
      type: FETCH_ASPECTS_SUCCESS,
      aspects
    });
  }; 
}

export function changeIntervalUnit(unit) {
  return {
    type: CHANGE_INTERVAL_UNIT,
    unit
  }
}

export function changeIntervalValue(value) {
  return {
    type: CHANGE_INTERVAL_VALUE,
    value
  }
}

export function changeStartDate(date) {
  return {
    type: CHANGE_START_DATE,
    date
  }
}

export function selectAsset(asset) {
  return {
    type: SELECT_ASSET, 
    asset
  }
}

export function selectAspect(aspect) {
  return {
    type: SELECT_ASPECT, 
    aspect
  }
}

export function showSessionModal() {
  return {
    type: SHOW_SESSION_MODAL, 
  }
}

export function hideSessionModal() {
  return {
    type: HIDE_SESSION_MODAL,
  }
}