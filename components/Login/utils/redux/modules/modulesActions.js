export const modulesData = (modulesData = null ) => {
    return {
      type: 'MODULES_DATACONFIG',
      infoRol: modulesData
    }
  }
  export const modulesDataError = (error = '' ) => {
    return {
      type: 'MODULES_DATACONFIG_ERROR',
      infoRol: error
    }
  }
