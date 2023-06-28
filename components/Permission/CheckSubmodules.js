export function checkSubmodule(submodules, name){

    let resultSubmodule = submodules.filter((submodule) => submodule.nameSubmodule === name)
    if (resultSubmodule.length!==0){
        return resultSubmodule[0].active
    }else{return false}
}