import React, { useState, useEffect } from 'react';
import { ZampaEdition, ZampaProject, ZampaPhoto, ZampaUserRank, User } from '../types';
import { t } from '../lib/translations';
import { Award, ArrowUp, ArrowDown, Sparkles, Check, Lock, Trophy, ListOrdered } from 'lucide-react';
import FullscreenViewer from './FullscreenViewer';
import ConfirmModal from './ConfirmModal';
import { ZampaWinnerCard, ZampaGallery, ZampaConsensusTravessa, ZampaConsensusAffinities, ZampaProximityDiana, ZampaFinishedTravessa } from './ZampaSubComponents';

interface ZampaParticipantProps {
  currentEdition: ZampaEdition;
  editions: ZampaEdition[];
  projects: ZampaProject[];
  userRanks: ZampaUserRank[];
  currentUser: User;
  onSaveRating: (ranks: ZampaUserRank[]) => Promise<boolean>;
  lang: 'ca' | 'es';
  users: User[];
}

export default function ZampaParticipant({
  currentEdition,
  editions,
  projects,
  userRanks,
  currentUser,
  onSaveRating,
  lang,
  users,
}: ZampaParticipantProps) {
  const activeTab = 'adult';

  const [selectedEditionId, setSelectedEditionId] = useState<number>(currentEdition.id);
  const [selectedTab, setSelectedTab] = useState<'results_gallery' | 'consensus_rankings'>('results_gallery');

  const selectedEdition = editions.find((e) => e.id === selectedEditionId) || currentEdition;

  // Reset selected edition if currentEdition prop updates
  useEffect(() => {
    setSelectedEditionId(currentEdition.id);
  }, [currentEdition.id]);

  
  // Sorted list for user ordering in "vote" mode
  const [orderedProjects, setOrderedProjects] = useState<ZampaProject[]>([]);
  const [submittingRating, setSubmittingRating] = useState(false);

  // Smooth scrolling / tracking state on move
  const [lastMovedId, setLastMovedId] = useState<string | null>(null);
  const [highlightId, setHighlightId] = useState<string | null>(null);

  useEffect(() => {
    if (lastMovedId) {
      const element = document.getElementById(`project-card-${lastMovedId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      setHighlightId(lastMovedId);
      const timer = setTimeout(() => {
        setHighlightId(null);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [lastMovedId, orderedProjects]);

  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const triggerConfirm = (config: Omit<typeof confirmConfig, 'isOpen'>) => {
    setConfirmConfig({ ...config, isOpen: true });
  };

  const closeConfirm = () => {
    setConfirmConfig(prev => ({ ...prev, isOpen: false }));
  };


  // Lightbox viewer states
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxUrl, setLightboxUrl] = useState('');
  const [lightboxPhotos, setLightboxPhotos] = useState<{ url: string; fileName?: string }[]>([]);
  const [lightboxStartIdx, setLightboxStartIdx] = useState(0);

  // Sorting criteria for Section C
  const [sectionCSort, setSectionCSort] = useState<'popular' | 'consensus' | 'my_vote'>('popular');

  // Is current category locked?
  const isVoted = userRanks.some((r) => r.category === activeTab && r.user_id === currentUser.id && r.edition_year === selectedEditionId);

  // Initialize order on focus/category change
  useEffect(() => {
    const subset = projects.filter((p) => p.category === activeTab && p.edition_year === selectedEditionId);
    
    // Check if there are already saved ratings for the user
    const existingRanks = userRanks.filter((r) => r.category === activeTab && r.user_id === currentUser.id && r.edition_year === selectedEditionId);

    if (existingRanks.length > 0) {
      // Sort subset using assigned position
      const sorted = [...subset].sort((a, b) => {
        const rankA = existingRanks.find((r) => r.project_id === a.id)?.assigned_position ?? 999;
        const rankB = existingRanks.find((r) => r.project_id === b.id)?.assigned_position ?? 999;
        return rankA - rankB;
      });
      setOrderedProjects(sorted);
    } else {
      setOrderedProjects(subset);
    }
  }, [activeTab, projects, userRanks, selectedEditionId, currentUser.id]);

  // Handle shift up in the list
  const shiftUp = (index: number) => {
    if (index === 0) return;
    const nextList = [...orderedProjects];
    const item = nextList[index];
    nextList[index] = nextList[index - 1];
    nextList[index - 1] = item;
    setOrderedProjects(nextList);
    setLastMovedId(item.id);
  };

  // Handle shift down in the list
  const shiftDown = (index: number) => {
    if (index === orderedProjects.length - 1) return;
    const nextList = [...orderedProjects];
    const item = nextList[index];
    nextList[index] = nextList[index + 1];
    nextList[index + 1] = item;
    setOrderedProjects(nextList);
    setLastMovedId(item.id);
  };

  // Handle moving to a specific 0-based index position and shifting other projects
  const moveToPosition = (currentIndex: number, targetIndex: number) => {
    if (currentIndex === targetIndex) return;
    if (targetIndex < 0 || targetIndex >= orderedProjects.length) return;
    
    const nextList = [...orderedProjects];
    const [item] = nextList.splice(currentIndex, 1);
    nextList.splice(targetIndex, 0, item);
    setOrderedProjects(nextList);
    setLastMovedId(item.id);
  };

   const submitRatingDirectly = async () => {
    setSubmittingRating(true);
    try {
      const payload: ZampaUserRank[] = orderedProjects.map((proj, idx) => ({
        user_id: currentUser.id,
        project_id: proj.id,
        edition_year: selectedEdition.id,
        category: activeTab,
        assigned_position: idx + 1,
      }));

      await onSaveRating(payload);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingRating(false);
    }
  };

  // Submit traveler predictions for the active category
  const handleSubmitRating = () => {
    triggerConfirm({
      title: "Enviar Valoració?",
      message: t('zampa_confirm_rating', lang) || "Vols enviar la teva valoració ara? No la podràs modificar fins que es tanquin les votacions.",
      onConfirm: submitRatingDirectly,
      confirmText: "Sí, enviar",
    });
  };

  // --- CALCULATION FOR 'FINISHED' METHOD ---

  // Get official winner details
  const winnerId = selectedEdition.official_winner_adult;
  const officialWinnerObj = projects.find((p) => p.id === winnerId && p.edition_year === selectedEditionId);

  // Compute the consensus ranking position of the official winner project
  let winnerConsensusRank: number | null = null;
  if (officialWinnerObj) {
    const categoryProjects = projects.filter(p => p.category === activeTab && p.edition_year === selectedEditionId);
    const calculatedConsensusList = categoryProjects.map(proj => {
      const ranks = userRanks.filter(r => r.project_id === proj.id && r.category === activeTab && r.edition_year === selectedEditionId);
      const count = ranks.length;
      const sum = ranks.reduce((acc, r) => acc + r.assigned_position, 0);
      const avg = count > 0 ? sum / count : 999;
      const firsts = ranks.filter(r => r.assigned_position === 1).length;
      return {
        id: proj.id,
        author_name: proj.author_name,
        avg,
        sum,
        firsts
      };
    });

    // Sort to determine consensusRank
    calculatedConsensusList.sort((a, b) => {
      if (a.avg !== b.avg) return a.avg - b.avg;
      if (a.firsts !== b.firsts) return b.firsts - a.firsts;
      if (a.sum !== b.sum) return a.sum - b.sum;
      return a.author_name.localeCompare(b.author_name);
    });

    const winIdx = calculatedConsensusList.findIndex(item => item.id === winnerId);
    if (winIdx !== -1) {
      winnerConsensusRank = winIdx + 1;
    }
  }

  // A) Partners' proximity list for the winner
  const allPartners = users;
  
  const partnerProximityList = allPartners
    .map((partner) => {
      // Find what position this partner assigned to the winning project
      const partnerRank = userRanks.find(
        (r) => r.user_id === partner.id && r.project_id === winnerId && r.category === activeTab && r.edition_year === selectedEditionId
      );
      return {
        partner,
        pos: partnerRank ? partnerRank.assigned_position : null,
      };
    })
    .filter((entry) => entry.pos !== null)
    .sort((a, b) => (a.pos || 99) - (b.pos || 99));

  // B) Manhattan deviation affinity list (only for adult category)
  const popularAffinityList = allPartners
    .map((partner) => {
      // Filter partner ranks in this edition & category
      const partnerRanks = userRanks.filter((r) => r.user_id === partner.id && r.category === 'adult' && r.edition_year === selectedEditionId);
      if (partnerRanks.length === 0) return { partner, deviation: null };

      let sumDeviation = 0;
      let ratedCount = 0;

      partnerRanks.forEach((rank) => {
        const proj = projects.find((p) => p.id === rank.project_id && p.edition_year === selectedEditionId);
        const popularRank = proj?.popular_rank_position;
        if (popularRank != null) {
          sumDeviation += Math.abs(rank.assigned_position - popularRank);
          ratedCount++;
        }
      });

      return {
        partner,
        deviation: ratedCount > 0 ? sumDeviation : null,
      };
    })
    .filter((entry) => entry.deviation !== null)
    .sort((a, b) => (a.deviation || 99) - (b.deviation || 99));

  return (
    <div className="space-y-6">
      {/* Dynamic Title and header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl md:text-5xl font-display tracking-widest text-[#e8f0ff] uppercase">
          {t('zampa_title', lang)}
        </h1>
        <p className="text-xs tracking-wider text-brand-text-muted font-mono uppercase">
          EDICIÓ {selectedEdition.id} · SOCIS
        </p>
      </div>

      {/* Dropdown de selecció d'edició - Afecta totes dues pestanyes */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 bg-surface1 border border-brand-border rounded-xl p-4 max-w-md mx-auto shadow-md">
        <label className="text-xs font-bold uppercase tracking-widest text-[#81a2cc]">
          {lang === 'es' ? 'Seleccionar Edición:' : 'Seleccionar Edició:'}
        </label>
        <select
          value={selectedEditionId}
          onChange={(e) => {
            const val = parseInt(e.target.value);
            setSelectedEditionId(val);
          }}
          className="bg-surface2 border border-brand-border hover:border-brand-accent-glow text-brand-text font-black text-sm py-2 px-4 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-accent transition-all w-full sm:w-auto min-w-[150px] text-center"
        >
          {[...editions]
            .sort((a, b) => b.id - a.id)
            .map((ed) => (
              <option key={ed.id} value={ed.id}>
                {ed.id} ({ed.status === 'open' ? (lang === 'es' ? 'Abierta' : 'Oberta') : 
                           ed.status === 'vote' ? (lang === 'es' ? 'Votación' : 'Votació') :
                           ed.status === 'closed' ? (lang === 'es' ? 'Cerrada' : 'Tancada') :
                           (lang === 'es' ? 'Finalizada' : 'Finalitzada')})
              </option>
            ))}
        </select>
      </div>

      {/* Pestanyes de Navegació de Resultats (Només si està tancat o finalitzat) */}
      {(selectedEdition.status === 'closed' || selectedEdition.status === 'finished') && (
        <div className="flex border-b border-brand-border/60 max-w-xl mx-auto justify-center gap-2 mb-2">
          <button
            onClick={() => setSelectedTab('results_gallery')}
            className={`px-5 py-3 text-xs sm:text-sm font-black uppercase tracking-wider transition-all border-b-2 -mb-[1px] cursor-pointer flex items-center gap-2 ${
              selectedTab === 'results_gallery'
                ? 'border-[#81a2cc] text-[#81a2cc]'
                : 'border-transparent text-brand-text-muted hover:text-brand-text'
            }`}
          >
            <span>🖼️</span>
            {selectedEdition.status === 'finished' 
              ? (lang === 'es' ? 'Ganador y Galería' : 'Guanyador i Galeria')
              : (lang === 'es' ? 'Galería de Proyectos' : 'Galeria de Projectes')
            }
          </button>
          <button
            onClick={() => setSelectedTab('consensus_rankings')}
            className={`px-5 py-3 text-xs sm:text-sm font-black uppercase tracking-wider transition-all border-b-2 -mb-[1px] cursor-pointer flex items-center gap-2 ${
              selectedTab === 'consensus_rankings'
                ? 'border-[#81a2cc] text-[#81a2cc]'
                : 'border-transparent text-brand-text-muted hover:text-brand-text'
            }`}
          >
            <span>📊</span>
            {selectedEdition.status === 'finished'
              ? (lang === 'es' ? 'Diana y Travessa' : 'La Diana i la Travessa')
              : (lang === 'es' ? 'La Travessa de la FEM' : 'La Travessa de la FEM')
            }
          </button>
        </div>
      )}

      {/* ELECCIÓ DE VISIBILITATS SEGONS ESTATS */}

      {/* 1. ESTAT "OPEN" (Edició en creació o preparació) */}
      {selectedEdition.status === 'open' && (
        <div className="space-y-6 max-w-xl mx-auto py-10">
          <div className="bg-surface1 border border-brand-border rounded-2xl p-8 text-center space-y-4 shadow-lg shadow-black/10">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-yellow-500/10 text-yellow-500 mb-2">
              <Sparkles size={28} className="animate-pulse" />
            </div>
            <h3 className="text-xl font-bold text-[#e1e7f0] uppercase tracking-wider font-display">
              {lang === 'es' ? 'EDICIÓN EN CREACIÓN' : 'EDICIÓ EN CREACIÓ'}
            </h3>
            <p className="text-xs text-brand-text-muted leading-relaxed font-sans">
              {lang === 'es'
                ? `La edición de Zampa ${selectedEdition.id} se encuentra actualmente en fase de preparación. Se están configurando las propuestas y los portafolios de imágenes de cada participante por parte del equipo editorial.`
                : `L'edició de Zampa ${selectedEdition.id} es troba actualment en fase de preparació i creació. S'estan configurant els projectes i els portfolis d'imatges d'autor per part de l'equip de disseny i edició.`}
            </p>
            <div className="pt-2">
              <span className="inline-block text-[10px] uppercase font-bold tracking-widest bg-yellow-400/15 text-yellow-300 border border-yellow-400/20 px-3 py-1.5 rounded-full">
                {lang === 'es' ? 'Próximamente votación abierta' : 'Pròximament votació oberta'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 2. ESTAT "VOTE" (Participar / Ordenar) */}
      {selectedEdition.status === 'vote' && (
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Banner d'avís */}
          <div className="bg-surface1 border border-brand-border p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
            <div className="space-y-1">
              <p className="text-xs text-brand-text-muted font-medium">
                {isVoted ? t('zampa_ranking_locked', lang) : t('zampa_vote_banner', lang)}
              </p>
              {!isVoted && (
                <p className="text-xs text-yellow-400 font-bold bg-yellow-400/5 py-1 px-2.5 rounded border border-yellow-400/10 inline-block animate-pulse">
                  ⚠️ {lang === 'es' 
                    ? 'Una vez finalizada la clasificación, debes enviar la valoración con el botón al final de la pantalla.' 
                    : 'Un cop finalitzada la classificació, cal enviar la valoració zampa amb el botó del final de la pantalla.'}
                </p>
              )}
            </div>
            <div className="flex-shrink-0">
              {isVoted ? (
                <span className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-500 text-xs px-3 py-1 rounded-full font-bold border border-emerald-500/20">
                  <Lock size={12} /> BLOQUEJAT
                </span>
              ) : (
                <span className="flex items-center gap-1.5 bg-yellow-500/10 text-yellow-500 text-xs px-3 py-1 rounded-full font-bold border border-yellow-500/20">
                  <Sparkles size={12} /> VOTACIÓ OBERTA
                </span>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {orderedProjects.map((proj, idx) => {
              const isHighlighted = highlightId === proj.id;
              return (
                <div
                  key={proj.id}
                  id={`project-card-${proj.id}`}
                  className={`bg-surface1 border rounded-2xl p-5 hover:border-brand-border-high flex flex-col md:flex-row gap-5 transition-all duration-500 ${
                    isHighlighted
                      ? 'border-brand-accent ring-2 ring-brand-accent-glow bg-surface2 shadow-[0_0_20px_rgba(79,143,255,0.3)] scale-[1.015]'
                      : 'border-brand-border'
                  }`}
                >
                {/* Ordre Badge / Controls */}
                <div className="flex md:flex-col items-center justify-between md:justify-center gap-3 md:border-r border-brand-border md:pr-5 min-w-[70px]">
                  <span className={`text-2xl font-mono font-black ${
                    idx === 0 ? 'text-yellow-400' :
                    idx === 1 ? 'text-gray-300' :
                    idx === 2 ? 'text-amber-600' :
                    'text-brand-text-muted/60'
                  }`}>
                    {idx + 1}r
                  </span>

                  {!isVoted && (
                    <div className="flex md:flex-col gap-1.5 items-center">
                      <button
                        onClick={() => shiftUp(idx)}
                        disabled={idx === 0}
                        className="bg-surface2 border border-brand-border hover:bg-surface3 disabled:opacity-20 text-brand-text p-2 rounded-lg cursor-pointer flex items-center justify-center transition-all"
                        title="Pujar de posició"
                      >
                        <ArrowUp size={16} />
                      </button>
                      
                      <select
                        value={idx}
                        onChange={(e) => moveToPosition(idx, parseInt(e.target.value))}
                        className="bg-surface2 border border-brand-border hover:border-brand-accent-glow text-brand-text font-mono font-bold text-center text-xs py-1.5 px-2.5 rounded-lg cursor-pointer focus:outline-none focus:ring-1 focus:ring-brand-accent transition-all min-w-[45px] h-9"
                        title="Canviar lloc directament"
                      >
                        {orderedProjects.map((_, pIdx) => (
                          <option key={pIdx} value={pIdx} className="bg-surface1 text-brand-text font-bold p-1">
                            {pIdx + 1}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={() => shiftDown(idx)}
                        disabled={idx === orderedProjects.length - 1}
                        className="bg-surface2 border border-brand-border hover:bg-surface3 disabled:opacity-20 text-brand-text p-2 rounded-lg cursor-pointer flex items-center justify-center transition-all"
                        title="Baixar de posició"
                      >
                        <ArrowDown size={16} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-4 text-left">
                  <div>
                    <h3 className="text-xl font-bold font-mono text-brand-text">{proj.author_name}</h3>
                    <p className="text-xs text-brand-accent font-semibold italic mt-0.5">"{proj.project_title}"</p>
                    {proj.description && (
                      <p className="text-xs text-brand-text-muted mt-2 max-w-2xl bg-bg1/20 p-2.5 rounded-lg leading-relaxed">
                        {proj.description}
                      </p>
                    )}
                  </div>

                  {/* Portfolio Mosaic Miniatures */}
                  {!(proj as any).photos || (proj as any).photos.length === 0 ? (
                    <p className="text-xs text-brand-text-muted italic">Aquest autor encara no té imatges al mosaic.</p>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                      {(() => {
                        const sortedPhotos = [...((proj as any).photos || [])].sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0));
                        return sortedPhotos.map((photo: ZampaPhoto, pIdx: number) => (
                          <div
                            key={photo.id}
                            className="aspect-[4/3] rounded-lg overflow-hidden border border-brand-border/60 hover:border-brand-accent cursor-zoom-in transition-all relative group"
                            onClick={() => {
                              // Extract sorted full photo list for current project mosaic to carousel in viewer
                              const fullList = sortedPhotos.map((pt: any) => ({
                                url: pt.file_url,
                                fileName: pt.file_name || 'foto.jpg',
                              }));
                              setLightboxPhotos(fullList);
                              setLightboxStartIdx(pIdx);
                              setLightboxUrl(photo.file_url);
                              setLightboxOpen(true);
                            }}
                          >
                            <img
                              src={photo.file_url}
                              alt={photo.file_name || `Photo ${pIdx}`}
                              className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            />
                          </div>
                        ));
                      })()}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          </div>

          {/* Botó desat de vots si no està d'acord amb format d'estat bloc passat */}
          {!isVoted && orderedProjects.length > 0 && (
            <div className="pt-4 flex justify-center">
              <button
                onClick={handleSubmitRating}
                disabled={submittingRating}
                className={`text-white font-bold px-8 py-3.5 rounded-xl cursor-pointer shadow-lg flex items-center gap-2.5 transition-all text-sm uppercase tracking-wider active:scale-95 ${
                  activeTab === 'adult'
                    ? 'bg-brand-accent hover:opacity-90 shadow-brand-accent-glow'
                    : 'bg-pink-600 hover:opacity-90 shadow-pink-500/20'
                }`}
              >
                {submittingRating ? (
                  <span className="loader" />
                ) : (
                  <>
                     <Check size={16} /> Enviar Valoració Zampa
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* 3. ESTAT `CLOSED` o `FINISHED` (Navegació per pestanyes dels resultats) */}
      {(selectedEdition.status === 'closed' || selectedEdition.status === 'finished') && (
        <div className="space-y-6 max-w-7xl mx-auto">
          {selectedTab === 'results_gallery' && (
            <>
              {selectedEdition.status === 'finished' ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-5">
                    <ZampaWinnerCard
                      officialWinnerObj={officialWinnerObj}
                      selectedEdition={selectedEdition}
                      winnerConsensusRank={winnerConsensusRank}
                      userRanks={userRanks}
                      activeTab={activeTab}
                      selectedEditionId={selectedEditionId}
                      lang={lang}
                      onPhotoClick={(photos, startIdx, url) => {
                        const list = photos.map((pt) => ({ url: pt.file_url, fileName: pt.file_name }));
                        setLightboxPhotos(list);
                        setLightboxStartIdx(startIdx);
                        setLightboxUrl(url);
                        setLightboxOpen(true);
                      }}
                    />
                  </div>
                  <div className="lg:col-span-7">
                    <ZampaGallery
                      projects={projects}
                      selectedEditionId={selectedEditionId}
                      activeTab={activeTab}
                      lang={lang}
                      onPhotoClick={(photos, startIdx, url) => {
                        const list = photos.map((pt) => ({ url: pt.file_url, fileName: pt.file_name }));
                        setLightboxPhotos(list);
                        setLightboxStartIdx(startIdx);
                        setLightboxUrl(url);
                        setLightboxOpen(true);
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="max-w-4xl mx-auto">
                  <ZampaGallery
                    projects={projects}
                    selectedEditionId={selectedEditionId}
                    activeTab={activeTab}
                    lang={lang}
                    onPhotoClick={(photos, startIdx, url) => {
                      const list = photos.map((pt) => ({ url: pt.file_url, fileName: pt.file_name }));
                      setLightboxPhotos(list);
                      setLightboxStartIdx(startIdx);
                      setLightboxUrl(url);
                      setLightboxOpen(true);
                    }}
                  />
                </div>
              )}
            </>
          )}

          {selectedTab === 'consensus_rankings' && (
            <>
              {selectedEdition.status === 'finished' ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-5">
                    <ZampaProximityDiana
                      partnerProximityList={partnerProximityList}
                      currentUser={currentUser}
                      lang={lang}
                      officialWinnerObj={officialWinnerObj}
                      onPhotoClick={(photos, startIdx, url) => {
                        const list = photos.map((pt) => ({ url: pt.file_url, fileName: pt.file_name }));
                        setLightboxPhotos(list);
                        setLightboxStartIdx(startIdx);
                        setLightboxUrl(url);
                        setLightboxOpen(true);
                      }}
                    />
                  </div>
                  <div className="lg:col-span-7 space-y-6">
                    <ZampaFinishedTravessa
                      projects={projects}
                      userRanks={userRanks}
                      activeTab={activeTab}
                      selectedEditionId={selectedEditionId}
                      currentUser={currentUser}
                      lang={lang}
                      sectionCSort={sectionCSort}
                      setSectionCSort={setSectionCSort}
                      officialWinnerObj={officialWinnerObj}
                      onPhotoClick={(photos, startIdx, url) => {
                        const list = photos.map((pt) => ({ url: pt.file_url, fileName: pt.file_name }));
                        setLightboxPhotos(list);
                        setLightboxStartIdx(startIdx);
                        setLightboxUrl(url);
                        setLightboxOpen(true);
                      }}
                    />
                    <ZampaConsensusAffinities
                      projects={projects}
                      userRanks={userRanks}
                      activeTab={activeTab}
                      selectedEditionId={selectedEditionId}
                      users={users}
                      currentUser={currentUser}
                      lang={lang}
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-7">
                    <ZampaConsensusTravessa
                      projects={projects}
                      userRanks={userRanks}
                      activeTab={activeTab}
                      selectedEditionId={selectedEditionId}
                      currentUser={currentUser}
                      lang={lang}
                      onPhotoClick={(photos, startIdx, url) => {
                        setLightboxPhotos(photos);
                        setLightboxStartIdx(startIdx);
                        setLightboxUrl(url);
                        setLightboxOpen(true);
                      }}
                    />
                  </div>
                  <div className="lg:col-span-5">
                    <ZampaConsensusAffinities
                      projects={projects}
                      userRanks={userRanks}
                      activeTab={activeTab}
                      selectedEditionId={selectedEditionId}
                      users={users}
                      currentUser={currentUser}
                      lang={lang}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* LIGHTBOX DE PANTALLA COMPLETA */}
      {lightboxOpen && (
        <FullscreenViewer
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          url={lightboxUrl}
          photosList={lightboxPhotos}
          startIndex={lightboxStartIdx}
          showDownload
        />
      )}

      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        onConfirm={() => {
          confirmConfig.onConfirm();
          closeConfirm();
        }}
        onCancel={closeConfirm}
        confirmText={confirmConfig.confirmText}
        cancelText={confirmConfig.cancelText}
      />
    </div>
  );
}
