import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-secondary text-secondary-foreground shadow-lg">
      <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-semibold text-secondary-foreground hover:opacity-90 transition-opacity">
          Kate Eyler
        </Link>
        <nav className="space-x-6">
          <Link href="/" className="text-secondary-foreground/90 hover:text-secondary-foreground transition-colors">About</Link>
          <Link href="/contact" className="text-secondary-foreground/90 hover:text-secondary-foreground transition-colors">Contact</Link>
          <Link href="/crosswords" className="text-secondary-foreground/90 hover:text-secondary-foreground transition-colors">Crossword Stuff</Link>
          <Link href="/chatbot" className="text-secondary-foreground/90 hover:text-secondary-foreground transition-colors">Chatbot</Link>
        </nav>
      </div>
    </header>
  )
}