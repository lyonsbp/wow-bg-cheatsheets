import { useState } from 'react';
import { BattlegroundProvider } from './context/BattlegroundContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import BgHeader from './components/BgHeader';
import LayerBar from './components/LayerBar';
import EditBar from './components/EditBar';
import MapView from './components/MapView';
import './App.css';

function AppContent() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [tipsVisible, setTipsVisible] = useState(true);

  return (
    <>
      <Header />
      <div className="app">
        <Sidebar visible={sidebarVisible} />
        <div className="main">
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

export default function App() {
  return (
    <BattlegroundProvider>
      <AppContent />
    </BattlegroundProvider>
  );
}
