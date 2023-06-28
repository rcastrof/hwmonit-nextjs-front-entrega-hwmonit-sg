import { useRouter } from "next/router";
import axios from 'axios';
import {React, useEffect } from "react";
export default function Index(props) {
    const router = useRouter()
    
    useEffect(()=>{

        async function serverlogout(){
          await logout()
        }
        serverlogout()
        window.location.replace("/");
           
        
    },[])

    const logout = async () => {
      const response = await new Promise((resolve, reject) => {
          axios.get(`${process.env.REACT_APP_API_URL}logout`, { withCredentials: true })
              .then(response => {
                  resolve(response.data);

              }).catch(error => {
                  
                  resolve(error);
              })
      });


  }
    return (
      
      <>Cerrando sesión</>
     
    )
  }