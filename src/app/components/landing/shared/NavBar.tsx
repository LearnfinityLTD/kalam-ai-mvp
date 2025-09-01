import Link from "next/link";

export default function NavBar() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white font-bold">
              كلام
            </div>
            <span className="ml-2 text-2xl font-bold text-gray-900">AI</span>
          </Link>
          <nav className="flex space-x-4">
            <Link
              href="/#features"
              className="text-gray-600 hover:text-gray-900"
            >
              Features
            </Link>
            <Link href="/testimonials" className="text-green-600 font-medium">
              Testimonials
            </Link>
            <Link
              href="/#pricing"
              className="text-gray-600 hover:text-gray-900"
            >
              Pricing
            </Link>
            <Link
              href="/#contact"
              className="text-gray-600 hover:text-gray-900"
            >
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
