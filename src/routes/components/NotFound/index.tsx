import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-text">404</h1>
      <h2 className="text-2xl font-bold text-text">Page not found</h2>
      <Link
        to="/"
        className="mt-4 rounded-md bg-indigo-800 px-4 py-2 font-bold text-text transition-colors hover:bg-indigo-700"
      >
        Back to the home page
      </Link>
    </div>
  )
}
