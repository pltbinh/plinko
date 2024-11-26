import { CurrencyDollarSimple, Star } from 'phosphor-react'
import { formatPoints } from 'utils/currencyFormat'

interface WalletCardProps {
  showFormatted?: boolean
  balance: number
}
export function WalletCard({ balance, showFormatted }: WalletCardProps) {
  const currency = showFormatted ? formatPoints(balance) : balance
  return (
    <div className="flex cursor-pointer items-stretch">
      <div className="flex items-center gap-2 rounded-bl-md rounded-tl-md bg-background px-2 py-1 pr-4 font-bold uppercase text-white md:text-lg">
        <span className="rounded-full bg-indigo-700 p-1">
          <Star size={20} weight="bold" />
        </span>
        <span title={String(balance)}>{currency}</span>
      </div>
      <span
        title="Plinko Points"
        className="rounded-br-md rounded-tr-md bg-indigo-700 p-2 text-lg font-bold text-white"
      >
        +
      </span>
    </div>
  )
}
