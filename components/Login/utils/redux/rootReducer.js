import { combineReducers } from 'redux';
import userReducer from './user/userReducer';
import rolesReducer from './roles/rolesReducer';
import modulesReducer from './modules/modulesReducer'
import submodulesReducer from './submodules/submodulesReducer'
export default combineReducers({
    user: userReducer, 
    rolData: rolesReducer,
    submodulesdata: submodulesReducer,
    modulesData: modulesReducer
})
