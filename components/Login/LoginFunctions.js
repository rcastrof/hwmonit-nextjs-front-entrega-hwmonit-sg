import axios from 'axios';
import store from "./utils/store"
import encryptConfig from "../../components//utils/encryptConfig"

 

class Functions {

    validate(correo, pass) {
        if (correo.trim() !== '') {
            if (!this.validateEmail(correo.trim())) {
                return "Email no tiene el formato correcto";
            }
        }
        if (correo.trim() === '' || pass.trim() === '') {
            return "Ingrese datos de autenticación";
        }
    }

    auth(email, password) {
       
        let integrity = encryptConfig.RSA(email, password);
        
        return new Promise((resolve, reject) => {
            axios.post(process.env.REACT_APP_API_URL+"",
                {
                    email: email,
                    password: password,
                }, {
                    headers: {
                        Integrity: integrity
                    }
                }, { withCredentials: true })
                    .then(response => {
                        store.dispatch({
                            type: 'USER_AUTHENTICATION',
                            payload: response.data
                        });
                        resolve(true)
                    }).catch(error => {
                        store.dispatch({
                            type: 'USER_AUTHENTICATION_ERROR',
                            payload: 'Error al autenticar'
                        });
                        resolve(false)
                    })
            })
    }

    validateEmail(email) {
        const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
        return expression.test(String(email).toLowerCase())
    }
    
}
export default new Functions();