const initialState = {
    submodulesdata: [],
    error: ''
}
function submodulesReducer(state = initialState, action) {
    switch (action.type) {
        case 'SUBMODULES_DATACONFIG':
            return {
                ...state,
                submodulesdata: action.payload
            }
            case 'SUBMODULES_DATACONFIG_ERROR':
                return {
                    ...state,
                    error: action.payload
                }
        default:
            return state
    }
}
export default submodulesReducer