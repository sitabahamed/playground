import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-white font-bold text-lg">iLovePDF</span>
            </div>
            <p className="text-sm leading-relaxed">
              Every tool you need to work with PDFs in one place. Free, easy to use, and online.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Organize PDF</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/merge-pdf" className="hover:text-white transition">Merge PDF</Link></li>
              <li><Link href="/split-pdf" className="hover:text-white transition">Split PDF</Link></li>
              <li><Link href="/rotate-pdf" className="hover:text-white transition">Rotate PDF</Link></li>
              <li><Link href="/compress-pdf" className="hover:text-white transition">Compress PDF</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Convert PDF</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/pdf-to-jpg" className="hover:text-white transition">PDF to JPG</Link></li>
              <li><Link href="/jpg-to-pdf" className="hover:text-white transition">JPG to PDF</Link></li>
              <li><Link href="/word-to-pdf" className="hover:text-white transition">Word to PDF</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">About</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white transition">Home</Link></li>
              <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} iLovePDF Clone. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
