"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

// Inject keyframe animation for smooth transitions
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes fadeSlideIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  if (!document.head.querySelector('[data-animation="fadeSlideIn"]')) {
    style.setAttribute('data-animation', 'fadeSlideIn');
    document.head.appendChild(style);
  }
}

type Stage = "main" | "categories" | "tools" | "introduction" | "contact";

const CATEGORIES: Array<{ name: string; tools: string[] }> = [
  { name: "PDF", tools: ["Merge", "Split", "Compress"] },
  { name: "Image", tools: ["Copyright", "Resize", "Background Remover", "Format Convert"] },
];

const baseButtonClass =
  "p-3 rounded-full shadow-lg w-full max-w-xs backdrop-blur-[8px] border border-white/20 bg-black/10 shadow-lg flex items-center gap-4 cursor-pointer hover:bg-white/10 transition justify-center transform-gpu duration-300 ease-out hover:scale-[1.02] hover:-translate-y-1 active:scale-95";

export default function Menu() {
  const [stage, setStage] = useState<Stage>("main");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const handleCopy = (text: string, itemId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(itemId);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  const currentTools = useMemo(() => {
    if (!selectedCategory) return [];
    return CATEGORIES.find((c) => c.name === selectedCategory)?.tools ?? [];
  }, [selectedCategory]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    const results: Array<{ category: string; tool: string }> = [];
    CATEGORIES.forEach((category) => {
      category.tools.forEach((tool) => {
        if (tool.toLowerCase().includes(query) || category.name.toLowerCase().includes(query)) {
          results.push({ category: category.name, tool });
        }
      });
    });
    return results;
  }, [searchQuery]);

  const hasSearchResults = searchQuery.trim() && searchResults.length > 0;
  const hasSearchQuery = searchQuery.trim().length > 0;

  return (
    <div className="flex flex-col items-center gap-6 mt-5 w-full">
      {/* Search Bar */}
      <div className="w-full max-w-xl px-4">
        <div className="relative group">
          <input
            type="text"
            placeholder="Search for tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-4 pl-12 rounded-full backdrop-blur-xl border border-white/20 bg-black/10 text-white placeholder-white/50 shadow-lg focus:outline-none focus:border-white/40 focus:bg-black/20 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(255,255,255,0.12)] hover:scale-[1.01] focus:scale-[1.02] focus:shadow-[0_12px_40px_rgba(255,255,255,0.18)] active:scale-100"
          />
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 transition-all duration-300 group-hover:text-white/70 group-hover:scale-110"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/90 hover:rotate-90 transition-all duration-300 hover:scale-110 active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Search Results */}
      {hasSearchResults && (
        <div className="animate-[fadeSlideIn_0.4s_ease-out] flex flex-col items-center gap-4 w-full">
          <div className="text-sm uppercase tracking-[0.2em] text-white/70">
            Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
          </div>
          {searchResults.map((result, index) => (
            <div key={`${result.category}-${result.tool}-${index}`} className={baseButtonClass}>
              <span className="text-lg font-medium">
                {result.tool}
                <span className="text-sm text-white/50 ml-2">({result.category})</span>
              </span>
            </div>
          ))}
        </div>
      )}

      {hasSearchQuery && !hasSearchResults && (
        <div className="animate-[fadeSlideIn_0.4s_ease-out] flex flex-col items-center gap-4 w-full">
          <div className="text-white/50">No tools found for "{searchQuery}"</div>
        </div>
      )}

      {!hasSearchQuery && stage === "main" && (
        <div className="animate-[fadeSlideIn_0.4s_ease-out] flex flex-col items-center gap-6 w-full">
        <div className="text-sm uppercase tracking-[0.2em] text-white/70">Menu</div>
          <div className={baseButtonClass} onClick={() => setStage("introduction")}>
            <span className="text-lg font-medium">Introduction</span>
          </div>
          <div
            className={baseButtonClass}
            onClick={() => {
              setStage("categories");
              setSelectedCategory(null);
            }}
          >
            <span className="text-lg font-medium">Tools</span>
          </div>
          <div className={baseButtonClass} onClick={() => setStage("contact")}>
            <span className="text-lg font-medium">Contact</span>
          </div>
        </div>
      )}

      {!hasSearchQuery && stage === "introduction" && (
        <div className="animate-[fadeSlideIn_0.4s_ease-out] flex flex-col items-center gap-6 w-full max-w-2xl">
          <div className="text-sm uppercase tracking-[0.2em] text-white/70">Introduction</div>
          <div className="p-6 rounded-3xl w-full backdrop-blur-[8px] border border-white/20 bg-black/10 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-white">Useful Toolbox</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              A comprehensive collection of tools designed to simplify daily tasks. 
              PDF manipulation and image processing capabilities are available.
            </p>
            <p className="text-white/80 leading-relaxed mb-4">
              The toolkit includes:
            </p>
            <ul className="text-white/80 leading-relaxed space-y-2 ml-6">
              <li>• <strong>PDF Tools:</strong> Merge, split, and compress PDF documents</li>
              <li>• <strong>Image Tools:</strong> Add copyright, resize, remove backgrounds, and convert formats</li>
              <li>• Additional tools coming soon</li>
            </ul>
            <p className="text-white/80 leading-relaxed mt-4">
              All tools run directly in the browser for maximum privacy and speed.
            </p>
          </div>
          <div
            className={baseButtonClass}
            onClick={() => setStage("main")}
          >
            <span className="text-lg font-medium">Back to Menu</span>
          </div>
        </div>
      )}

      {!hasSearchQuery && stage === "contact" && (
        <div className="animate-[fadeSlideIn_0.4s_ease-out] flex flex-col items-center gap-6 w-full max-w-2xl">
          <div className="text-sm uppercase tracking-[0.2em] text-white/70">Contact</div>
          <div className="p-6 rounded-3xl w-full backdrop-blur-[8px] border border-white/20 bg-black/10 shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-white">Get in Touch</h2>
            <p className="text-white/80 leading-relaxed mb-6">
              Have questions, suggestions, or feedback? I'd love to hear from you!
            </p>
            <div className="space-y-4">
              <button
                onClick={() => handleCopy("contact@rick-gao.com", "email")}
                className="w-full p-4 rounded-xl backdrop-blur-sm border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 text-left group cursor-pointer"
              >
                <div className="text-sm uppercase tracking-wider text-white/60 mb-1">Email</div>
                <div className="flex items-center justify-between">
                  <div className="text-white/90">contact@rick-gao.com</div>
                  <svg
                    className={`w-5 h-5 transition-all duration-300 ${
                      copiedItem === "email" ? "text-green-400" : "text-white/50 group-hover:text-white/80"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {copiedItem === "email" ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    )}
                  </svg>
                </div>
              </button>
              <button
                onClick={() => handleCopy("github.com/RickHolaaa", "github")}
                className="w-full p-4 rounded-xl backdrop-blur-sm border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 text-left group cursor-pointer"
              >
                <div className="text-sm uppercase tracking-wider text-white/60 mb-1">GitHub</div>
                <div className="flex items-center justify-between">
                  <div className="text-white/90">github.com/RickHolaaa</div>
                  <svg
                    className={`w-5 h-5 transition-all duration-300 ${
                      copiedItem === "github" ? "text-green-400" : "text-white/50 group-hover:text-white/80"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {copiedItem === "github" ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    )}
                  </svg>
                </div>
              </button>
            </div>
          </div>
          <div
            className={baseButtonClass}
            onClick={() => setStage("main")}
          >
            <span className="text-lg font-medium">Back to Menu</span>
          </div>
        </div>
      )}

      {!hasSearchQuery && stage === "categories" && (
        <div className="animate-[fadeSlideIn_0.4s_ease-out] flex flex-col items-center gap-4 w-full">
          <div className="text-sm uppercase tracking-[0.2em] text-white/70">Pick a category</div>
          {CATEGORIES.map((category) => (
            <div
              key={category.name}
              className={baseButtonClass}
              onClick={() => {
                setSelectedCategory(category.name);
                setStage("tools");
              }}
            >
              <span className="text-lg font-medium">{category.name}</span>
            </div>
          ))}
          <div
            className={baseButtonClass}
            onClick={() => {
              setStage("main");
              setSelectedCategory(null);
            }}
          >
            <span className="text-lg font-medium">Back</span>
          </div>
        </div>
      )}

      {!hasSearchQuery && stage === "tools" && selectedCategory && (
        <div className="animate-[fadeSlideIn_0.4s_ease-out] flex flex-col items-center gap-4 w-full">
          <div className="text-sm uppercase tracking-[0.2em] text-white/70">
            {selectedCategory} tools
          </div>
          {currentTools.map((tool) => {
            // Create slug from tool name for routing
            const toolSlug = tool.toLowerCase().replace(/\s+/g, "-");
            const href = `/${selectedCategory.toLowerCase()}-${toolSlug}`;

            return (
              <Link key={tool} href={href} className={baseButtonClass}>
                <span className="text-lg font-medium">{tool}</span>
              </Link>
            );
          })}
          <div className="flex gap-3 w-full max-w-xs justify-between">
            <div
              className={`${baseButtonClass} max-w-[48%]`}
              onClick={() => setStage("categories")}
            >
              <span className="text-lg font-medium">Back</span>
            </div>
            <div
              className={`${baseButtonClass} max-w-[48%]`}
              onClick={() => {
                setStage("main");
                setSelectedCategory(null);
              }}
            >
              <span className="text-lg font-medium">Home</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
