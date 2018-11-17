import { Asset, Aspect, DataPoint, AggregatesResult, AggregationIntervalUnits } from './models';
import { isArray } from 'util';

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

const DefaultRequestOptions = {
  headers: {},
  credentials: "include"
}

/**
 *
 *
 * @export
 * @param {string} url - relative Url, e.g. MindSphere API or App endpoint
 * @param {object} [headers={}] - headers to send with the request, e.g. xsrf-token, Content-Type
 * @param {string} [credentials="include"] - define how and if credentials should be included
 * @returns
 */
export async function requestMindSphereEndpoint(url, options=DefaultRequestOptions) {
  let response;
  let jsonBody;
  let errorBody;
  let normalizedError;
  
  try {
    response = await fetch(url, options);
  } catch (e) {
    // ToDo: here we ran into some network issues
    errorBody = {
      message: "The request failed due to network problems"
    }

    e.properties = errorBody;
    throw e;
  }

  if (response.ok) {
    jsonBody = await response.json();
    return jsonBody;
  }

  // 4xx and 5xx status codes
  // Check response for http status code
  if (response.status >= 400 && response.status <= 500) {
    try {
      // try to parse json error response from MindSphere APIs
      errorBody = await response.json();
    } catch (e) {
      // If response is not json, then most likely the MindSphere Gateway has thrown an error
      console.info('Invalid JSON', e);
      errorBody = {
        message: "Unexpected error (invalid response)"
      }
    }

    // MindSphere Gateway errors might be wrapped in an array
    if (isArray(errorBody)) {
      errorBody = errorBody.shift();
    }

    // Normalize invalid token error message
    if (errorBody.message == null && errorBody.error_description != null) {
      errorBody.message = errorBody.error_description;
    }

  } else {
    // in case of 501, 502 or 503
    errorBody = {
      message: "Service is not reachable at the moment"
    }
  }

  normalizedError = new Error(errorBody.message);
  normalizedError.properties = errorBody;
  throw normalizedError;
}

/**
 * Get all assets in the context of the currently logged-in user. The user context defines
 * the tenant and (optionally) sub-tenant.
 *
 * @export
 * @throws {Error} - error when HTTP request fails or 4XX - 5XX response
 * @returns {Array} - list of assets
 */
export async function getAssets() {
  let response;

  try {
    response = await requestMindSphereEndpoint(API_Base_Urls.AssetManagement, {
      credentials: "include",
      headers: {
        "Content-Type": "application/hal+json",
        "x-xsrf-token": getXSRFToken()
      }
    });

    // Map now the response to the our lightweight representation
    const assets = response._embedded.assets.map(asset => {
      return new Asset(asset.name, asset.description, asset.typeId, asset.parentId, asset.assetId);
    });

    return assets;
  } catch (e) {
    throw e;
  }
}

/**
 *
 *
 * @export
 * @param {*} asset
 * @param {*} aspect
 * @returns {Array} list of aggregated values in interval
 */
export async function getAggregates(asset, aspect, from, to, intervalUnit=AggregationIntervalUnits.Minute, intervalValue=2, select=null) {
  let response;

  try {
    response = await requestMindSphereEndpoint(`${API_Base_Urls.TimeSeriesAggregates}/${asset}/${aspect}?from=${from}&to=${to}${select != null ? "&select="+select : ""}&intervalUnit=${intervalUnit}&intervalValue=${intervalValue}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "x-xsrf-token": getXSRFToken()
      }
    });

    return response;
  } catch (e) {
    throw e;
  }
}

/**
 *
 *
 * @export
 * @param {*} asset
 * @param {*} aspect
 * @returns {Array} list of aggregated values in interval
 */
export async function getTimeSeries(asset, aspect, from, to, select=null) {
  let response;

  const fromQuery = from != null ? `from=${from}` : "";
  const toQuery = to != null ? `to=${to}` : "";
  const selectQuery = from != null ? `select=${select}` : "";

  // build query
  let query = [fromQuery, toQuery, selectQuery].reduce((acc, val) => {
    if (val !== "") {
      return `${acc}&${val}`;
    }

    return acc;
  }, "");

  try {
    response = await requestMindSphereEndpoint(`${API_Base_Urls.TimeSeries}/${asset}/${aspect}?${query}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "x-xsrf-token": getXSRFToken()
      }
    });

    return response;
  } catch (e) {
    throw e;
  }
}

export async function getAsset(asset) {
  let response;

  try {
    response = await requestMindSphereEndpoint(`${API_Base_Urls.AssetManagement}/${asset}/`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/hal+json",
        "x-xsrf-token": getXSRFToken()
      }
    });

    return response;
  } catch (e) {
    throw e;
  }
}

export async function getAspects(asset) {
  let response;

  try {
    response = await requestMindSphereEndpoint(`${API_Base_Urls.AssetManagement}/${asset}/aspects`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/hal+json",
        "x-xsrf-token": getXSRFToken()
      }
    });

    // Map response to internal data models
    return response._embedded.aspects.map(aspect => {
      return new Aspect(aspect.name, aspect.description, aspect.aspectTypeId, aspect.variables);
    });
  } catch (e) {
    throw e;
  }
}

export async function getAspect(asset, aspect) {
  let response;

  try {
    response = await requestMindSphereEndpoint(`${API_Base_Urls.AssetManagement}/${asset}/${aspect}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/hal+json",
        "x-xsrf-token": getXSRFToken()
      }
    });

    return response;
  } catch (e) {
    throw e;
  }
}