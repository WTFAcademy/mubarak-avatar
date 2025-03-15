import React, { useState } from "react";
import { Copy, Twitter, MessageCircle, ExternalLink } from "lucide-react";
import ImageEditor from "./components/ImageEditor";

function App() {
  const [copied, setCopied] = useState(false);
  const contractAddress = "0x5c85d6c6825ab4032337f11ee92a72df936b46f6";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(contractAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Social links
  const socialLinks = {
    telegram: "https://t.me/bnbmubarak",
    twitter: "https://x.com/mubarak_cto",
  };

  return (
    <div className="min-h-screen bg-[#e8f3e8] relative overflow-hidden font-mono selection:bg-yellow-300">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-400 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      {/* Main content - with streamlined top section */}
      <div className="container mx-auto px-4 py-6 min-h-screen flex flex-col relative">
        {/* Token info section - streamlined */}
        <div className="max-w-4xl mx-auto w-full mb-8">
          {/* Header with title and badge */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-green-400 tracking-tighter">
              $Mubarak
            </h1>
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <div className="bg-white/70 backdrop-blur-sm px-3 py-1 rounded-full text-xs border border-yellow-200 font-semibold text-yellow-700">
                مبارك / MUBARAK
              </div>
              <a
                href="https://pancakeswap.finance/?outputCurrency=0x5C85D6C6825aB4032337F11Ee92a72DF936b46F6&inputCurrency=BNB"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-bold hover:bg-black hover:text-white transition-all flex items-center gap-1"
              >
                <ExternalLink className="w-3 h-3" />
                BUY NOW
              </a>
            </div>
          </div>

          {/* Info bar - contract and social links in one line */}
          <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-3 flex flex-col md:flex-row items-center justify-between gap-3 border border-yellow-100">
            {/* Contract Address - inline */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-xs text-black/60 font-medium whitespace-nowrap">
                CONTRACT:
              </span>
              <div className="flex items-center gap-1 group flex-1 min-w-0">
                <code className="flex-1 font-mono text-xs truncate group-hover:text-yellow-600 transition-colors">
                  {contractAddress}
                </code>
                <button
                  onClick={copyToClipboard}
                  className="bg-yellow-400/80 text-black p-1 rounded-md hover:bg-yellow-400 transition-colors"
                >
                  <Copy className="w-3 h-3" />
                </button>
                {copied && (
                  <span className="text-green-600 text-xs animate-bounce whitespace-nowrap">
                    Copied!
                  </span>
                )}
              </div>
            </div>

            {/* Social Links - inline */}
            <div className="flex items-center gap-2">
              <a
                href={socialLinks.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#0088cc]/70 text-white px-3 py-1 rounded-md text-xs hover:-translate-y-1 transform transition-all flex items-center gap-1"
              >
                <MessageCircle className="w-3 h-3" />
                Telegram
              </a>
              <a
                href={socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black/60 text-white px-3 py-1 rounded-md text-xs hover:-translate-y-1 transform transition-all flex items-center gap-1"
              >
                <Twitter className="w-3 h-3" />
                Twitter
              </a>
            </div>
          </div>
        </div>

        {/* Image Editor section */}
        <div className="flex-1 max-w-4xl mx-auto w-full">
          <ImageEditor templateSrc="/mubarak-hero.png" />
        </div>

        {/* Bottom tagline */}
        <div className="max-w-4xl mx-auto w-full mt-6 text-center">
          <p className="text-xs text-black/50 font-light">
            Built by <a href="https://x.com/WTFAcademy_" target="_blank" rel="noopener noreferrer" className="text-yellow-400">WTF Academy</a> Team
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
