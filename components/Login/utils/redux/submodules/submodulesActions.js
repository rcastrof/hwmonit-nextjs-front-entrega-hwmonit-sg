export const submodulesdata = (submodulesdata = [] ) => {
    return {
      type: 'SUBMODULES_DATACONFIG',
      infosubmodules: submodulesdata
    }
  }
  export const submodulesError = (error = '' ) => {
    return {
      type: 'SUBMODULES_DATACONFIG_ERROR',
      infosubmodules: error
    }
  }
