const modulesState = {
    modulesData: null,
    error: ''
}
function modulesReducer(state = modulesState, action) {
    switch (action.type) {
        case 'MODULES_DATACONFIG':
            return {
                ...state,
                modulesData: action.modulesData
            }
            case 'MODULES_DATACONFIG_ERROR':
                return {
                    ...state,
                    error: action.modulesData
                }
        default:
            return state
    }
    
}
export default modulesReducer