import { ref, set } from 'firebase/database'
import { produce } from 'immer'
import { auth, database } from 'lib/firebase'
import { uniqueId } from 'lodash'
import toast from 'react-hot-toast'
import { random } from 'utils/random'
import create from 'zustand'

interface User {
  id: string
  name: string
  email: string
  profilePic?: string
}

interface Wallet {
  balance: number
}

interface State {
  user: User
  wallet: Wallet
  isAuth: boolean
  signIn: () => Promise<void>
  signOut: () => Promise<void>
  setUser: (user: User) => void
  isAuthLoading: boolean
  isWalletLoading: boolean
  setBalance: (balance: number) => void
  setBalanceOnDatabase: (balance: number) => Promise<void>
  incrementBalance: (amount: number) => Promise<void>
  decrementBalance: (amount: number) => Promise<void>
  redeemGift: () => Promise<void>
}

function storeUser(user: User) {
  localStorage.setItem('uid', user.id)
  localStorage.setItem('name', user.name)
  localStorage.setItem('profilePic', user.profilePic || '')
}

function clearUser() {
  localStorage.removeItem('uid')
  localStorage.removeItem('name')
  localStorage.removeItem('profilePic')
}

const userInitialState: User = {
  id: '',
  name: '',
  email: ''
}

const walletInitialState: Wallet = {
  balance: 20
}

export const useAuthStore = create<State>((setState, getState) => ({
  user: userInitialState,
  wallet: walletInitialState,
  isAuthLoading: false,
  isWalletLoading: false,
  isAuth: false,
  setBalance: (balance: number) => {
    try {
      setState(
        produce<State>(state => {
          state.wallet.balance = balance
          state.isWalletLoading = false
        })
      )
    } catch (error) {
      toast.error('An error occurred while updating the balance')
      console.error('setBalanceError', error)
    }
  },
  setBalanceOnDatabase: async (balance: number) => {
    try {
      if (getState().isAuth) {
        const walletRef = ref(database, 'wallet/' + getState().user.id)
        await set(walletRef, {
          currentBalance: balance,
          user: {
            uid: getState().user.id,
            name: localStorage.getItem('name'),
            profilePic: localStorage.getItem('profilePic')
          }
        })
      }
    } catch (error) {
      toast.error('An error occurred while updating the balance')
      console.error('setBalanceOnDatabaseError', error)
    }
  },
  redeemGift: async () => {
    try {
      const balance = getState().wallet.balance
      if (balance >= 10) {
        toast.remove()
        toast.error('You need to have a balance below 10 to redeem the gift')
        return
      }
      const newBalance = random(10, 300)
      await getState().setBalanceOnDatabase(newBalance)
      toast.success('Gift successfully redeemed')
    } catch (error) {
      toast.error('An error occurred while redeeming the gift')
      console.error('redeemGiftError', error)
    }
  },
  incrementBalance: async (amount: number) => {
    try {
      setState(state => ({ ...state, isWalletLoading: true }))
      await getState().setBalanceOnDatabase(getState().wallet.balance + amount)
      setState(state => ({ ...state, isWalletLoading: false }))
    } catch (error) {
      toast.error('An error occurred while updating the balance')
      console.error('incrementBalanceError', error)
    }
  },
  decrementBalance: async (amount: number) => {
    try {
      setState(state => ({ ...state, isWalletLoading: true }))
      await getState().setBalanceOnDatabase(getState().wallet.balance - amount)
      setState(state => ({ ...state, isWalletLoading: false }))
    } catch (error) {
      toast.error('An error occurred while updating the balance')
      console.error('decrementBalanceError', error)
    }
  },
  signIn: async () => {
    try {
      setState(state => ({ ...state, isAuthLoading: true }))
      // const provider = new GoogleAuthProvider()
      // const { user } = await signInWithPopup(auth, provider)
      const uid = uniqueId()
      const user = {
        uid,
        displayName: uid,
        photoURL: '',
        email: `${uid}@mail.com`
      }

      const { uid: id, displayName: name, photoURL: profilePic, email } = user
      if (name && email) {
        const newUser = { id, name, email, profilePic: profilePic || '' }
        storeUser(newUser)
        setState(
          produce<State>(state => {
            state.user = newUser
            state.isAuth = true
            state.isAuthLoading = false
          })
        )
      }
      setState(state => ({ ...state, isLoading: false }))
    } catch (error) {
      toast.error('An error occurred while logging in')
      console.error('signInError', error)
    }
  },
  signOut: async () => {
    try {
      setState(state => ({ ...state, isAuthLoading: true }))
      await auth.signOut()
      clearUser()
      setState(
        produce<State>(state => {
          state.user = userInitialState
          state.isAuth = false
          state.isAuthLoading = false
        })
      )
    } catch (error) {
      toast.error('An error occurred while logging out')
      console.error('signOutError', error)
    }
  },
  setUser: (user: User) => {
    try {
      setState(
        produce<State>(state => {
          state.user = user
          state.isAuth = true
          state.isAuthLoading = false
        })
      )
    } catch (error) {
      toast.error('An error occurred while updating user data')
      console.error('setUserError', error)
    }
  }
}))
