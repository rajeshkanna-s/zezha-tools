import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type Role = 'user' | 'assistant';
export type ResponseSource = 'openai' | 'gemini' | 'nvidia' | 'rule' | 'error';

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: Date;
  source?: ResponseSource;
}

export const useChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hey there! 👋 I\'m Repso, your AI assistant for ReportsIQ. I can help you find and use any of our 250+ business tools. What are you looking for today?',
      timestamp: new Date(),
      source: 'rule'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleChat = () => setIsOpen(prev => !prev);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const apiMessages = messages.concat(userMessage).map(m => ({
        role: m.role,
        content: m.content
      }));

      // 15-second timeout so UI never hangs forever
      const invokePromise = supabase.functions.invoke('chat', {
        body: { messages: apiMessages }
      });
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), 15000)
      );
      const { data, error } = await Promise.race([invokePromise, timeoutPromise]) as any;

      // Even if error, data might contain a rule-based fallback response
      const responseText = data?.text || (error ? null : '');
      const responseSource: ResponseSource = data?.source || 'rule';

      if (!responseText && error) throw error;

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText || "I'm here to help! Ask me about any of our 250+ business tools. 😊",
        timestamp: new Date(),
        source: responseSource
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Sorry, I'm having trouble connecting right now. Please try again in a moment! 😊",
        timestamp: new Date(),
        source: 'error'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    isOpen,
    toggleChat,
    sendMessage
  };
};
