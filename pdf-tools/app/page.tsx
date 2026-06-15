import Link from "next/link";

const tools = [
  {
    href: "/merge-pdf",
    title: "Merge PDF",
    description: "Combine PDFs in the order you want with the easiest PDF merger available.",
    icon: "🔗",
    color: "bg-red-500",
    lightColor: "bg-red-50",
    textColor: "text-red-500",
    borderColor: "border-red-200",
  },
  {
    href: "/split-pdf",
    title: "Split PDF",
    description: "Separate one page or a whole set for easy conversion into independent PDF files.",
    icon: "✂️",
    color: "bg-orange-500",
    lightColor: "bg-orange-50",
    textColor: "text-orange-500",
    borderColor: "border-orange-200",
  },
  {
    href: "/compress-pdf",
    title: "Compress PDF",
    description: "Reduce file size while optimizing for maximal PDF quality.",
    icon: "🗜️",
    color: "bg-green-500",
    lightColor: "bg-green-50",
    textColor: "text-green-500",
    borderColor: "border-green-200",
  },
  {
    href: "/pdf-to-jpg",
    title: "PDF to JPG",
    description: "Convert each PDF page into a JPG or extract all images contained in a PDF.",
    icon: "🖼️",
    color: "bg-blue-500",
    lightColor: "bg-blue-50",
    textColor: "text-blue-500",
    borderColor: "border-blue-200",
  },
  {
    href: "/jpg-to-pdf",
    title: "JPG to PDF",
    description: "Convert JPG images to PDF in seconds. Easily adjust orientation and margins.",
    icon: "📄",
    color: "bg-purple-500",
    lightColor: "bg-purple-50",
    textColor: "text-purple-500",
    borderColor: "border-purple-200",
  },
  {
    href: "/rotate-pdf",
    title: "Rotate PDF",
    description: "Rotate your PDFs the way you need them. You can even rotate multiple PDFs at once.",
    icon: "🔄",
    color: "bg-teal-500",
    lightColor: "bg-teal-50",
    textColor: "text-teal-500",
    borderColor: "border-teal-200",
  },
  {
    href: "/word-to-pdf",
    title: "Word to PDF",
    description: "Make DOC and DOCX files easy to read by converting them to PDF.",
    icon: "📝",
    color: "bg-indigo-500",
    lightColor: "bg-indigo-50",
    textColor: "text-indigo-500",
    borderColor: "border-indigo-200",
  },
];

export default function Home() {
  return (
    <div>
      <section className="bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Every tool you need<br />to work with PDFs
          </h1>
          <p className="text-xl md:text-2xl text-red-100 mb-8 max-w-2xl mx-auto">
            All tools are 100% free and easy to use. No installation required.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/merge-pdf"
              className="bg-white text-red-600 font-semibold px-8 py-3 rounded-full hover:bg-red-50 transition shadow-lg"
            >
              Get Started Free
            </Link>
            <a
              href="#tools"
              className="border-2 border-white text-white font-semibold px-8 py-3 rounded-full hover:bg-white/10 transition"
            >
              View All Tools
            </a>
          </div>
        </div>
      </section>

      <section className="bg-white border-b border-gray-100 py-10">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: "25M+", label: "Users worldwide" },
            { value: "10B+", label: "PDF files processed" },
            { value: "7", label: "PDF tools available" },
            { value: "Free", label: "Forever" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="tools" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">All PDF Tools</h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Everything you need to manage your PDF files from one convenient place.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className={`tool-card group rounded-2xl border-2 ${tool.borderColor} ${tool.lightColor} p-6 flex flex-col items-center text-center cursor-pointer`}
            >
              <div className={`w-16 h-16 ${tool.color} rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                {tool.icon}
              </div>
              <h3 className={`text-lg font-bold ${tool.textColor} mb-2`}>{tool.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{tool.description}</p>
              <div className={`mt-4 text-sm font-semibold ${tool.textColor} flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity`}>
                Use tool →
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why iLovePDF?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: "🔒", title: "Secure & Private", desc: "All files are protected with 256-bit SSL encryption. After processing, files are deleted from our servers." },
              { icon: "⚡", title: "Lightning Fast", desc: "PDF processing is done in the cloud using our optimized servers so you get your results quickly." },
              { icon: "🆓", title: "Completely Free", desc: "Use all our PDF tools for free, forever. No subscriptions, no hidden fees." },
            ].map((f) => (
              <div key={f.title} className="text-center p-6">
                <div className="text-5xl mb-4">{f.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
