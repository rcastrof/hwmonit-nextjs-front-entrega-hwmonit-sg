import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest, ev: NextFetchEvent) {

  


  const {pathname} = req.nextUrl
  if(req.cookies.modules){
    let modules = JSON.parse(req.cookies.modules)[0]

 

    if(pathname==="/content"){

      return NextResponse.redirect(`/content${modules.pathModule}`)
    }else{
      NextResponse.next()
    }
  }else{
    return NextResponse.redirect('/')
  }
  
  
}
