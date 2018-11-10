import { Asset, Aspect, DataPoint, AggregatesResult } from './models';

/** 
 * Commonly used constants and URLs for MindSphere
 * see https://developer.mindsphere.io/concepts/concept-gateway-url-schemas.html#url-schemes
*/
const API_Base_Urls = {
  AssetManagement: "/api/assetmanagement/v3/assets",
  TimeSeries: "/api/iottimeseries/v3/timeseries",
  TimeSeriesAggregates: "/api/iottimeseries/v3/aggregates"
}

// See https://developer.mindsphere.io/concepts/concept-authentication.html#calling-apis-from-frontend for authentication
function getXSRFToken() {
  return document.cookie.replace(/(?:(?:^|.*;\s*)x-xsrf-token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
}

export function getAssets() {
  return fetch(API_Base_Urls.AssetManagement, {
    credentials: "include",
    headers: {
      "Content-Type": "application/hal+json",
      "x-xsrf-token": getXSRFToken()
    }
  })
  .then(function(response) {
    if (response.ok) {
      // 2xx status codes
      return response.json();
    }

    // 4xx and 5xx status codes
    const error = new Error(response.statusText);
    error.response = response;
    throw error;
  }).then(function(json) {
    return json._embedded.assets;
  }).catch(function(error) {
    console.log('something failed', error);

    // Check response for http status code
    if (error.response != null && error.response.status >= 400 && error.response.status <= 500) {
      try {
        // try to parse json error response from MindSphere APIs
        let mdspError = error.response.json();
        console.error(mdspError);
        throw mdspError;
      } catch (e) {
        // If response is not json, then most likely the MindSphere Gateway has thrown an error
        console.log('MindSphere Gateway error that should not happen', e);
      }
    }
  })
}

export function getAggregates(asset, aspect) {
  return fetch(`${API_Base_Urls.TimeSeriesAggregates}/${asset}/${aspect}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "x-xsrf-token": getXSRFToken()
    }
  })
  .then(function(response) {
    return response.json()
  }).then(function(json) {
    console.log('parsed json', json)
  }).catch(function(ex) {
    console.log('parsing failed', ex)
  })
}

export function getAsset(asset) {
  return fetch(`${API_Base_Urls.AssetManagement}/${asset}/`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/hal+json",
      "x-xsrf-token": getXSRFToken()
    }
  })
  .then(function(response) {
    return response.json()
  }).then(function(json) {
    console.log('parsed json', json)
  }).catch(function(ex) {
    console.log('parsing failed', ex)
  })
}

export function getAspect(asset, aspect) {
  return fetch(`${API_Base_Urls.AssetManagement}/${asset}/${aspect}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/hal+json",
      "x-xsrf-token": getXSRFToken()
    }
  })
  .then(function(response) {
    return response.json()
  }).then(function(json) {
    console.log('parsed json', json)
  }).catch(function(ex) {
    console.log('parsing failed', ex)
  })
}