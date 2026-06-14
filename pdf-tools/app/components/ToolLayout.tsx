interface ToolLayoutProps {
  title: string;
  description: string;
  icon: string;
  color: string;
  children: React.ReactNode;
}

export default function ToolLayout({ title, description, icon, color, children }: ToolLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className={`${color} text-white py-16 px-4`}>
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-6xl mb-4">{icon}</div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{title}</h1>
          <p className="text-white/80 text-lg">{description}</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-10 -mt-6">
        <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10">
          {children}
        </div>
      </div>
    </div>
  );
}
