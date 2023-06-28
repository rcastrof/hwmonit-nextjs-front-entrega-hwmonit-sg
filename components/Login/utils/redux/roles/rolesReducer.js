const rolState = {
    rolData: null,
    error: ''
}
function rolesReducer(state = rolState, action) {
    switch (action.type) { 
        case 'ROLES_DATACONFIG':
            return {
                ...state,
                rolData: action.rolData
            }
            case 'ROLES_DATACONFIG_ERROR':
                return {
                    ...state,
                    error: action.rolData
                }
        default:
            return state
    }
    
}
export default rolesReducer