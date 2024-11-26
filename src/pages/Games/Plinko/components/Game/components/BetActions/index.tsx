import { CurrencyDollarSimple, Star } from 'phosphor-react'
import { ChangeEvent, useState } from 'react'
import { useAuthStore } from 'store/auth'

import { LinesType } from '../../@types'

interface PlinkoBetActions {
  onRunBet: (betValue: number) => void
  onChangeLines: (lines: LinesType) => void
  inGameBallsCount: number
}

interface SwitchButtonProp {
  onToggle: () => void
  value: boolean
}

function timeout(delay: number) {
  // eslint-disable-next-line promise/param-names
  return new Promise(res => setTimeout(res, delay))
}

const Switch = ({ value, onToggle }: SwitchButtonProp) => {
  return (
    <div className="flex justify-end">
      <span className="ml-3 mr-2 text-lg" id="modeLabel">
        Auto Mode
      </span>
      <label className="relative inline-flex cursor-pointer items-center">
        <input
          type="checkbox"
          id="modeSwitch"
          className="toggle sr-only"
          onChange={onToggle}
          checked={value}
        />
        <div
          className={`h-6 w-12 rounded-full ${
            value ? 'bg-indigo-700' : ' bg-gray-300'
          } shadow-inner`}
        ></div>
        <div
          className={`absolute h-6 w-6 transform rounded-full bg-white shadow transition-transform duration-200 ease-in-out ${
            value ? 'translate-x-6' : ''
          } peer-checked:translate-x-6`}
        ></div>
      </label>
    </div>
  )
}
export function BetActions({
  onRunBet,
  onChangeLines,
  inGameBallsCount
}: PlinkoBetActions) {
  const isLoading = useAuthStore(state => state.isWalletLoading)
  const currentBalance = useAuthStore(state => state.wallet.balance)
  const decrementCurrentBalance = useAuthStore(state => state.decrementBalance)
  const isAuth = useAuthStore(state => state.isAuth)
  const [betValue, setBetValue] = useState(1)
  const [isAuto, setIsAuto] = useState(false)
  const [amount, setAmount] = useState(1)

  const maxLinesQnt = 16
  const linesOptions: number[] = []
  for (let i = 8; i <= maxLinesQnt; i++) {
    linesOptions.push(i)
  }

  function handleChangeBetValue(e: ChangeEvent<HTMLInputElement>) {
    if (!isAuth || isLoading) return
    e.preventDefault()
    const value = +e.target.value
    const newBetValue = value >= currentBalance ? currentBalance : value
    setBetValue(newBetValue)
  }

  function handleChangeLines(e: ChangeEvent<HTMLSelectElement>) {
    if (!isAuth || isLoading) return

    onChangeLines(Number(e.target.value) as LinesType)
  }

  function handleHalfBet() {
    if (!isAuth || isLoading) return
    const value = betValue / 2
    const newBetvalue = value <= 0 ? 0 : Math.floor(value)
    setBetValue(newBetvalue)
  }

  function handleDoubleBet() {
    if (!isAuth || isLoading) return
    const value = betValue * 2

    if (value >= currentBalance) {
      setBetValue(currentBalance)
      return
    }

    const newBetvalue = value <= 0 ? 0 : Math.floor(value)
    setBetValue(newBetvalue)
  }

  function handleMaxBet() {
    if (!isAuth || isLoading) return
    setBetValue(currentBalance)
  }

  function handleToggleMode() {
    setIsAuto(!isAuto)
  }

  function handleChangeAmount(e: ChangeEvent<HTMLInputElement>) {
    if (!isAuth || isLoading) return
    e.preventDefault()
    const value = +e.target.value
    const maxAmount = currentBalance / betValue
    const newAmount = value >= maxAmount ? maxAmount : value
    setAmount(newAmount)
  }

  async function handleRunBet() {
    if (!isAuth || isLoading) return
    if (inGameBallsCount >= 15) return
    if (betValue > currentBalance) {
      setBetValue(currentBalance)
      return
    }
    if (isAuto) {
      for (let i = 0; i < amount; i++) {
        onRunBet(betValue)
        if (betValue <= 0) return
        decrementCurrentBalance(betValue)
        await timeout(300)
      }
    } else {
      onRunBet(betValue)
      if (betValue <= 0) return
      await decrementCurrentBalance(betValue)
    }
  }

  return (
    <div className="relative h-1/2 w-full flex-1 px-4 py-8">
      <span className="absolute left-4 top-0 mx-auto text-xs font-bold text-text md:text-base">
        *balls in play {inGameBallsCount}/15
      </span>
      <div className="flex h-full flex-col gap-4 rounded-md bg-primary p-4 text-text md:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col items-stretch gap-2">
            <div className="flex w-full flex-col gap-2 text-sm font-bold md:text-base">
              <Switch value={isAuto} onToggle={handleToggleMode} />
              <div className="flex flex-1 items-stretch justify-between">
                <span>Bet value</span>
                <div className="flex items-center gap-1">
                  <div className="rounded-full bg-indigo-700 p-0.5">
                    <Star size={18} />
                  </div>
                  <span>{(betValue * amount).toFixed(2)}</span>
                </div>
              </div>
              <div className="flex items-stretch justify-center shadow-md">
                <input
                  type="number"
                  min={0}
                  max={currentBalance}
                  onChange={handleChangeBetValue}
                  value={betValue}
                  className="w-full rounded-bl-md rounded-tl-md border-2 border-secondary bg-background p-2.5 px-4 font-bold transition-colors placeholder:font-bold placeholder:text-text focus:border-indigo-700 focus:outline-none md:p-2"
                />
                <button
                  onClick={handleHalfBet}
                  className="relative border-2 border-transparent bg-secondary p-2.5 px-3 transition-colors after:absolute after:right-0 after:top-[calc(50%_-_8px)] after:h-4 after:w-0.5 after:rounded-lg after:bg-background after:content-[''] hover:bg-secondary/80 focus:border-indigo-700 focus:outline-none md:p-2"
                >
                  ½
                </button>
                <button
                  onClick={handleDoubleBet}
                  className="relative border-2 border-transparent bg-secondary p-2.5 px-3 transition-colors after:absolute after:right-0 after:top-[calc(50%_-_8px)] after:h-4 after:w-0.5 after:rounded-lg after:bg-background after:content-[''] hover:bg-secondary/80 focus:border-indigo-700 focus:outline-none md:p-2"
                >
                  2x
                </button>
                <button
                  onClick={handleMaxBet}
                  className="rounded-br-md rounded-tr-md border-2 border-transparent bg-secondary p-2 px-3 text-xs transition-colors hover:bg-secondary/80 focus:border-indigo-700 focus:outline-none"
                >
                  max
                </button>
              </div>
              {isAuto && (
                <>
                  <div className="flex items-stretch shadow-md">
                    <span>Amount</span>
                  </div>
                  <div className="flex items-stretch justify-center shadow-md">
                    <input
                      title="Amount"
                      type="number"
                      min={1}
                      max={currentBalance / betValue}
                      onChange={handleChangeAmount}
                      value={amount}
                      className="w-full rounded-bl-md rounded-tl-md border-2 border-secondary bg-background p-2.5 px-4 font-bold transition-colors placeholder:font-bold placeholder:text-text focus:border-indigo-700 focus:outline-none md:p-2"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
          <select
            disabled={inGameBallsCount > 0}
            onChange={handleChangeLines}
            defaultValue={16}
            className="w-full rounded-md border-2 border-secondary bg-background px-4 py-2 font-bold transition-all placeholder:font-bold placeholder:text-text focus:border-indigo-700 focus:outline-none disabled:line-through disabled:opacity-80"
            id="lines"
          >
            {linesOptions.map(line => (
              <option key={line} value={line}>
                {line} Lines
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleRunBet}
          disabled={isLoading}
          className="block rounded-md bg-indigo-800 px-2 py-4 text-sm font-bold leading-none text-white transition-colors hover:bg-indigo-700 focus:border-indigo-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-offset-primary disabled:bg-gray-500 md:hidden"
        >
          PLAY
        </button>
        <button
          onClick={handleRunBet}
          disabled={isLoading}
          className="hidden rounded-md bg-indigo-800 px-6 py-5 font-bold leading-none text-white transition-colors hover:bg-indigo-700 focus:border-indigo-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-offset-primary disabled:bg-gray-500 md:visible md:block"
        >
          PLAY
        </button>
      </div>
    </div>
  )
}
