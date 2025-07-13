import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Smile, MoreVertical, Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface Message {
  id: string;
  sender: string;
  senderAvatar: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'file';
}

interface ChatUser {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline';
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeUsers] = useState<ChatUser[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150',
      status: 'online'
    },
    {
      id: '2',
      name: 'Michael Chen',
      avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150',
      status: 'online'
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      status: 'offline'
    }
  ]);

  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize with some sample messages
    const sampleMessages: Message[] = [
      {
        id: '1',
        sender: 'Sarah Johnson',
        senderAvatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150',
        content: 'Hey everyone! I just published a new article about web development trends. Would love to get your feedback!',
        timestamp: new Date(Date.now() - 60000),
        type: 'text'
      },
      {
        id: '2',
        sender: 'Michael Chen',
        senderAvatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150',
        content: 'Congratulations Sarah! I\'ll check it out. Also, I\'m working on a design systems piece - anyone interested in collaborating?',
        timestamp: new Date(Date.now() - 30000),
        type: 'text'
      }
    ];
    setMessages(sampleMessages);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: user.name,
      senderAvatar: user.avatar || '',
      content: newMessage.trim(),
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="h-full flex bg-white rounded-lg shadow-sm border overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Team Chat</h2>
            <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
          <p className="text-sm text-gray-600">Collaborate with other authors</p>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">
                Active Members ({activeUsers.filter(u => u.status === 'online').length})
              </span>
            </div>
            
            <div className="space-y-3">
              {activeUsers.map((chatUser) => (
                <div key={chatUser.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="relative">
                    <img
                      src={chatUser.avatar}
                      alt={chatUser.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                      chatUser.status === 'online' ? 'bg-green-400' : 'bg-gray-400'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{chatUser.name}</p>
                    <p className={`text-xs ${
                      chatUser.status === 'online' ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {chatUser.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${
              message.sender === user?.name ? 'flex-row-reverse' : ''
            }`}>
              <img
                src={message.senderAvatar}
                alt={message.sender}
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
              />
              <div className={`flex flex-col max-w-xs lg:max-w-md ${
                message.sender === user?.name ? 'items-end' : 'items-start'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-gray-700">{message.sender}</span>
                  <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                </div>
                <div className={`rounded-lg px-4 py-2 ${
                  message.sender === user?.name
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="border-t border-gray-200 p-4">
          <form onSubmit={handleSendMessage} className="flex items-end gap-3">
            <div className="flex-1">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
                placeholder="Type your message..."
                rows={1}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Paperclip className="h-5 w-5" />
              </button>
              <button
                type="button"
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Smile className="h-5 w-5" />
              </button>
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}