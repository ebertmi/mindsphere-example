import { connect } from 'react-redux'
import AssetAspectList from '../components/AssetAspectList';
import { selectAsset, selectAspect, fetchAssets, fetchAspects } from '../actions';

const mapStateToProps = state => {
  return {
    assets: state.iot.assets,
    selectedAsset: state.iot.selectedAsset,
    selectedAspect: state.iot.selectedAspect,
    assetFetchingError: state.ui.assetFetchingError,
    aspectFetchingError: state.ui.aspectFetchingError,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchAssets: () => dispatch(fetchAssets()),
    fetchAspects: id => dispatch(fetchAspects(id)),
    onSelectAsset: asset => dispatch(selectAsset(asset)),
    onSelectAspect: aspect => dispatch(selectAspect(aspect))
  }
}

const SelectableAssetList = connect(
  mapStateToProps,
  mapDispatchToProps
)(AssetAspectList)

export default SelectableAssetList