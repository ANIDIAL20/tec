'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-[70px] bg-[#0D0D0D]/80 backdrop-blur-md border-b border-white/5 flex items-center px-6 md:px-12 justify-between">
      {/* Logo Link to Home */}
      <Link href="/" className="flex items-center">
        <img
          src="/logo.png"
          alt="TEC Group"
          style={{
            height: '38px',
            width: 'auto',
            objectFit: 'contain',
            mixBlendMode: 'screen', // Supprime automatiquement les fonds noirs
          }}
          className="h-[28px] md:h-[38px]"
        />
      </Link>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center gap-8">
        <Link href="#programme" className="text-[10px] space-mono uppercase tracking-[1.5px] text-[#555555] hover:text-[#F0EDE8] transition-colors">
          Programme
        </Link>
        <Link href="#pourquoi" className="text-[10px] space-mono uppercase tracking-[1.5px] text-[#555555] hover:text-[#F0EDE8] transition-colors">
          Résultats
        </Link>
        <Link href="#postuler" className="text-[10px] space-mono uppercase tracking-[1.5px] text-[#555555] hover:text-[#F0EDE8] transition-colors">
          Candidater
        </Link>
        <Link 
          href="#postuler" 
          className="bg-[#E8472A] text-white text-[13px] font-bold uppercase tracking-[1px] px-[18px] py-[8px] rounded-[2px] hover:bg-[#FF6A45] transition-all transform hover:-translate-y-[1px]"
        >
          Postuler →
        </Link>
      </div>
    </nav>
  );
}
