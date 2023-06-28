export const rolesData = (rolData = null ) => {
    return {
      type: 'ROLES_DATACONFIG',
      infoRol: rolData
    }
  }
  export const rolesDataError = (error = '' ) => {
    return {
      type: 'ROLES_DATACONFIG_ERROR',
      infoRol: error
    }
  }
