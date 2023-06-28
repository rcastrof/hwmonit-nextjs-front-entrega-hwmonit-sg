const initialState = {
    user: null,
    error: ''
}
function userReducer(state = initialState, action) { 
    switch (action.type) {
        case 'USER_AUTHENTICATION':
            return {
                ...state,
                user: action.payload
            }
            case 'USER_AUTHENTICATION_ERROR':
                return {
                    ...state,
                    error: action.payload
                }
        default:
            return state
    }
}
export default userReducer