import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white shadow">
      <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-semibold">
          Kate Eyler
        </Link>
        <nav className="space-x-6">
          <Link href="/about" className="hover:text-gray-600">About</Link>
          <Link href="/contact" className="hover:text-gray-600">Contact</Link>
          <Link href="/crosswords" className="hover:text-gray-600">Crossword Stuff</Link>
        </nav>
      </div>
    </header>
  )
}