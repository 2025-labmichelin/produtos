import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({ request: req })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value))
          res = NextResponse.next({ request: req })
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          )
        },
      },
    },
  )

  // getUser() valida o JWT no servidor — mais seguro que getSession()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    if (user.email !== process.env.OWNER_EMAIL) {
      return NextResponse.redirect(new URL('/hub', req.url))
    }
  }

  return res
}

export const config = {
  // /certificado é público — não entra no matcher
  matcher: ['/hub/:path*', '/fase/:path*', '/dashboard/:path*'],
}
