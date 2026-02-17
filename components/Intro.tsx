
import React from 'react';

interface IntroProps {
  onNext: () => void;
}

const Intro: React.FC<IntroProps> = ({ onNext }) => {
  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Imagem de Fundo em Tela Cheia */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/logo.png" 
          alt="Reflexo Background" 
          className="w-full h-full object-cover opacity-80 animate-in fade-in duration-1000"
        />
        {/* Gradiente para garantir leitura do texto */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
      </div>

      <div className="z-10 w-full max-w-sm flex flex-col items-center justify-end h-full pb-16 animate-in slide-in-from-bottom-8 duration-1000 delay-300">
        <div className="text-center mb-12">
          <p className="text-white/80 text-xl font-light tracking-widest italic mb-2">
            "mude o reflexo mudando a si mesmo"
          </p>
        </div>
        
        <button 
          onClick={onNext}
          className="w-full h-16 bg-white text-black rounded-2xl font-bold text-lg active:scale-95 hover:bg-zinc-200 transition-all shadow-2xl shadow-white/10"
        >
          estou pronto
        </button>
      </div>
    </div>
  );
};

export default Intro;