import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BattlegroundProvider, useBG } from './context/BattlegroundContext';
import { initTheme } from './utils/theme';
import { loadSharedConfig } from './services/sharing';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import BgHeader from './components/BgHeader';
import LayerBar from './components/LayerBar';
import EditBar from './components/EditBar';
import MapView from './components/MapView';
import './App.css';

function SharedConfigLoader() {
  const { state, dispatch } = useBG();
  const [banner, setBanner] = useState<{ bgName: string; shareCode: string } | null>(null);

  useEffect(() => {
    if (state.loading) return;
    const params = new URLSearchParams(window.location.search);
    const shareCode = params.get('share');
    if (!shareCode) return;

    loadSharedConfig(shareCode).then((result) => {
      if (!result) {
        setBanner(null);
        alert('Shared config not found.');
        return;
      }
      setBanner({ bgName: result.title, shareCode });
      dispatch({ type: 'SELECT_BG', id: result.bgId });
    });
  }, [state.loading, dispatch]);

  const handleImport = async () => {
    if (!banner) return;
    const result = await loadSharedConfig(banner.shareCode);
    if (!result) return;
    dispatch({ type: 'IMPORT_DATA', bgId: result.bgId, data: result.data });
    setBanner(null);
    // Clean up URL
    window.history.replaceState({}, '', window.location.pathname);
  };

  const handleDismiss = () => {
    setBanner(null);
    window.history.replaceState({}, '', window.location.pathname);
  };

  if (!banner) return null;

  return (
    <div className="px-3.5 py-2 bg-[var(--badge-bg)] border-b border-[var(--badge-border)] flex gap-3 items-center shrink-0">
      <span className="text-sm" style={{ color: 'var(--badge-text)' }}>
        Viewing shared config for <strong>{banner.bgName}</strong>
      </span>
      <button
        className="px-2.5 py-1 rounded text-xs font-semibold cursor-pointer"
        style={{ background: 'var(--accent-gold)', color: '#000' }}
        onClick={() => void handleImport()}
      >
        Import to My Configs
      </button>
      <button
        className="px-2.5 py-1 rounded border text-xs cursor-pointer"
        style={{ borderColor: 'var(--border-default)', color: 'var(--text-muted)' }}
        onClick={handleDismiss}
      >
        Dismiss
      </button>
    </div>
  );
}

function AppContent() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [tipsVisible, setTipsVisible] = useState(true);

  return (
    <>
      <Header />
      <SharedConfigLoader />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar visible={sidebarVisible} />
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <BgHeader />
          <LayerBar />
          <EditBar />
          <MapView
            sidebarVisible={sidebarVisible}
            tipsVisible={tipsVisible}
            onToggleSidebar={() => setSidebarVisible(v => !v)}
            onToggleTips={() => setTipsVisible(v => !v)}
          />
        </div>
      </div>
    </>
  );
}

function AuthenticatedApp() {
  const { user } = useAuth();

  return (
    <BattlegroundProvider userId={user?.id}>
      <AppContent />
    </BattlegroundProvider>
  );
}

export default function App() {
  useEffect(() => { initTheme(); }, []);

  return (
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
  );
}
