'use client';
import ImageSvg from './svg/Image';
// import OnchainkitSvg from './svg/OnchainKit';
import TallyCard from './components/TallyCard';

// removed unused imports and arrays to satisfy lint rules

export default function App() {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-white text-gray-900">
      <header className="px-4 py-3 border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-5xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-blue-600/90" />
            <span className="text-sm text-gray-600">Base + OnchainKit + AppKit</span>
          </div>
          <div className="wallet-container">
            {/* eslint-disable-next-line @next/next/no-sync-scripts */}
            <appkit-button />
          </div>
        </div>
      </header>

      <main className="flex flex-grow items-center justify-center px-4">
        <div className="w-full max-w-2xl">
          <div className="mx-auto mb-8 w-24 opacity-80">
            <ImageSvg />
          </div>
          <TallyCard />
        </div>
      </main>

      <footer className="px-4 py-6 border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-5xl text-xs text-gray-500 flex items-center justify-between">
          <span>Demo UI</span>
          <a
            href="https://reown.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Reown AppKit
          </a>
        </div>
      </footer>
    </div>
  );
}
