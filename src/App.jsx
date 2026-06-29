import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://wudzcldsutonxlmgkbgb.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1ZHpjbGRzdXRvbnhsbWdrYmdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI2NTkyNjMsImV4cCI6MjA5ODIzNTI2M30.jR303Q8GKvCJHd9Na0Jtd3b1cXCHf9xIj8KS3eRMvNs";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── asset constants (same as original — omitted here for brevity, paste from original) ───
// ASSET_LOGO_NAV, ASSET_LOGO_LARGE, ASSET_FAVICON_32, ASSET_FAVICON_64,
// ASSET_BLOT_BLACK_SMALL, ASSET_SPLASH_FRAMES — keep exactly as in the original file.

// ─── everything above ReaderPage is UNCHANGED from the original ─────────────

// ============================================================================
// ReaderPage — fixed jump-to-page
// ============================================================================
//
// THREE BUGS FIXED:
//
// 1. handleJumpFromComment used setReaderState({manga, chapterIdx, jumpToPage})
//    which REPLACED the full state object, losing any other fields and — more
//    critically — caused liveReaderState to get a fresh object reference on
//    every library poll, which made the useEffect dependency on `jumpToPage`
//    fire at the wrong time.
//    FIX: jump is tracked in a LOCAL state atom (jumpRequest) inside ReaderPage
//    so it is fully isolated from readerState / liveReaderState churn.
//
// 2. pageRefs.current[idx] existed in the DOM but the LazyImg IntersectionObserver
//    had never fired (image not yet loaded) because the element was off-screen.
//    scrollIntoView at 80ms was a no-op on an unloaded image whose container
//    had height:0 (the skeleton had the height but the scroll target was the
//    LazyImg wrapper div which collapsed after load).
//    FIX: give every page wrapper a min-height equal to the expected aspect ratio,
//    scroll immediately (no wait), then set arrivalKey after a short settle delay.
//
// 3. The quote-FAB was hidden while the drawer was open, making it impossible to
//    quote a second page without closing and reopening the drawer.
//    FIX: always render FAB; just change its appearance while drawer is open.

