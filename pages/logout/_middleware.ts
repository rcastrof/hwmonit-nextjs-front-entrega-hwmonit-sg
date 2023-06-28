import { setCookie } from 'cookies-next'
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest, ev: NextFetchEvent) {

 let res= NextResponse.next();
    
    res.cookie('auth', '', {
       // Configs when you set cookies options like httpOnly: true,...
      expires: new Date(0), // Important here to let browser auto remove cookie
    });
    res.cookie('modules', '', {
      // Same above
      expires: new Date(0), // Same above
    });
    res.cookie('next-auth.session-token', '', {
      // Same above
      expires: new Date(0), // Same above
    });
    res.cookie('next-auth.csrf-token', '', {
      // Same above
      expires: new Date(0), // Same above
    });

    console.log("cerrando sesion")
      return res;
    
   
}
