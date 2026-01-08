import Image from "next/image";
import Menu from "@/components/Menu";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center font-sans relative">
      <main className="flex min-h-screen w-full max-w-4xl flex-col items-center py-16 px-16">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-2xl">Useful Toolbox</h1>
          <p className="text-center text-m leading-6">
            This website contains a set of tools useful for daily tasks.<br/>
            If you think that some tool must be included, please send me a message from the Contact page.
          </p>
        </div>
        <Menu />
      </main>

      {/* Buy Me A Coffee Button - Bottom Left */}
      <a
        href="https://buymeacoffee.com/rickhola"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 p-3 rounded-full backdrop-blur-xl border border-white/20 bg-black/10 shadow-lg flex items-center justify-center cursor-pointer hover:bg-white/10 transition-all duration-300 ease-out hover:scale-110 hover:shadow-[0_8px_30px_rgba(255,255,255,0.12)] active:scale-95 group"
      >
        <svg
          className="w-6 h-6 text-white/80 group-hover:text-white transition-colors duration-300"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
        </svg>
      </a>

      {/* Wallpaper Credit - Bottom Right */}
      <div className="fixed bottom-6 right-6 text-white/60 text-xs hover:text-white/80 transition-colors duration-300">
        Wallpaper by <span className="font-semibold">Rostislav Uzunov</span>
      </div>
    </div>
  );
}
