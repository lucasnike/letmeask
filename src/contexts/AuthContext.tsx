import { getAuth, GoogleAuthProvider } from "@firebase/auth"
import { signInWithPopup } from "firebase/auth"
import { createContext, ReactNode, useEffect, useState } from "react"

type User = {
  id: string,
  name: string,
  avatar: string
}

type AuthContextType = {
  user: User | undefined;
  signInWithGoole: () => Promise<void>;
}

type AuthContextProviderProps = {
  children: ReactNode
}

export const authContext = createContext({} as AuthContextType)


export function AuthContextProvider(props: AuthContextProviderProps) {

  const auth = getAuth();
  const [user, setUser] = useState<User>()


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        const { displayName, photoURL, uid } = user

        if (!displayName || !photoURL) {
          throw new Error('Missing Information from Google Account')
        }
        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
        })
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  async function signInWithGoole() {
    const provider = new GoogleAuthProvider()

    const result = await signInWithPopup(auth, provider)
    if (result.user) {
      const { displayName, photoURL, uid } = result.user

      if (!displayName || !photoURL) {
        throw new Error('Missing Information from Google Account')
      }
      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL
      })
    }

  }

  return (
    <authContext.Provider value={{ user, signInWithGoole }} >
      {props.children}
    </authContext.Provider>
  )
}