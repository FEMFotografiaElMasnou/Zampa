import React, { useEffect } from 'react';
import { ZampaEdition, ZampaProject, ZampaPhoto, ZampaUserRank, User } from '../types';
import { Trophy, Lock, Sparkles, Award, ListOrdered } from 'lucide-react';

interface ZampaWinnerCardProps {
  officialWinnerObj: ZampaProject | undefined;
  selectedEdition: ZampaEdition;
  winnerConsensusRank: number | null;
  userRanks: ZampaUserRank[];
  activeTab: string;
  selectedEditionId: number;
  lang: 'ca' | 'es';
  onPhotoClick: (photos: ZampaPhoto[], startIdx: number, url: string) => void;
}

export function ZampaWinnerCard({
  officialWinnerObj,
  selectedEdition,
  winnerConsensusRank,
  userRanks,
  activeTab,
  selectedEditionId,
  lang,
  onPhotoClick,
}: ZampaWinnerCardProps) {
  return (
    <div className="bg-surface1 border-2 border-brand-border-high rounded-2xl p-6 text-center space-y-6 shadow-xl ring-2 ring-brand-accent/10">
      <div className="flex justify-center flex-col items-center space-y-2">
        <div className="p-3 bg-[#81a2cc]/10 rounded-full border border-[#81a2cc]/30 animate-bounce">
          <Trophy className="text-[#81a2cc]" size={54} />
        </div>
        <h3 className="font-display text-2xl sm:text-3xl font-extrabold tracking-wide text-[#e5eefe] uppercase">
          {lang === 'es' ? `GANADOR ZAMPA EDICIÓN ${selectedEdition.id}` : `GUANYADOR ZAMPA EDICIÓ ${selectedEdition.id}`}
        </h3>
        <span className="text-xs sm:text-sm text-[#81a2cc] font-extrabold bg-surface2 px-3.5 py-1 rounded-full uppercase tracking-widest border border-brand-border-high/30">
          {lang === 'es' ? 'Tribunal Oficial ZAMPA' : 'Tribunal Oficial ZAMPA'}
        </span>
      </div>

      {officialWinnerObj ? (
        <div className="bg-bg2 p-5 border-2 border-brand-border rounded-xl space-y-4 flex flex-col items-center shadow-inner">
          {/* Miniatura de la 2a foto del guanyador amb clic per ampliar */}
          {(() => {
            const sortedPhotos = [...((officialWinnerObj as any).photos || [])].sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));
            const mainPhoto = sortedPhotos.length > 1 ? sortedPhotos[1] : sortedPhotos[0];
            if (!mainPhoto) return null;
            return (
              <div
                className="aspect-[4/3] w-full rounded-xl overflow-hidden border-2 border-brand-border-high hover:border-amber-400 cursor-zoom-in transition-all relative group my-2 shadow-lg"
                onClick={() => {
                  onPhotoClick(sortedPhotos, sortedPhotos.indexOf(mainPhoto), mainPhoto.file_url);
                }}
              >
                <img
                  src={mainPhoto.file_url}
                  alt={mainPhoto.file_name || "Winner main photo"}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <span className="bg-black/75 text-xs text-white font-extrabold py-1.5 px-3.5 rounded-full border border-white/20 select-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    🔍 {lang === 'es' ? 'Ampliar foto' : 'Ampliar foto'}
                  </span>
                </div>
              </div>
            );
          })()}

          <div className="text-center space-y-1">
            <h4 className="text-lg sm:text-xl font-black text-white leading-tight tracking-wide">{officialWinnerObj.author_name}</h4>
            <p className="text-sm sm:text-base italic text-[#81a2cc] font-extrabold">"{officialWinnerObj.project_title}"</p>
          </div>
          {officialWinnerObj.description && (
            <p className="text-xs sm:text-sm text-brand-text leading-relaxed text-center font-medium line-clamp-4 border-t border-brand-border pt-2.5">
              {officialWinnerObj.description}
            </p>
          )}
        </div>
      ) : (
        <p className="text-sm text-slate-300 italic font-medium">{lang === 'es' ? 'No se ha definido el ganador real todavía.' : "No s'ha definit el guanyador real encara."}</p>
      )}

      {officialWinnerObj && (
        <div className="bg-bg2 p-4.5 rounded-xl border-2 border-brand-border-high text-sm space-y-3 text-left">
          <span className="text-white font-bold block text-xs sm:text-sm uppercase tracking-wide border-b border-brand-border pb-1.5">
            {lang === 'es' ? 'Veredicto de este proyecto:' : 'Veredicte d\'aquest projecte:'}
          </span>
          
          <div className="flex justify-between items-center mt-1">
            <span className="font-bold text-slate-300">{lang === 'es' ? 'Posición de la quiniela FEM:' : 'Posició de la travessa de la FEM:'}</span>
            {(() => {
              if (winnerConsensusRank == null) {
                return (
                  <span className="font-mono text-xs font-black text-slate-400 bg-surface3/40 border border-brand-border/30 px-3 py-1 rounded-lg select-none">
                    -
                  </span>
                );
              }
              const suffix = lang === 'es' 
                ? `${winnerConsensusRank}º` 
                : `${winnerConsensusRank}${winnerConsensusRank === 1 ? 'r' : winnerConsensusRank === 2 ? 'n' : winnerConsensusRank === 3 ? 'r' : 'è'}`;
              
              let badgeStyle = '';
              if (winnerConsensusRank === 1) {
                badgeStyle = 'text-amber-300 bg-amber-400/10 border-amber-400/40 shadow-[0_0_8px_rgba(251,191,36,0.15)]';
              } else if (winnerConsensusRank === 2) {
                badgeStyle = 'text-slate-200 bg-slate-300/10 border-slate-300/35 shadow-[0_0_8px_rgba(203,213,225,0.15)]';
              } else if (winnerConsensusRank === 3) {
                badgeStyle = 'text-[#f5a152] bg-[#cd7f32]/10 border-[#cd7f32]/35 shadow-[0_0_8px_rgba(205,127,50,0.15)]';
              } else {
                badgeStyle = 'text-brand-text/90 bg-surface3 border-brand-border';
              }

              return (
                <span className={`font-mono text-xs font-black border px-3 py-1 rounded-lg select-none ${badgeStyle}`}>
                  {winnerConsensusRank === 1 ? '🥇 ' : winnerConsensusRank === 2 ? '🥈 ' : winnerConsensusRank === 3 ? '🥉 ' : ''}
                  {suffix}
                </span>
              );
            })()}
          </div>

          <div className="flex justify-between items-center border-t border-brand-border/40 pt-2.5">
            <span className="font-bold text-white">{lang === 'es' ? 'Posición donde lo colocaste:' : 'Posició on el vas col·locar:'}</span>
            {(() => {
              const myPos = userRanks.find(r => r.project_id === officialWinnerObj.id && r.category === activeTab && r.edition_year === selectedEditionId)?.assigned_position ?? 'N/A';
              const formattedMyPos = myPos === 'N/A' ? 'N/A' : (lang === 'es' ? `${myPos}º` : `${myPos}${myPos === 1 ? 'r' : myPos === 2 ? 'n' : myPos === 3 ? 'r' : 'è'}`);
              const badgeClasses = 
                myPos === 1 ? 'bg-amber-400/15 text-amber-300 border border-amber-400/30' :
                myPos === 2 ? 'bg-slate-300/15 text-slate-200 border border-slate-300/30' :
                myPos === 3 ? 'bg-[#cd7f32]/15 text-[#f5a152] border-[#cd7f32]/30' :
                'bg-surface3 border border-brand-border-high text-brand-text';
              return (
                <span className={`font-black px-3 py-1 rounded-lg text-xs sm:text-sm font-mono border ${badgeClasses}`}>
                  {formattedMyPos}
                </span>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}

interface ZampaGalleryProps {
  projects: ZampaProject[];
  selectedEditionId: number;
  activeTab: string;
  lang: 'ca' | 'es';
  onPhotoClick: (photos: ZampaPhoto[], startIdx: number, url: string) => void;
}

export function ZampaGallery({
  projects,
  selectedEditionId,
  activeTab,
  lang,
  onPhotoClick,
}: ZampaGalleryProps) {
  const editionProjects = projects.filter(p => p.edition_year === selectedEditionId && p.category === activeTab);
  const [expandedProjId, setExpandedProjId] = React.useState<string | null>(null);

  return (
    <div className="bg-surface1 border border-brand-border rounded-2xl p-5 md:p-6 space-y-6 text-left shadow-lg">
      <div className="border-b border-brand-border pb-3">
        <h4 className="font-extrabold text-base sm:text-lg tracking-wider uppercase text-white flex items-center gap-2">
          <span>🖼️</span>
          {lang === 'es' ? 'Galería de Proyectos' : 'Galeria de Projectes'}
        </h4>
        <p className="text-[10px] text-brand-text-muted mt-0.5 leading-relaxed font-sans">
          {lang === 'es'
            ? `Selecciona un proyecto del mosaico para expandir y explorar todas sus fotos.`
            : `Selecciona un projecte del mosaic per expandir i explorar totes les seves imatges.`}
        </p>
      </div>

      {editionProjects.length === 0 ? (
        <p className="text-xs text-brand-text-muted italic py-4 text-center">
          {lang === 'es' ? 'No hay proyectos en esta edición.' : 'No hi ha projectes en aquesta edició.'}
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {editionProjects.map((proj) => {
            const sortedPhotos = [...((proj as any).photos || [])].sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));
            const mainPhoto = sortedPhotos.length > 1 ? sortedPhotos[1] : (sortedPhotos.length > 0 ? sortedPhotos[0] : null);
            const isExpanded = expandedProjId === proj.id;

            return (
              <div
                key={proj.id}
                className={`transition-all duration-300 rounded-xl border flex flex-col overflow-hidden h-full ${
                  isExpanded
                    ? 'col-span-1 sm:col-span-2 md:col-span-3 bg-bg1/60 border-brand-accent/50 ring-1 ring-brand-accent/20'
                    : 'bg-bg1/20 border-brand-border/60 hover:border-brand-accent/40 hover:bg-bg1/40 cursor-pointer'
                }`}
                onClick={() => {
                  if (!isExpanded) {
                    setExpandedProjId(proj.id);
                  }
                }}
              >
                {/* Image Section */}
                <div className={`relative ${isExpanded ? 'h-64 sm:h-80 md:h-[450px]' : 'aspect-[4/3]'} w-full overflow-hidden bg-bg2 shrink-0 group`}>
                  {mainPhoto ? (
                    <img
                      src={mainPhoto.file_url}
                      alt={proj.project_title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-brand-text-muted font-mono uppercase bg-surface2">
                      📷 {lang === 'es' ? 'Sin imágenes' : 'Sense imatges'}
                    </div>
                  )}
                  
                  {/* Overlay on hover when collapsed */}
                  {!isExpanded && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-brand-accent text-white text-xs font-bold py-1.5 px-3 rounded-full shadow-lg font-sans">
                        🔍 {lang === 'es' ? 'Ver Proyecto' : 'Veure Projecte'}
                      </span>
                    </div>
                  )}

                  {isExpanded && (
                    <div className="absolute top-3 right-3 z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedProjId(null);
                        }}
                        className="bg-black/75 hover:bg-black text-white text-xs font-bold py-1.5 px-3 rounded-lg border border-white/20 shadow-md transition-colors font-mono"
                      >
                        ✕ {lang === 'es' ? 'Cerrar' : 'Tancar'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-4 flex flex-col justify-between grow space-y-3">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h5 className="text-sm font-bold font-mono text-white leading-tight truncate">
                          {proj.author_name}
                        </h5>
                        <p className="text-xs text-brand-accent font-semibold italic mt-0.5 truncate">
                          "{proj.project_title}"
                        </p>
                      </div>
                      
                      {isExpanded && (
                        <span className="bg-brand-accent/20 text-brand-accent text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0 border border-brand-accent/30">
                          {lang === 'es' ? 'Mostrando todo' : 'Mostrant tot'}
                        </span>
                      )}
                    </div>

                    {isExpanded && proj.description && (
                      <p className="text-xs text-brand-text mt-3 bg-bg2/40 p-3 rounded-lg border border-brand-border-high/20 leading-relaxed max-w-4xl">
                        {proj.description}
                      </p>
                    )}
                  </div>

                  {/* Expanded Photos sub-grid */}
                  {isExpanded && (
                    <div className="space-y-3 pt-3 border-t border-brand-border-high/30" onClick={(e) => e.stopPropagation()}>
                      <h6 className="text-[10px] font-bold uppercase tracking-wider text-brand-text-muted">
                        {lang === 'es' ? 'Fotos del Proyecto' : 'Fotos del Projecte'} ({sortedPhotos.length})
                      </h6>
                      {sortedPhotos.length === 0 ? (
                        <p className="text-xs text-brand-text-muted italic">Aquest autor no té imatges.</p>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                          {sortedPhotos.map((photo: ZampaPhoto, pIdx: number) => (
                            <div
                              key={photo.id}
                              className="aspect-[4/3] rounded-lg overflow-hidden border border-brand-border hover:border-brand-accent cursor-zoom-in transition-all relative group shadow-md bg-bg2"
                              onClick={(e) => {
                                e.stopPropagation();
                                onPhotoClick(sortedPhotos, pIdx, photo.file_url);
                              }}
                            >
                              <img
                                src={photo.file_url}
                                alt={photo.file_name || `Photo ${pIdx}`}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-200"
                              />
                              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="bg-black/60 text-[9px] text-white p-1 rounded font-mono">🔍</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex justify-end pt-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedProjId(null);
                          }}
                          className="bg-surface3 hover:bg-surface2 text-brand-text text-xs font-bold py-2 px-4 rounded-xl border border-brand-border-high/60 transition-colors uppercase tracking-wider"
                        >
                          {lang === 'es' ? 'Colapsar Proyecto' : 'Col·lapsar Projecte'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface ZampaConsensusTravessaProps {
  projects: ZampaProject[];
  userRanks: ZampaUserRank[];
  activeTab: string;
  selectedEditionId: number;
  currentUser: User;
  lang: 'ca' | 'es';
  onPhotoClick: (photos: ZampaPhoto[], startIdx: number, url: string) => void;
}

export function ZampaConsensusTravessa({
  projects,
  userRanks,
  activeTab,
  selectedEditionId,
  currentUser,
  lang,
  onPhotoClick,
}: ZampaConsensusTravessaProps) {
  const categoryProjects = projects.filter(p => p.category === activeTab && p.edition_year === selectedEditionId);
  const firstProj = categoryProjects.length > 0 ? categoryProjects[0] : null;
  const totalVoters = firstProj
    ? userRanks.filter(r => r.project_id === firstProj.id && r.category === activeTab && r.edition_year === selectedEditionId).length
    : 0;

  const consensusList = categoryProjects.map(proj => {
    const ranks = userRanks.filter(r => r.project_id === proj.id && r.category === activeTab && r.edition_year === selectedEditionId);
    const count = ranks.length;
    const sum = ranks.reduce((acc, r) => acc + r.assigned_position, 0);
    const avg = count > 0 ? sum / count : 999;
    const firsts = ranks.filter(r => r.assigned_position === 1).length;
    
    const sumAbsoluteDeviations = ranks.reduce((acc, r) => acc + Math.abs(r.assigned_position - avg), 0);
    const mad = count > 0 ? sumAbsoluteDeviations / count : 0;
    
    let consensusLabel = '';
    let consensusRating = '';
    if (mad < 0.6) {
      consensusLabel = lang === 'es' ? 'Muy alto' : 'Molt alt';
      consensusRating = 'Muy alto';
    } else if (mad < 1.1) {
      consensusLabel = lang === 'es' ? 'Alto' : 'Alt';
      consensusRating = 'Alto';
    } else if (mad < 1.7) {
      consensusLabel = lang === 'es' ? 'Notable' : 'Notable';
      consensusRating = 'Notable';
    } else {
      consensusLabel = lang === 'es' ? 'Moderado' : 'Moderat';
      consensusRating = 'Moderado';
    }

    const sortedPhotos = (proj as any).photos ? [...(proj as any).photos].sort((a: any, b: any) => (a.order_index ?? 0) - (b.order_index ?? 0)) : [];
    const firstPhotoUrl = sortedPhotos.length > 1 ? sortedPhotos[1].file_url : (sortedPhotos.length > 0 ? sortedPhotos[0].file_url : null);

    return {
      project: proj,
      avg,
      sum,
      firsts,
      count,
      firstPhotoUrl,
      sortedPhotos,
      consensusLabel,
      consensusRating
    };
  }).sort((a, b) => {
    if (a.avg !== b.avg) return a.avg - b.avg;
    if (a.firsts !== b.firsts) return b.firsts - a.firsts;
    if (a.sum !== b.sum) return a.sum - b.sum;
    return a.project.author_name.localeCompare(b.project.author_name);
  });

  const hasVotes = consensusList.some(item => item.count > 0);

  useEffect(() => {
    const subHeadlineElement = document.getElementById('consensus-voters-meta');
    if (subHeadlineElement) {
      subHeadlineElement.textContent = totalVoters > 0 
        ? (lang === 'es' ? `Basado en los votos de ${totalVoters} socios` : `Basat en els vots de ${totalVoters} socis`)
        : '';
    }
  }, [totalVoters, lang]);

  if (!hasVotes) {
    return (
      <div className="bg-surface1 border border-brand-border rounded-2xl p-6 text-left shadow-lg">
        <h4 className="font-bold text-sm tracking-wider uppercase text-brand-text border-b border-brand-border pb-3">
          {lang === 'es' ? 'La Quiniela de la FEM (Consenso)' : 'La Travessa de la FEM (Consens)'}
        </h4>
        <p className="text-xs text-brand-text-muted italic py-4 text-center">
          {lang === 'es' ? 'No hay suficientes votaciones para mostrar el consenso.' : 'No hi ha prou votacions per poder mostrar el consens.'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface1 border border-brand-border rounded-2xl p-5 md:p-6 space-y-4 text-left shadow-lg">
      <div className="flex items-center justify-between border-b border-brand-border pb-3">
        <div className="space-y-0.5">
          <h4 className="font-bold text-sm tracking-wider uppercase text-brand-text">
            {lang === 'es' ? 'La Quiniela de la FEM (Consenso)' : 'La Travessa de la FEM (Consens)'}
          </h4>
          <p className="text-[10px] text-brand-text-muted font-sans flex items-center gap-1.5 flex-wrap">
            <span>{lang === 'es' ? 'Resultado de la clasificación media colectiva' : 'Resultat de la classificació mitjana col·lectiva'}</span>
            <span id="consensus-voters-meta" className="text-brand-accent font-semibold font-mono before:content-['·'] before:mr-1.5"></span>
          </p>
        </div>
        <span className="text-[10px] uppercase font-bold tracking-wider bg-[#81a2cc]/10 text-[#81a2cc] border border-[#81a2cc]/20 px-2.5 py-1 rounded">
          {lang === 'es' ? 'Consenso' : 'Consens'}
        </span>
      </div>

      <div className="hidden sm:block space-y-2 pb-1">
        <div className="flex justify-between items-center text-[10px] font-mono font-bold tracking-wider text-brand-accent uppercase opacity-90 pb-2 border-b border-brand-border/40">
          <span>{lang === 'es' ? 'La Quiniela de la FEM' : 'La Travessa de la FEM'}</span>
          <span className="text-brand-text-muted/20 grow px-2 overflow-hidden whitespace-nowrap">⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯</span>
          <span>{lang === 'es' ? 'Tu Quiniela' : 'La teva travessa'}</span>
        </div>
      </div>

      <div className="space-y-3 font-sans">
        {consensusList.map((item, index) => {
          if (item.count === 0) return null;
          const userRatingObj = userRanks.find(
            r => r.project_id === item.project.id && r.category === activeTab && r.user_id === currentUser.id && r.edition_year === selectedEditionId
          );
          const myRank = userRatingObj ? userRatingObj.assigned_position : null;
          const hasExactMatch = myRank === (index + 1);

          return (
            <div
              key={item.project.id}
              className="p-3 bg-bg1/40 hover:bg-bg1/70 border border-brand-border rounded-xl flex flex-col sm:grid sm:grid-cols-12 gap-3 items-center transition-all"
            >
              <div className="col-span-8 w-full flex items-center gap-3">
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-black text-xs shrink-0 select-none ${
                    index === 0 ? 'bg-[#81a2cc]/20 text-[#81a2cc] border border-[#81a2cc]/30' :
                    index === 1 ? 'bg-slate-300/20 text-slate-300 border border-slate-300/20' :
                    index === 2 ? 'bg-slate-400/10 text-slate-400 border border-slate-400/20' :
                    'bg-bg2 border border-brand-border text-brand-text-muted'
                }`}>
                  {index + 1}r
                </span>
                
                {item.firstPhotoUrl ? (
                  <div 
                    className="w-10 h-10 rounded-lg overflow-hidden border border-brand-border hover:border-brand-accent shrink-0 bg-bg2 cursor-zoom-in transition-colors group/mini"
                    onClick={() => {
                      const fullList = (item.sortedPhotos || []).map((pt: any) => ({
                        url: pt.file_url,
                        fileName: pt.file_name || 'foto.jpg',
                      }));
                      const startIdx = (item.sortedPhotos || []).length > 1 ? 1 : 0;
                      onPhotoClick(fullList as any, startIdx, item.firstPhotoUrl || '');
                    }}
                  >
                    <img
                      src={item.firstPhotoUrl}
                      alt="miniatura"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform group-hover/mini:scale-110 duration-200"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-lg border border-brand-border shrink-0 bg-bg2 flex items-center justify-center text-xs text-brand-text-muted font-bold">
                    📷
                  </div>
                )}

                <div className="truncate text-left min-w-0">
                  <h5 className="text-xs font-bold font-mono text-brand-text truncate leading-tight">
                    {item.project.author_name}
                  </h5>
                  <p className="text-[10px] text-brand-accent truncate mt-0.5 font-sans">
                    "{item.project.project_title}"
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[9px] text-brand-text-muted font-mono leading-none flex-wrap">
                    <span className="bg-bg2 px-1 py-0.5 rounded text-brand-text/95">
                      {lang === 'es' ? 'Media' : 'Mitjana'}: {item.avg.toFixed(2)}
                    </span>
                    <span>·</span>
                    <span className="bg-[#81a2cc]/5 border border-[#81a2cc]/10 px-1 py-0.5 rounded flex items-center gap-1">
                      <span className="opacity-70">{lang === 'es' ? 'Consenso' : 'Consens'}:</span>
                      <span className={
                        item.consensusRating === 'Muy alto' ? 'text-teal-400 font-bold' :
                        item.consensusRating === 'Alto' ? 'text-emerald-400 font-bold' :
                        item.consensusRating === 'Notable' ? 'text-[#81a2cc] font-bold' :
                        'text-amber-400/80 font-semibold'
                      }>
                        {item.consensusLabel}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="col-span-4 w-full sm:w-auto flex sm:justify-end items-center gap-2">
                <span className="text-[10px] text-brand-text-muted font-mono sm:hidden">
                  {lang === 'es' ? 'Tu valoración:' : 'La teva valoració:'}
                </span>
                {myRank ? (
                  <div className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5 shrink-0 ${
                    hasExactMatch
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-bg2 border border-brand-border text-brand-text'
                  }`}>
                    {hasExactMatch && <span className="text-[10px] text-emerald-400">✅</span>}
                    {myRank}r {lang === 'es' ? 'pos.' : 'lloc'}
                  </div>
                ) : (
                  <span className="text-xs text-brand-text-muted italic px-2 font-mono">
                    No votat
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface ZampaConsensusAffinitiesProps {
  projects: ZampaProject[];
  userRanks: ZampaUserRank[];
  activeTab: string;
  selectedEditionId: number;
  users: User[];
  currentUser: User;
  lang: 'ca' | 'es';
}

export function ZampaConsensusAffinities({
  projects,
  userRanks,
  activeTab,
  selectedEditionId,
  users,
  currentUser,
  lang,
}: ZampaConsensusAffinitiesProps) {
  const categoryProjects = projects.filter(p => p.category === activeTab && p.edition_year === selectedEditionId);
  
  const consensusList = categoryProjects.map(proj => {
    const ranks = userRanks.filter(r => r.project_id === proj.id && r.category === activeTab && r.edition_year === selectedEditionId);
    const count = ranks.length;
    const sum = ranks.reduce((acc, r) => acc + r.assigned_position, 0);
    const avg = count > 0 ? sum / count : 999;
    const firsts = ranks.filter(r => r.assigned_position === 1).length;
    return { project: proj, avg, sum, firsts, count };
  }).sort((a, b) => {
    if (a.avg !== b.avg) return a.avg - b.avg;
    if (a.firsts !== b.firsts) return b.firsts - a.firsts;
    if (a.sum !== b.sum) return a.sum - b.sum;
    return a.project.author_name.localeCompare(b.project.author_name);
  });

  const hasVotes = consensusList.some(item => item.count > 0);

  if (!hasVotes) {
    return (
      <div className="bg-surface1 border border-brand-border rounded-2xl p-5 md:p-6 space-y-4 text-left shadow-lg">
        <h4 className="font-bold text-sm tracking-wider uppercase text-brand-text flex items-center gap-1.5">
          <Sparkles size={16} className="text-[#81a2cc]" />
          {lang === 'es' ? 'Sintonía con el Consenso' : 'Sintonia amb el Consens'}
        </h4>
        <p className="text-xs text-brand-text-muted italic py-4 font-sans text-center">
          {lang === 'es' ? 'Sin datos de votaciones de socios.' : 'Sense dades de votacions dels socis.'}
        </p>
      </div>
    );
  }

  const votingPartners = users.map(user => {
    const partnerRanks = userRanks.filter(r => r.user_id === user.id && r.category === activeTab && r.edition_year === selectedEditionId);
    if (partnerRanks.length === 0) return { user, deviation: null, matchesCount: 0, count: 0 };

    let totalDeviation = 0;
    let matchesCount = 0;

    partnerRanks.forEach(rank => {
      const consensusIdx = consensusList.findIndex(item => item.project.id === rank.project_id);
      if (consensusIdx !== -1) {
        const consensusPos = consensusIdx + 1;
        const userPos = rank.assigned_position;
        totalDeviation += Math.abs(userPos - consensusPos);
        if (userPos === consensusPos) {
          matchesCount++;
        }
      }
    });

    return {
      user,
      deviation: totalDeviation,
      matchesCount,
      count: partnerRanks.length
    };
  })
  .filter(entry => entry.count > 0)
  .sort((a, b) => {
    if (a.deviation !== b.deviation) return (a.deviation ?? 999) - (b.deviation ?? 999);
    if (b.matchesCount !== a.matchesCount) return b.matchesCount - a.matchesCount;
    return a.user.display_name.localeCompare(b.user.display_name);
  });

  if (votingPartners.length === 0) {
    return (
      <div className="bg-surface1 border border-brand-border rounded-2xl p-5 md:p-6 space-y-4 text-left shadow-lg">
        <h4 className="font-bold text-sm tracking-wider uppercase text-brand-text flex items-center gap-1.5">
          <Sparkles size={16} className="text-[#81a2cc]" />
          {lang === 'es' ? 'Sintonía con el Consenso' : 'Sintonia amb el Consens'}
        </h4>
        <p className="text-xs text-brand-text-muted italic py-4 font-sans text-center">
          {lang === 'es' ? 'Ningún socio ha votado todavía.' : 'Cap soci ha realitzat votació encara.'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface1 border border-brand-border rounded-2xl p-5 md:p-6 space-y-4 text-left shadow-lg">
      <div className="border-b border-brand-border pb-3">
        <h4 className="font-bold text-sm tracking-wider uppercase text-brand-text flex items-center gap-1.5">
          <Sparkles size={16} className="text-[#81a2cc]" />
          {lang === 'es' ? 'Sintonía con el Consenso' : 'Sintonia amb el Consens'}
        </h4>
        <p className="text-[10px] text-brand-text-muted mt-0.5 leading-relaxed font-sans">
          {lang === 'es'
            ? 'Socios que más se aproximan a la Travessa de la FEM. Se ordena por menor desviación acumulada respecto al consenso colectivo.'
            : 'Socis que més s\'aproximen a la Travessa de la FEM. S\'ordena de menor a major dispersió/desviació acumulada respecte al consens col·lectiu.'}
        </p>
      </div>

      <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1">
        {votingPartners.map((entry, index) => {
          const isMe = entry.user.id === currentUser.id;
          const badgeBg = 
            index === 0 ? 'bg-yellow-400/20 text-yellow-300 border border-yellow-400/30' :
            index === 1 ? 'bg-gray-300/20 text-gray-300 border border-gray-300/20' :
            index === 2 ? 'bg-amber-600/20 text-amber-500 border border-amber-600/20' :
            'bg-bg2 border border-brand-border text-brand-text-muted';

          return (
            <div
              key={entry.user.id}
              className={`p-3 rounded-xl border flex justify-between items-center transition-all ${
                isMe
                  ? 'bg-purple-500/10 border-purple-500/40'
                  : 'bg-bg1/30 border-brand-border'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <span className={`w-6 h-6 rounded-md flex items-center justify-center font-mono font-bold text-[10px] shrink-0 ${badgeBg}`}>
                  #{index + 1}
                </span>
                <span className={`text-xs truncate font-sans ${isMe ? 'text-purple-300 font-bold' : 'text-brand-text'}`}>
                  {entry.user.display_name} {isMe && `(${lang === 'es' ? 'Tú' : 'Tu'})`}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0 font-mono text-[10px]">
                {entry.matchesCount > 0 && (
                  <span 
                    className="bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 font-bold px-1.5 py-0.5 rounded" 
                    title={lang === 'es' ? 'Nro. de coincidencias con el consenso' : 'Nro. de coincidències amb el consens'}
                  >
                    {entry.matchesCount}🎯
                  </span>
                )}
                <span 
                  className="bg-bg2 border border-brand-border text-brand-text font-bold px-2 py-0.5 rounded" 
                  title={lang === 'es' ? 'Dispersión/desviación acumulada respecto al consenso colectivo' : 'Dispersió/desviació acumulada respecte al consens col·lectiu'}
                >
                  {lang === 'es' ? 'Dispersión' : 'Dispersió'}: ±{entry.deviation}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface ZampaProximityDianaProps {
  partnerProximityList: { partner: User; pos: number | null }[];
  currentUser: User;
  lang: 'ca' | 'es';
  officialWinnerObj?: ZampaProject;
  onPhotoClick?: (photos: ZampaPhoto[], startIdx: number, url: string) => void;
}

export function ZampaProximityDiana({
  partnerProximityList,
  currentUser,
  lang,
  officialWinnerObj,
  onPhotoClick,
}: ZampaProximityDianaProps) {
  const hasWinner = !!officialWinnerObj;

  return (
    <div className="bg-surface1 border-2 border-brand-border-high rounded-2xl p-6 space-y-4 text-left shadow-lg">
      <div className={`grid grid-cols-1 ${hasWinner ? 'md:grid-cols-12' : ''} gap-4 pb-3.5 border-b border-brand-border/60`}>
        <div className={hasWinner ? 'md:col-span-8 space-y-3' : 'space-y-3'}>
          <div className="flex items-center gap-2">
            <Award size={24} className="text-[#81a2cc]" />
            <h4 className="font-extrabold text-base sm:text-lg tracking-wider uppercase text-white">
              {lang === 'es' ? 'Proximidad a la decisión de los jueces (La Diana)' : 'Proximitat a la decisió dels jutges (La Diana)'}
            </h4>
          </div>

          <p className="text-xs sm:text-sm text-brand-text font-medium leading-relaxed font-sans">
            {lang === 'es'
              ? 'A continuación se muestran los socios de la agrupación ordenados según quién colocó en lo más alto de su lista el proyecto ganador del jurado comercial:'
              : "A continuació es mostren els socis de l'agrupació ordenats segons qui va col·locar a dalt de tot de la seva llista el projecte guanyador del jurat comercial:"}
          </p>
        </div>

        {hasWinner && (
          <div className="md:col-span-4 bg-bg2 p-3 rounded-xl border border-brand-border-high/40 flex flex-col items-center text-center space-y-2">
            <span className="text-[9px] uppercase font-bold tracking-widest text-[#81a2cc] bg-surface2 px-2 py-0.5 rounded border border-brand-border-high/30">
              🏆 {lang === 'es' ? 'Ganador' : 'Guanyador'}
            </span>
            {(() => {
              const sortedPhotos = [...((officialWinnerObj as any).photos || [])].sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));
              const mainPhoto = sortedPhotos.length > 1 ? sortedPhotos[1] : sortedPhotos[0];
              if (!mainPhoto) return null;
              return (
                <div
                  className="aspect-[4/3] w-full rounded-lg overflow-hidden border border-brand-border-high hover:border-amber-400 cursor-zoom-in transition-all relative group"
                  onClick={() => {
                    if (onPhotoClick) {
                      onPhotoClick(sortedPhotos, sortedPhotos.indexOf(mainPhoto), mainPhoto.file_url);
                    }
                  }}
                >
                  <img
                    src={mainPhoto.file_url}
                    alt="Guanyador"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 duration-200">
                    <span className="bg-black/75 text-[10px] text-white py-1 px-2 rounded font-sans">🔍</span>
                  </div>
                </div>
              );
            })()}
            <div className="min-w-0 w-full">
              <h5 className="text-xs font-bold text-white truncate font-mono leading-none">{officialWinnerObj.author_name}</h5>
              <p className="text-[10px] italic text-[#81a2cc] font-bold truncate mt-0.5">"{officialWinnerObj.project_title}"</p>
            </div>
          </div>
        )}
      </div>

      {partnerProximityList.length === 0 ? (
        <p className="text-sm text-slate-300 italic py-4">No s'han rebut valoracions de socis per a aquest any.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
          {partnerProximityList.map((entry, index) => {
            const isMe = entry.partner.id === currentUser.id;
            const pos = entry.pos;
            
            const formattedText = lang === 'es' 
              ? `Podio: ${pos}º` 
              : `Podi: ${pos === 1 ? '1er' : pos === 2 ? '2on' : pos === 3 ? '3er' : `${pos}è`}`;

            let badgeClass = '';
            if (pos === 1) {
              badgeClass = 'bg-amber-400/10 text-amber-300 border border-amber-400/40 shadow-[0_0_8px_rgba(251,191,36,0.1)]';
            } else if (pos === 2) {
              badgeClass = 'bg-slate-300/10 text-slate-200 border border-slate-300/35 shadow-[0_0_8px_rgba(203,213,225,0.1)]';
            } else if (pos === 3) {
              badgeClass = 'bg-[#cd7f32]/10 text-[#f5a152] border-[#cd7f32]/35 shadow-[0_0_8px_rgba(205,127,50,0.1)]';
            } else {
              badgeClass = 'bg-surface3/40 text-brand-text/80 border border-brand-border/40';
            }

            return (
              <div 
                key={entry.partner.id}
                className={`p-3 rounded-xl border flex items-center justify-between gap-3 font-sans ${
                  isMe ? 'bg-purple-500/10 border-purple-500/40' : 'bg-bg1/20 border-brand-border/50 hover:border-brand-border-high'
                }`}
              >
                <div className="flex items-center gap-2 truncate min-w-0">
                  <span className={`w-5 h-5 rounded-md flex items-center justify-center font-mono font-bold text-[9px] shrink-0 ${
                    index === 0 ? 'bg-yellow-400 text-black font-black' : 'bg-surface3 text-brand-text-muted border border-brand-border'
                  }`}>
                    #{index + 1}
                  </span>
                  <span className={`text-xs truncate font-medium ${isMe ? 'text-purple-300 font-bold' : 'text-brand-text'}`}>
                    {entry.partner.display_name} {isMe && `(${lang === 'es' ? 'Tú' : 'Tu'})`}
                  </span>
                </div>
                
                <span className={`font-mono text-[10px] font-extrabold px-2.5 py-1 rounded-lg shrink-0 border uppercase ${badgeClass}`}>
                  {formattedText}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

interface ZampaFinishedTravessaProps {
  projects: ZampaProject[];
  userRanks: ZampaUserRank[];
  activeTab: string;
  selectedEditionId: number;
  currentUser: User;
  lang: 'ca' | 'es';
  sectionCSort: 'popular' | 'consensus' | 'my_vote';
  setSectionCSort: (val: 'popular' | 'consensus' | 'my_vote') => void;
  onPhotoClick: (photos: ZampaPhoto[], startIdx: number, url: string) => void;
  officialWinnerObj?: ZampaProject;
}

export function ZampaFinishedTravessa({
  projects,
  userRanks,
  activeTab,
  selectedEditionId,
  currentUser,
  lang,
  sectionCSort,
  setSectionCSort,
  onPhotoClick,
  officialWinnerObj,
}: ZampaFinishedTravessaProps) {
  const categoryProjects = projects.filter(p => p.category === activeTab && p.edition_year === selectedEditionId);
  const consensusList = categoryProjects.map(proj => {
    const ranks = userRanks.filter(r => r.project_id === proj.id && r.category === activeTab && r.edition_year === selectedEditionId);
    const count = ranks.length;
    const sum = ranks.reduce((acc, r) => acc + r.assigned_position, 0);
    const avg = count > 0 ? sum / count : 999;
    const firsts = ranks.filter(r => r.assigned_position === 1).length;

    const myPos = userRanks.find(r => r.project_id === proj.id && r.user_id === currentUser.id && r.category === activeTab && r.edition_year === selectedEditionId)?.assigned_position ?? 999;

    return {
      project: proj,
      avg,
      sum,
      firsts,
      count,
      consensusRank: 999,
      myPos
    };
  });

  consensusList.sort((a, b) => {
    if (a.avg !== b.avg) return a.avg - b.avg;
    if (a.firsts !== b.firsts) return b.firsts - a.firsts;
    if (a.sum !== b.sum) return a.sum - b.sum;
    return a.project.author_name.localeCompare(b.project.author_name);
  });

  consensusList.forEach((item, index) => {
    item.consensusRank = index + 1;
  });

  const hasVotes = consensusList.some(item => item.count > 0);

  if (!hasVotes) {
    return (
      <div className="bg-surface1 border-2 border-brand-border-high rounded-2xl p-6 text-left shadow-lg">
        <h4 className="font-extrabold text-base sm:text-lg tracking-wider uppercase text-white flex items-center gap-2 pb-3 border-b border-brand-border">
          <ListOrdered size={24} className="text-[#81a2cc]" />
          {lang === 'es' ? 'La Quiniela de la FEM (Consenso)' : 'La Travessa de la FEM (Consens)'}
        </h4>
        <p className="text-sm text-slate-300 italic py-4 text-center">
          {lang === 'es' ? 'No hay suficientes votaciones de socios para calcular el consenso.' : 'No hi ha suficients votacions de socis per calcular el consens.'}
        </p>
      </div>
    );
  }

  const sortedList = [...consensusList].sort((a, b) => {
    if (sectionCSort === 'popular') {
      const posA = a.project.popular_rank_position ?? 999;
      const posB = b.project.popular_rank_position ?? 999;
      if (posA !== posB) return posA - posB;
    } else if (sectionCSort === 'consensus') {
      if (a.consensusRank !== b.consensusRank) return a.consensusRank - b.consensusRank;
    } else if (sectionCSort === 'my_vote') {
      if (a.myPos !== b.myPos) return a.myPos - b.myPos;
    }
    return a.project.author_name.localeCompare(b.project.author_name);
  });

  let activeColumns: ('popular' | 'consensus' | 'my_vote')[];
  if (sectionCSort === 'popular') {
    activeColumns = ['popular', 'consensus', 'my_vote'];
  } else if (sectionCSort === 'consensus') {
    activeColumns = ['consensus', 'popular', 'my_vote'];
  } else {
    activeColumns = ['my_vote', 'consensus', 'popular'];
  }

  const getHeaderName = (colType: 'popular' | 'consensus' | 'my_vote') => {
    if (colType === 'popular') return lang === 'es' ? 'Voto Popular' : 'Vot Popular';
    if (colType === 'consensus') return lang === 'es' ? 'Consenso Socios' : 'Consens Socis';
    return lang === 'es' ? 'Tu Veredicto' : 'El Teu Vot';
  };

  const getColVal = (item: typeof consensusList[0], colType: 'popular' | 'consensus' | 'my_vote') => {
    if (colType === 'popular') return item.project.popular_rank_position ?? 999;
    if (colType === 'consensus') return item.consensusRank;
    return item.myPos;
  };

  const renderMetallicBadge = (val: number | string) => {
    const numericVal = typeof val === 'number' ? val : parseInt(val.toString(), 10);
    const isNaNVal = isNaN(numericVal) || numericVal === 999;
    
    if (isNaNVal) {
      return (
        <span className="font-mono text-xs text-brand-text-muted/50 font-semibold px-2.5 py-1 bg-surface3/40 border border-brand-border/30 rounded-lg select-none inline-block min-w-[75px] text-center">
          -
        </span>
      );
    }

    const formattedText = lang === 'es' 
      ? `${numericVal}º` 
      : `${numericVal}${numericVal === 1 ? 'r' : numericVal === 2 ? 'n' : numericVal === 3 ? 'r' : 'è'}`;

    let badgeStyle = '';
    if (numericVal === 1) {
      badgeStyle = 'bg-amber-400/10 text-amber-300 border border-amber-400/40 shadow-[0_0_8px_rgba(251,191,36,0.15)]';
    } else if (numericVal === 2) {
      badgeStyle = 'bg-slate-300/10 text-slate-200 border border-slate-300/35 shadow-[0_0_8px_rgba(203,213,225,0.15)]';
    } else if (numericVal === 3) {
      badgeStyle = 'bg-[#cd7f32]/10 text-[#f5a152] border-[#cd7f32]/35 shadow-[0_0_8px_rgba(205,127,50,0.15)]';
    } else {
      badgeStyle = 'bg-surface3 text-brand-text/90 border border-brand-border';
    }

    return (
      <span className={`font-mono text-xs font-black px-2.5 py-1 rounded-lg border inline-block select-none shrink-0 whitespace-nowrap min-w-[85px] text-center ${badgeStyle}`}>
        {formattedText}
      </span>
    );
  };

  const popularWinnerObj = [...categoryProjects]
    .filter(p => p.popular_rank_position != null && p.popular_rank_position > 0)
    .sort((a, b) => (a.popular_rank_position || 999) - (b.popular_rank_position || 999))[0];

  const displayWinnerObj = popularWinnerObj || officialWinnerObj;
  const isPopularWinner = !!popularWinnerObj;
  const hasWinner = !!displayWinnerObj;

  return (
    <div className="bg-surface1 border-2 border-brand-border-high rounded-2xl p-6 space-y-5 text-left shadow-lg">
      <div className={`grid grid-cols-1 ${hasWinner ? 'md:grid-cols-12' : ''} gap-4 pb-3.5 border-b border-brand-border/60`}>
        <div className={hasWinner ? 'md:col-span-8 space-y-3' : 'space-y-3'}>
          <div className="flex items-center gap-2.5">
            <ListOrdered size={24} className="text-[#81a2cc]" />
            <h4 className="font-extrabold text-base sm:text-lg tracking-wider uppercase text-white">
              {lang === 'es' ? 'La Quiniela de la FEM (Consenso de Socios)' : 'La Travessa de la FEM (Consens dels Socis)'}
            </h4>
          </div>

          <p className="text-xs sm:text-sm text-brand-text font-medium leading-relaxed font-sans">
            {lang === 'es'
              ? 'Esta es la clasificación colectiva de los proyectos resultante de calcular la posición media asignada por todos los socios que han emitido su voto, ordenados por la clasificación general de la votación popular.'
              : 'Aquesta és la classificació col·lectiva dels lliuraments resultant de calcular la posició mitjana assignada per tots els socis que han emès el seu veredicte, ordenats per la classificació general del vot popular.'}
          </p>
        </div>

        {hasWinner && displayWinnerObj && (
          <div className="md:col-span-4 bg-bg2 p-3 rounded-xl border border-brand-border-high/40 flex flex-col items-center text-center space-y-2">
            <span className="text-[9px] uppercase font-bold tracking-widest text-[#81a2cc] bg-surface2 px-2 py-0.5 rounded border border-brand-border-high/30">
              🏆 {isPopularWinner 
                ? (lang === 'es' ? 'Ganador Voto Popular' : 'Guanyador Vot Popular') 
                : (lang === 'es' ? 'Ganador Oficial' : 'Guanyador Oficial')}
            </span>
            {(() => {
              const sortedPhotos = [...((displayWinnerObj as any).photos || [])].sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));
              const mainPhoto = sortedPhotos.length > 1 ? sortedPhotos[1] : sortedPhotos[0];
              if (!mainPhoto) return null;
              return (
                <div
                  className="aspect-[4/3] w-full rounded-lg overflow-hidden border border-brand-border-high hover:border-amber-400 cursor-zoom-in transition-all relative group"
                  onClick={() => {
                    if (onPhotoClick) {
                      onPhotoClick(sortedPhotos, sortedPhotos.indexOf(mainPhoto), mainPhoto.file_url);
                    }
                  }}
                >
                  <img
                    src={mainPhoto.file_url}
                    alt="Guanyador"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 duration-200">
                    <span className="bg-black/75 text-[10px] text-white py-1 px-2 rounded font-sans">🔍</span>
                  </div>
                </div>
              );
            })()}
            <div className="min-w-0 w-full">
              <h5 className="text-xs font-bold text-white truncate font-mono leading-none">{displayWinnerObj.author_name}</h5>
              <p className="text-[10px] italic text-[#81a2cc] font-bold truncate mt-0.5">"{displayWinnerObj.project_title}"</p>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4 font-sans">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-bg2 p-4 rounded-xl border border-brand-border-high/30">
          <label className="text-xs font-bold uppercase tracking-wider text-[#81a2cc] shrink-0">
            {lang === 'es' ? 'Ordenar lista por:' : 'Ordenació de la llista per:'}
          </label>
          <select
            value={sectionCSort}
            onChange={(e) => setSectionCSort(e.target.value as any)}
            className="bg-surface2 border border-brand-border hover:border-brand-accent-glow text-brand-text font-semibold text-xs py-2 px-3.5 rounded-lg cursor-pointer focus:outline-none focus:ring-1 focus:ring-brand-accent transition-all min-w-[200px]"
          >
            <option value="popular">
              {lang === 'es' ? 'Voto Popular (Sala)' : 'Vot Popular (Sala)'}
            </option>
            <option value="consensus">
              {lang === 'es' ? 'Consenso Socios (Quiniela / Travessa)' : 'Consens dels Socis (Travessa/Quiniela)'}
            </option>
            <option value="my_vote">
              {lang === 'es' ? 'Tu apuesta personal' : 'El teu vot personal'}
            </option>
          </select>
        </div>

        <div className="hidden md:grid md:grid-cols-12 gap-4 px-4 py-3 text-xs sm:text-xs font-extrabold uppercase tracking-widest text-[#e5eefe] bg-bg2 rounded-xl border-2 border-brand-border-high">
          <div className="col-span-3 text-center text-[#e5eefe] font-extrabold">{getHeaderName(activeColumns[0])}</div>
          <div className="col-span-5 text-left text-[#e5eefe] font-extrabold pl-3">{lang === 'es' ? 'PROYECTO' : 'PROJECTE'}</div>
          <div className="col-span-2 text-center text-[#e5eefe] font-extrabold">{getHeaderName(activeColumns[1])}</div>
          <div className="col-span-2 text-center text-[#e5eefe] font-extrabold">{getHeaderName(activeColumns[2])}</div>
        </div>

        {sortedList.map((item) => {
          if (item.count === 0) return null;
          
          const sortedPhotos = [...((item.project as any).photos || [])].sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));
          const mainPhoto = sortedPhotos.length > 1 ? sortedPhotos[1] : (sortedPhotos.length > 0 ? sortedPhotos[0] : null);

          let cardBorder = 'border-brand-border hover:border-brand-border-high bg-bg2';
          if (item.consensusRank === 1) {
            cardBorder = 'border-amber-400/20 shadow-[0_0_12px_rgba(251,191,36,0.03)] bg-amber-400/[0.005] hover:border-amber-400/35';
          } else if (item.consensusRank === 2) {
            cardBorder = 'border-slate-300/20 shadow-[0_0_12px_rgba(203,213,225,0.03)] bg-slate-300/[0.005] hover:border-slate-300/35';
          } else if (item.consensusRank === 3) {
            cardBorder = 'border-[#cd7f32]/25 shadow-[0_0_12px_rgba(205,127,50,0.03)] bg-[#cd7f32]/[0.005] hover:border-[#cd7f32]/35';
          }

          const colVal1 = getColVal(item, activeColumns[0]);
          const colVal2 = getColVal(item, activeColumns[1]);
          const colVal3 = getColVal(item, activeColumns[2]);

          return (
            <div
              key={item.project.id}
              className={`border-2 rounded-xl p-4 md:p-5 grid grid-cols-1 md:grid-cols-12 items-center gap-4 hover:bg-surface2 transition-all duration-200 shadow-md ${cardBorder}`}
            >
              <div className="col-span-12 md:col-span-3 flex md:justify-center items-center gap-3">
                <span className="md:hidden text-xs text-[#81a2cc]/80 font-bold uppercase shrink-0 min-w-[120px]">
                  {getHeaderName(activeColumns[0])}:
                </span>
                {renderMetallicBadge(colVal1)}
              </div>

              <div className="col-span-12 md:col-span-5 flex items-center gap-3 min-w-0">
                <span className="md:hidden text-xs text-slate-300 font-bold uppercase shrink-0 min-w-[120px]">
                  {lang === 'es' ? 'Proyecto' : 'Projecte'}:
                </span>
                
                <div className="flex items-center gap-3 truncate min-w-0">
                  {mainPhoto && (
                    <div
                      className="w-16 h-12 rounded-lg overflow-hidden border-2 border-brand-border hover:border-brand-accent cursor-zoom-in shrink-0 relative group shadow-md"
                      onClick={() => {
                        const fullList = sortedPhotos.map((pt: any) => ({
                          url: pt.file_url,
                          fileName: pt.file_name || 'foto.jpg',
                        }));
                        onPhotoClick(fullList as any, sortedPhotos.indexOf(mainPhoto), mainPhoto.file_url);
                      }}
                      title={lang === 'es' ? 'Ver fotos completas' : 'Veure fotos completes'}
                    >
                      <img
                        src={mainPhoto.file_url}
                        alt={mainPhoto.file_name || "Project photo"}
                        className="w-full h-full object-cover transition-transform group-hover:scale-115 duration-200"
                      />
                    </div>
                  )}
                  <div className="truncate min-w-0 font-sans">
                    <h5 className="text-sm sm:text-base font-black text-white truncate leading-tight">
                      {item.project.author_name}
                    </h5>
                    <p className="text-xs text-[#81a2cc] font-bold truncate italic mt-0.5">
                      "{item.project.project_title}"
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-span-12 md:col-span-2 flex md:justify-center items-center gap-3">
                <span className="md:hidden text-xs text-[#81a2cc]/80 font-bold uppercase shrink-0 min-w-[120px]">
                  {getHeaderName(activeColumns[1])}:
                </span>
                {renderMetallicBadge(colVal2)}
              </div>

              <div className="col-span-12 md:col-span-2 flex md:justify-center items-center gap-3">
                <span className="md:hidden text-xs text-[#81a2cc]/80 font-bold uppercase shrink-0 min-w-[120px]">
                  {getHeaderName(activeColumns[2])}:
                </span>
                {renderMetallicBadge(colVal3)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
