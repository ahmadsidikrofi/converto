'use client'

import React, { createContext, useContext, useEffect, useState } from "react"
import { auth, db } from "@/lib/firebase"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { useRouter, usePathname } from "next/navigation"

const AuthContext = createContext({
  user: null,
  userData: null,
  loading: true,
  logout: async () => { },
})

const GUEST_ROUTES = ["/login", "/register", "/"]
const PRIVATE_ROUTES = [
  "/sign-your-pdf",
  "/signature-drawer",
]

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true)
      if (currentUser) {
        setUser(currentUser)
        console.log(currentUser);


        // Fetch Firestore profile data
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid))
          if (userDoc.exists()) {
            setUserData(userDoc.data())
          } else {
            setUserData(null)
          }
        } catch (error) {
          console.error("Gagal mengambil data Firestore user:", error)
          setUserData(null)
        }
      } else {
        setUser(null)
        setUserData(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Client-side route guarding
  useEffect(() => {
    if (loading) return

    const isGuestRoute = GUEST_ROUTES.includes(pathname)
    const isPrivateRoute = PRIVATE_ROUTES.some(route => pathname.startsWith(route))

    if (user && isGuestRoute) {
      router.replace("/")
    } else if (!user && isPrivateRoute) {
      router.replace("/login")
    }
  }, [user, loading, pathname, router])

  const logout = async () => {
    try {
      await signOut(auth)
      router.push("/login")
    } catch (error) {
      console.error("Gagal logout:", error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, userData, loading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
