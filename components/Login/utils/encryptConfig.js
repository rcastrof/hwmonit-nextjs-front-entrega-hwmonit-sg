import { AES, HmacSHA512 } from "crypto-js";
const NodeRSA = require("node-rsa");
class encryptConfig {
    async encryptLogin(element) {
        var seed = process.env.REACT_APP_SEED;
        var encriptado = HmacSHA512(element, seed)
        return encriptado.toString();
    }
    
    rsaEncrypt(val) {
       
        
        const RSA_KEY = process.env.REACT_APP_RSA_KEY;
        const rsakey = new NodeRSA(RSA_KEY);
        return rsakey.encrypt(val, "base64");
    }
    RSALogin(email, pass) {
        
        let val =email +'|' + pass
      //ACA SE ESTA INDEFINIENDO
        val = this.rsaEncrypt(val)
        
        return val
    } 
}
export default new encryptConfig();

