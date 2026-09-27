/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { DapodikProvider, useDapodik } from './context/DapodikContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { SarprasView } from './components/SarprasView';
import { PesertaDidikView } from './components/PesertaDidikView';
import { GtkView } from './components/GtkView';
import { RombelView } from './components/RombelView';
import { ValidasiView } from './components/ValidasiView';
import { SinkronisasiView } from './components/SinkronisasiView';
import { SekolahProfileModal } from './components/SekolahProfileModal';
import { SptjmModal } from './components/SptjmModal';
import { ExportImportModal } from './components/ExportImportModal';
import { LoginView } from './components/LoginView';

const AppContent: React.FC = () => {
  const { activeTab, currentUser } = useDapodik();

  // If not logged in, display the official login screen
  if (!currentUser) {
    return <LoginView />;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <Header />

      {/* Main Layout Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* View Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'sarpras' && <SarprasView />}
          {activeTab === 'peserta-didik' && <PesertaDidikView />}
          {activeTab === 'gtk' && <GtkView />}
          {activeTab === 'rombel' && <RombelView />}
          {activeTab === 'validasi' && <ValidasiView />}
          {activeTab === 'sinkronisasi' && <SinkronisasiView />}
        </main>
      </div>

      {/* Modals */}
      <SekolahProfileModal />
      <SptjmModal />
      <ExportImportModal />
    </div>
  );
};

export default function App() {
  return (
    <DapodikProvider>
      <AppContent />
    </DapodikProvider>
  );
}
