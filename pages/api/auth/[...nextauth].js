import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import encryptConfig from "../../../components/Login/utils/encryptConfig"
import axios from "axios";



const nextAuthOptions = (req, res) => {

    return ({
            providers: [
                CredentialsProvider({
                    async authorize (credentials){
                        try{
                            const {email, password} = credentials;
                            let integrity = encryptConfig.RSALogin(email, password);
                            const a = await axios.post(process.env.REACT_APP_API_URL+"login",
                            {
                                email: email,
                                password: password,
                            }, {
                                headers: {
                                    Integrity: integrity
                                }
                            }, { withCredentials: true })
                                .then(response => {
                                  
                                    return response


                                }).catch(error => {
                        
                                    res.setHeader('Set-Cookie', null)
                                 
                                    return (new Error(error.response.data.err.message))
                                });
                                if(a.error){
                                    return a
                                }else{
                                    const cookies = a.headers['set-cookie'];
                                res.setHeader('Set-Cookie', cookies);

                      
                                return a.data;

                                }
                                
                        }catch(error){
                                console.log(error);
                        }
                    }
                })
            ],
            
            pages: {
                signIn: "/",
                error: '/',
                signOut: '/',
                newUser: null,
            },
            secret: "safgopjpa29+va5cas29as"

    })
    

}

export default(req, res) => {
    return NextAuth(req, res, nextAuthOptions(req, res));
}