import '../styles/globals.css'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";


function MyApp({
  Component,
  pageProps
}) {
  
    return(

      <Component {...pageProps} />

   
  ) 
}

export default MyApp
