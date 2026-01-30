import { useState } from 'react';
import { TabType } from '@/types';
import { Navigation } from '@/components/Navigation';
import { ChatAssistant } from '@/components/chat/ChatAssistant';
import { BudgetManager } from '@/components/budget/BudgetManager';
import { SchemeLookup } from '@/components/schemes/SchemeLookup';

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>('chat');

  const handleNavigateToChat = (query: string) => {
    setActiveTab('chat');
    // In a real implementation, we'd pass this query to the chat
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="pb-8">
        {activeTab === 'chat' && (
          <div className="container-app">
            <ChatAssistant />
          </div>
        )}
        
        {activeTab === 'budget' && (
          <BudgetManager />
        )}
        
        {activeTab === 'schemes' && (
          <SchemeLookup onNavigateToChat={handleNavigateToChat} />
        )}
      </main>
    </div>
  );
};

export default Index;
