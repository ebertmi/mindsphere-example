import { connect } from 'react-redux'
import Monitor from '../components/Monitor';
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
  }
}

const ControllableMonitor = connect(
  mapStateToProps,
  mapDispatchToProps
)(Monitor)

export default ControllableMonitor