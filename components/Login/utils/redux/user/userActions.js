export const userAuthentication = (user = null ) => {
    return {
      type: 'USER_AUTHENTICATION',
      payload: user
    }
  }
  export const userAuthenticationError = (error = '' ) => {
    return {
      type: 'USER_AUTHENTICATION_ERROR',
      payload: error
    }
  }
