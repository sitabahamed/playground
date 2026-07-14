import './globals.css';

export const metadata = {
  title: 'Title Capitalization Tool',
  description: 'Capitalize your titles in multiple styles - AP, Chicago, APA, and more',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
