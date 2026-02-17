
import React from 'react';

interface IntroProps {
  onNext: () => void;
}

const Intro: React.FC<IntroProps> = ({ onNext }) => {
  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-between p-8 overflow-hidden">
      {/* Espaçador superior para equilibrar o visual */}
      <div className="h-10" />

      {/* Imagem Centralizada - Removi a barra / do src para evitar erro de carregamento */}
      <div className="flex-1 flex flex-col items-center justify-center w-full animate-in fade-in zoom-in duration-1000">
        <img 
          src="logo.png" 
          alt="Reflexo" 
          className="w-full max-w-[320px] aspect-square object-contain"
          onError={(e) => {
            console.error("Erro ao carregar logo.png");
            // Se falhar, tentamos o caminho absoluto como fallback
            (e.target as HTMLImageElement).src = "/logo.png";
          }}
        />
      </div>

      {/* Conteúdo Inferior: Frase e Botão */}
      <div className="w-full max-w-xs flex flex-col items-center gap-12 pb-12 animate-in slide-in-from-bottom-8 duration-1000 delay-300">
        <div className="text-center px-4">
          <p className="text-white/70 text-xl font-light tracking-[0.15em] italic leading-relaxed">
            "mude o reflexo<br/>mudando a si mesmo"
          </p>
        </div>
        
        <button 
          onClick={onNext}
          className="w-full h-16 bg-white text-black rounded-2xl font-bold text-lg active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.15)]"
        >
          estou pronto
        </button>
      </div>
    </div>
  );
};

export default Intro;