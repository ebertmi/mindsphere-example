// Simple data utility


export function getAssets() {
  return fetch('/api/assetmanagement/v3/assets')
  .then(function(response) {
    return response.json()
  }).then(function(json) {
    console.log('parsed json', json)
  }).catch(function(ex) {
    console.log('parsing failed', ex)
  })
}

export function getAggregates(asset, aspect) {
  // 
  return fetch(`/api/iottimeseries/v3/aggregates/${asset}/${aspect}`)
  .then(function(response) {
    return response.json()
  }).then(function(json) {
    console.log('parsed json', json)
  }).catch(function(ex) {
    console.log('parsing failed', ex)
  })
}