import { useEffect, useRef } from 'react';

//Hook Que evita que nose ejecute la primera vez, hasta cuando se renderiza
const useDidMountEffect = (func, deps) => {
    const didMount = useRef(false);

    useEffect(() => {
        if (didMount.current) func();
        else didMount.current = true;
    }, deps);
}

export default useDidMountEffect;