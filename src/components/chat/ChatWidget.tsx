import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import AIChat from './AIChat';
import { MessageSquare, X } from 'lucide-react';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Chat Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        {isOpen ? (
          <div className="mb-4">
            <div className="flex justify-end mb-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0 bg-background/80 backdrop-blur-sm border border-border rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <AIChat 
              onClose={() => setIsOpen(false)}
              context="general"
            />
          </div>
        ) : (
          <Button
            onClick={() => setIsOpen(true)}
            className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
            size="lg"
          >
            <MessageSquare className="h-6 w-6" />
          </Button>
        )}
      </div>

      {/* Chat Hint */}
      {!isOpen && (
        <div className="fixed bottom-24 right-6 z-40">
          <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg max-w-xs animate-bounce">
            <p className="text-sm font-medium mb-1">Need help?</p>
            <p className="text-xs text-muted-foreground">
              Chat with our AI assistant for instant support!
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;