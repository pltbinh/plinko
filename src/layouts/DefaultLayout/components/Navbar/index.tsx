import plinkoLogo from '@images/logo-1.png'
import classNames from 'classnames'
import { Gift, SignOut } from 'phosphor-react'
import { Link } from 'react-router-dom'
import { useAuthStore } from 'store/auth'
import { useGameStore } from 'store/game'

import { WalletCard } from '../WalletCard'

export function Navbar() {
  const inGameBallsCount = useGameStore(state => state.gamesRunning)
  const currentBalance = useAuthStore(state => state.wallet.balance)
  const isAuth = useAuthStore(state => state.isAuth)
  const signOut = useAuthStore(state => state.signOut)

  async function handleSignOut() {
    await signOut()
  }

  return (
    <nav className="sticky top-0 z-50 bg-primary px-4 shadow-lg">
      <div
        className={classNames(
          'mx-auto flex h-16 w-full max-w-[1400px] items-center',
          {
            'justify-between': isAuth,
            'justify-center': !isAuth
          }
        )}
      >
        <Link to={inGameBallsCount ? '#!' : '/'}>
          <img src={plinkoLogo} alt="" className="w-32 md:w-40" />
          {/* <p className="text-lg font-bold text-white">PLINKO</p> */}
        </Link>
        {isAuth && (
          <div className="flex items-stretch gap-4">
            <WalletCard balance={currentBalance} showFormatted />
            <button
              title="Sair"
              onClick={handleSignOut}
              className="rounded-md bg-indigo-800 px-4 text-text hover:bg-indigo-700"
            >
              <SignOut weight="bold" />
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