function ReaderPage({ readerState, setReaderState, toast, setView, onUpdateChapterComments, user }) {
  const { manga, chapterIdx, openComments } = readerState;
  const chapter = manga.chapters[chapterIdx];
  const pages = chapter.pages;

  const [progress, setProgress] = useState(0);
  const [showNav, setShowNav] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [maxWidth, setMaxWidth] = useState(800);
  const [bgColor, setBgColor] = useState("#0A0A0A");
  const containerRef = useRef();
  const pageRefs = useRef([]);
  const hideNavTimer = useRef();
  const [currentPage, setCurrentPage] = useState(0);
  const [showComments, setShowComments] = useState(!!openComments);
  const [pendingQuote, setPendingQuote] = useState(null);

  // ── FIX 1: jump lives here, not in readerState ──────────────────────────
  // { pageIndex: number, token: number } — token changes on every jump so the
  // effect always fires even when jumping to the same page twice in a row.
  const [jumpRequest, setJumpRequest] = useState(null);

  // ── FIX 2: stable arrival overlay key ────────────────────────────────────
  const [arrivalKey, setArrivalKey] = useState(null);

  // track container width for aspect-ratio height estimation
  const [containerWidth, setContainerWidth] = useState(800);
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(([e]) => setContainerWidth(e.contentRect.width));
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = el;
      setProgress(Math.min(100, (scrollTop / (scrollHeight - clientHeight)) * 100));
      // estimate current page from scroll position
      const pageHeight = (scrollHeight - 60) / pages.length;
      setCurrentPage(Math.min(pages.length - 1, Math.floor(scrollTop / pageHeight)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [chapter, pages.length]);

  const resetHideTimer = () => {
    setShowNav(true);
    clearTimeout(hideNavTimer.current);
    hideNavTimer.current = setTimeout(() => setShowNav(false), 3500);
  };
  useEffect(() => { resetHideTimer(); return () => clearTimeout(hideNavTimer.current); }, []);

  const goChapter = (delta) => {
    const nextIdx = chapterIdx + delta;
    if (nextIdx < 0 || nextIdx >= manga.chapters.length) {
      toast(delta > 0 ? "You've finished all chapters" : "This is the first chapter", "warn");
      return;
    }
    setReaderState({ manga, chapterIdx: nextIdx });
    containerRef.current?.scrollTo(0, 0);
  };

  const captureQuote = () => {
    if (!user) { toast("Sign in to quote a page", "warn"); return; }
    const page = pages[currentPage];
    setPendingQuote({ pageIndex: currentPage, pageId: page.id, thumb: page.image });
    setShowComments(true);
    toast(`Page ${currentPage + 1} tagged`, "success");
  };

  // ── FIX 1 cont: jump is triggered by setting jumpRequest ─────────────────
  const handleJumpFromComment = useCallback((pageIndex) => {
    setShowComments(false);
    // small delay so the drawer finish-close animation doesn't fight the scroll
    setTimeout(() => {
      setJumpRequest({ pageIndex, token: Date.now() });
    }, 220);
  }, []);

  // ── FIX 2 cont: effect watches jumpRequest, not readerState ──────────────
  useEffect(() => {
    if (jumpRequest === null) return;
    const { pageIndex } = jumpRequest;
    const target = pageRefs.current[pageIndex];
    if (!target) return;

    // Step 1: scroll the target into view immediately — the container already
    // has the correct height from the aspect-ratio min-height on each wrapper,
    // so scrollIntoView lands on the right spot even before the image loads.
    target.scrollIntoView({ block: "center", behavior: "smooth" });

    // Step 2: show the arrival splash after the scroll settles (~350ms for
    // smooth scroll) so it visually "lands" on the page, not on empty space.
    const t = setTimeout(() => {
      setArrivalKey(`${pageIndex}-${Date.now()}`);
    }, 380);

    return () => clearTimeout(t);
  }, [jumpRequest]);

  return (
    <div style={{ position: "fixed", inset: 0, background: bgColor, display: "flex", flexDirection: "column", zIndex: 500 }}>
      {/* progress bar */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "rgba(244,242,237,0.1)", zIndex: 10 }}>
        <div style={{ height: "100%", width: `${progress}%`, background: "var(--paper)", transition: "width 0.1s" }} />
      </div>

      {/* top nav */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 9, background: "rgba(10,10,10,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--line)", padding: "10px 16px", display: "flex", alignItems: "center", gap: 10, transform: showNav ? "translateY(0)" : "translateY(-100%)", transition: "transform 0.3s ease" }}>
        <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setView("detail")}>←</button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="brush" style={{ fontSize: 13, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{manga.title}</div>
          <div style={{ fontSize: 11, color: "var(--paper-faint)" }}>{chapter.title} · Page {currentPage + 1}/{pages.length}</div>
        </div>
        <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setShowComments(true)}>💬</button>
        <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setShowSettings(!showSettings)}>⚙</button>
      </div>

      {showSettings && (
        <div style={{ position: "absolute", top: 54, right: 12, zIndex: 200, background: "var(--ink-raised)", border: "1px solid var(--line-strong)", padding: 16, minWidth: 220, animation: "fadeUp 0.2s ease" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--paper-faint)", marginBottom: 10, letterSpacing: "0.05em", textTransform: "uppercase" }}>Reader Settings</div>
          <label style={{ fontSize: 13, display: "block", marginBottom: 6 }}>Max Width: {maxWidth}px</label>
          <input type="range" min={400} max={1200} step={50} value={maxWidth} onChange={e => setMaxWidth(+e.target.value)} style={{ width: "100%", marginBottom: 12, accentColor: "var(--paper)" }} />
          <label style={{ fontSize: 13, display: "block", marginBottom: 6 }}>Background</label>
          <div style={{ display: "flex", gap: 6 }}>
            {["#0A0A0A", "#1a1a1a", "#f5f5f0", "#e8e0d0"].map(c => (
              <button key={c} onClick={() => setBgColor(c)} style={{ width: 28, height: 28, background: c, border: bgColor === c ? "2px solid var(--paper)" : "1px solid var(--line-strong)", cursor: "pointer" }} />
            ))}
          </div>
        </div>
      )}

      {/* scrollable pages */}
      <div ref={containerRef} onMouseMove={resetHideTimer} onClick={resetHideTimer}
        style={{ flex: 1, overflowY: "auto", overflowX: "hidden", paddingTop: 48 }}>
        <div style={{ maxWidth, margin: "0 auto" }}>
          {pages.map((page, i) => {
            // ── FIX 2 cont: each wrapper has a min-height so scrollIntoView
            // lands on a visible element even before the image has loaded.
            // aspect ratio 2:3 → height = width * 1.5
            const estimatedHeight = Math.min(maxWidth, containerWidth) * 1.5;
            const isArriving = arrivalKey && arrivalKey.startsWith(`${i}-`);
            return (
              <div
                key={page.id}
                ref={el => pageRefs.current[i] = el}
                style={{ position: "relative", minHeight: estimatedHeight }}
              >
                <LazyImg src={page.image} alt={`Page ${i + 1}`} style={{ width: "100%", aspectRatio: "2/3", display: "block" }} />
                {isArriving && (
                  <SplashArrivalOverlay onDone={() => setArrivalKey(null)} />
                )}
              </div>
            );
          })}

          <div style={{ padding: "40px 20px", textAlign: "center", borderTop: "1px solid var(--line)" }}>
            <div className="brush" style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>End of {chapter.title}</div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <button className="btn btn-ghost" onClick={() => goChapter(-1)}>← Prev Chapter</button>
              <button className="btn btn-primary" onClick={() => goChapter(1)}>Next Chapter →</button>
            </div>
          </div>
        </div>
      </div>

      {/* bottom nav */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(10,10,10,0.92)", backdropFilter: "blur(12px)", borderTop: "1px solid var(--line)", padding: "10px 16px", display: "flex", alignItems: "center", gap: 10, transform: showNav ? "translateY(0)" : "translateY(100%)", transition: "transform 0.3s ease" }}>
        <button className="btn btn-ghost btn-sm" onClick={() => goChapter(-1)}>← Prev</button>
        <div style={{ flex: 1, textAlign: "center", fontSize: 12, color: "var(--paper-faint)" }}>Ch.{chapter.number} · {Math.round(progress)}%</div>
        <button className="btn btn-primary btn-sm" onClick={() => goChapter(1)}>Next →</button>
      </div>

      {/* page dot nav */}
      <div className="panel-nav" style={{ opacity: showNav ? 1 : 0.15 }}>
        {pages.slice(0, 20).map((_, i) => {
          const approxPage = Math.floor((progress / 100) * pages.length);
          return (
            <div key={i} className={`panel-dot ${approxPage === i ? "active" : ""}`}
              onClick={() => {
                const ratio = i / pages.length;
                const el = containerRef.current;
                if (el) el.scrollTo({ top: (el.scrollHeight - el.clientHeight) * ratio, behavior: "smooth" });
              }} />
          );
        })}
      </div>

      {/* ── FIX 3: FAB always present, just styled differently when drawer open */}
      <button
        className="quote-fab"
        style={{
          opacity: showNav ? 1 : 0,
          transform: showNav ? "translateY(0)" : "translateY(8px)",
          // visually distinguish when comments are already open
          background: showComments ? "var(--ink-raised)" : "var(--paper)",
          color: showComments ? "var(--paper)" : "var(--ink)",
          border: showComments ? "1px solid var(--line-strong)" : "none",
        }}
        onClick={captureQuote}
      >
        ✎ Quote page {currentPage + 1}
      </button>

      {/* comments drawer */}
      {showComments && (
        <div className="drawer-overlay" onClick={e => e.target === e.currentTarget && setShowComments(false)}>
          <div className="drawer">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <div className="brush" style={{ fontSize: 18, fontWeight: 800 }}>Discussion</div>
              <button className="btn btn-ghost btn-sm btn-icon" onClick={() => setShowComments(false)}>✕</button>
            </div>
            <div style={{ fontSize: 12, color: "var(--paper-faint)", marginBottom: 18 }}>{chapter.title}</div>
            <ChapterComments
              chapter={chapter}
              mangaId={manga.id}
              onUpdateComments={onUpdateChapterComments}
              user={user}
              toast={toast}
              pendingQuote={pendingQuote}
              onConsumeQuote={() => setPendingQuote(null)}
              // ── FIX 1 cont: jump goes through local jumpRequest, not readerState
              onJumpToPage={handleJumpFromComment}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// App — remove jumpToPage from readerState entirely
// ============================================================================
//
// The original App passed jumpToPage inside readerState, which meant every
// library re-poll (fetchLibrary) created a new `liveReaderState` object and
// the useEffect in ReaderPage fired spuriously.
//
// Now readerState only carries { manga, chapterIdx, openComments }.
// Jumping is handled entirely inside ReaderPage via jumpRequest state.

export default function App() {
  const [library, setLibrary] = useState([]);
  const [libraryLoading, setLibraryLoading] = useState(true);
  const [view, setView] = useState("home");
  const [currentMangaId, setCurrentMangaId] = useState(null);
  // readerState no longer carries jumpToPage
  const [readerState, setReaderState] = useState(null);
  const [user, setUser] = useState(null);
  const [bookmarks, setBookmarksState] = useState([]);
  const [showAuth, setShowAuth] = useState(false);
  const [booting, setBooting] = useState(true);
  const { toasts, show: toast } = useToast();

  const loadProfile = useCallback(async (authUser) => {
    if (!authUser) { setUser(null); setBookmarksState([]); return; }
    try {
      const { data, error } = await supabase.from("profiles").select("username, role").eq("id", authUser.id).single();
      if (error) { setUser({ id: authUser.id, username: authUser.email, isAdmin: false }); return; }
      setUser({ id: authUser.id, username: data.username, isAdmin: data.role === "admin" });
      const { data: bm } = await supabase.from("bookmarks").select("series_id").eq("user_id", authUser.id);
      setBookmarksState((bm || []).map(b => b.series_id));
    } catch {
      setUser({ id: authUser.id, username: authUser.email, isAdmin: false });
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => loadProfile(data.session?.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      loadProfile(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, [loadProfile]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setBookmarksState([]);
  }, []);

  const setBookmarks = useCallback((updater) => {
    if (!user) { toast("Sign in to bookmark series", "warn"); return; }
    setBookmarksState(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      const added = next.filter(id => !prev.includes(id));
      const removed = prev.filter(id => !next.includes(id));
      added.forEach(seriesId => supabase.from("bookmarks").insert({ user_id: user.id, series_id: seriesId }).then());
      removed.forEach(seriesId => supabase.from("bookmarks").delete().eq("user_id", user.id).eq("series_id", seriesId).then());
      return next;
    });
  }, [user, toast]);

  const fetchLibrary = useCallback(async () => {
    setLibraryLoading(true);
    const { data, error } = await supabase
      .from("series")
      .select(`id, title, author, description, type, status, genres, cover_url, views, likes, dislikes, rating,
        chapters (id, number, title,
          pages ( id, image_url, page_order ),
          comments ( id, text, likes, created_at, quote_page_id, user_id )
        )`)
      .order("created_at", { ascending: false });

    if (error) { toast("Could not load the library", "error"); setLibraryLoading(false); return; }

    const shaped = (data || []).map(series => ({
      ...series,
      cover: series.cover_url,
      chapters: (series.chapters || [])
        .sort((a, b) => a.number - b.number)
        .map(ch => ({
          ...ch,
          date: "",
          pages: (ch.pages || []).sort((a, b) => a.page_order - b.page_order).map(p => ({ id: p.id, image: p.image_url, order: p.page_order })),
          comments: (ch.comments || [])
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .map(c => {
              const quotedPage = c.quote_page_id ? (ch.pages || []).find(p => p.id === c.quote_page_id) : null;
              return {
                id: c.id,
                user: c.profiles?.username || "unknown",
                text: c.text,
                likes: c.likes,
                date: new Date(c.created_at).toLocaleDateString(),
                avatar: (c.profiles?.username || "??").slice(0, 2).toUpperCase(),
                quote: quotedPage ? { pageIndex: quotedPage.order, thumb: quotedPage.image_url } : null,
              };
            }),
        })),
    }));
    setLibrary(shaped);
    setLibraryLoading(false);
  }, [toast]);

  useEffect(() => { fetchLibrary(); }, [fetchLibrary]);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = GLOBAL_CSS;
    document.head.appendChild(style);
    const t = setTimeout(() => setBooting(false), 1100);
    return () => { document.head.removeChild(style); clearTimeout(t); };
  }, []);

  const currentManga = useMemo(() => library.find(m => m.id === currentMangaId) || null, [library, currentMangaId]);

  // liveReaderState keeps manga reference fresh but NO LONGER carries jumpToPage
  const liveReaderState = useMemo(() => {
    if (!readerState) return null;
    const freshManga = library.find(m => m.id === readerState.manga.id) || readerState.manga;
    return { ...readerState, manga: freshManga };
  }, [readerState, library]);

  const updateChapterComments = useCallback(async (mangaId, chapterId, _newComments, meta) => {
    if (meta?.type === "delete") {
      await supabase.from("comments").delete().eq("id", meta.commentId);
    } else if (meta?.type === "insert") {
      await supabase.from("comments").insert({
        chapter_id: chapterId,
        user_id: user.id,
        text: meta.text,
        quote_page_id: meta.quotePageId || null,
      });
    }
    fetchLibrary();
  }, [user, fetchLibrary]);

  const setCurrentManga = (m) => setCurrentMangaId(m?.id ?? null);

  if (booting) return <FullscreenInkLoader />;

  if (view === "reader" && liveReaderState) {
    return (
      <>
        <ReaderPage
          readerState={liveReaderState}
          setReaderState={setReaderState}
          toast={toast}
          setView={setView}
          onUpdateChapterComments={updateChapterComments}
          user={user}
        />
        <ToastContainer toasts={toasts} />
      </>
    );
  }

  const navItems = [
    { id: "home", icon: "⌂", label: "Browse" },
    { id: "profile", icon: "☷", label: "Profile" },
    ...(user?.isAdmin ? [{ id: "admin", icon: "✒", label: "Admin" }] : []),
  ];

  return (
    <div style={{ minHeight: "100vh" }}>
      <nav className="nav">
        <img src={ASSET_LOGO_NAV} alt="InkVault" onClick={() => setView("home")} style={{ height: 24, width: "auto", display: "block", filter: "invert(1) brightness(1.4)", cursor: "pointer" }} />
        <div style={{ flex: 1 }} />
        {user ? (
          <div className="avatar" style={{ width: 32, height: 32, fontSize: 11, cursor: "pointer", border: user.isAdmin ? "1.5px solid var(--seal)" : "1px solid var(--line-strong)" }} onClick={() => setView("profile")}>
            {user.username.slice(0, 2).toUpperCase()}
          </div>
        ) : (
          <button className="btn btn-primary btn-sm" onClick={() => setShowAuth(true)}>Sign In</button>
        )}
      </nav>
      <main className="main-content">
        {view === "home" && <HomePage library={library} libraryLoading={libraryLoading} bookmarks={bookmarks} setBookmarks={setBookmarks} toast={toast} setView={setView} setCurrentManga={setCurrentManga} />}
        {view === "detail" && currentManga && <DetailPage manga={currentManga} setManga={() => {}} bookmarks={bookmarks} setBookmarks={setBookmarks} toast={toast} setView={setView} setReaderState={setReaderState} user={user} />}
        {view === "profile" && (user
          ? <ProfilePage user={user} bookmarks={bookmarks} toast={toast} signOut={signOut} setView={setView} />
          : <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div className="brush" style={{ fontSize: 36, marginBottom: 14 }}>人</div>
            <div className="brush" style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Not signed in</div>
            <button className="btn btn-primary" onClick={() => setShowAuth(true)}>Sign In / Register</button>
          </div>)}
        {view === "admin" && (user?.isAdmin
          ? <AdminPanel refetchLibrary={fetchLibrary} user={user} toast={toast} />
          : <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div className="brush" style={{ fontSize: 36, marginBottom: 14 }}>鎖</div>
            <div className="brush" style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>Admin access required</div>
            {user
              ? <button className="btn btn-seal" onClick={() => setView("profile")}>Get admin access →</button>
              : <button className="btn btn-primary" onClick={() => setShowAuth(true)}>Sign In</button>}
          </div>)}
      </main>
      <div className="bottom-nav">
        {navItems.map(n => (
          <button key={n.id} className={`bottom-nav-item ${view === n.id ? "active" : ""}`} onClick={() => setView(n.id)}>
            <span className="bottom-nav-icon">{n.icon}</span>{n.label}
          </button>
        ))}
        {!user && <button className="bottom-nav-item" onClick={() => setShowAuth(true)}><span className="bottom-nav-icon">⚿</span>Sign In</button>}
      </div>
      {showAuth && <AuthModal toast={toast} onClose={() => setShowAuth(false)} onLogin={async (authUser) => { await loadProfile(authUser); toast("Welcome back", "success"); }} />}
      <ToastContainer toasts={toasts} />
    </div>
  );
}