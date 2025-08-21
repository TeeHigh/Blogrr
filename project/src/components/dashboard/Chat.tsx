import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Smile, MoreVertical, Users, Plus, Search, Hash, MessageCircle } from 'lucide-react';
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

interface Chat {
  id: string;
  name: string;
  type: 'direct' | 'group';
  participants: ChatUser[];
  lastMessage?: Message;
  unreadCount: number;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [chatType, setChatType] = useState<'direct' | 'group'>('direct');
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  
  const [chats] = useState<Chat[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      type: 'direct',
      participants: [
        {
          id: '1',
          name: 'Sarah Johnson',
          avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150',
          status: 'online'
        }
      ],
      unreadCount: 2
    },
    {
      id: '2',
      name: 'Tech Writers Group',
      type: 'group',
      participants: [
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
      ],
      unreadCount: 0
    },
    {
      id: '3',
      name: 'Michael Chen',
      type: 'direct',
      participants: [
        {
          id: '2',
          name: 'Michael Chen',
          avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150',
          status: 'online'
        }
      ],
      unreadCount: 0
    },
    {
      id: '4',
      name: 'Design Collaboration',
      type: 'group',
      participants: [
        {
          id: '2',
          name: 'Michael Chen',
          avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150',
          status: 'online'
        },
        {
          id: '4',
          name: 'Alex Thompson',
          avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150',
          status: 'offline'
        }
      ],
      unreadCount: 1
    }
  ]);

  const [availableUsers] = useState<ChatUser[]>([
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
    },
    {
      id: '4',
      name: 'Alex Thompson',
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150',
      status: 'offline'
    }
  ]);

  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize with sample messages for the first chat
    if (activeChat === '1') {
      const sampleMessages: Message[] = [
        {
          id: '1',
          sender: 'Sarah Johnson',
          senderAvatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150',
          content: 'Hey! I saw your latest article about React hooks. Really insightful!',
          timestamp: new Date(Date.now() - 120000),
          type: 'text'
        },
        {
          id: '2',
          sender: 'Sarah Johnson',
          senderAvatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150',
          content: 'Would you be interested in collaborating on a series about modern web development?',
          timestamp: new Date(Date.now() - 60000),
          type: 'text'
        }
      ];
      setMessages(sampleMessages);
    } else if (activeChat === '2') {
      const groupMessages: Message[] = [
        {
          id: '1',
          sender: 'Michael Chen',
          senderAvatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150',
          content: 'Hey everyone! I just published a new design systems article. Would love your feedback!',
          timestamp: new Date(Date.now() - 180000),
          type: 'text'
        },
        {
          id: '2',
          sender: 'Emily Rodriguez',
          senderAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
          content: 'Great work Michael! The component library examples are really helpful.',
          timestamp: new Date(Date.now() - 90000),
          type: 'text'
        }
      ];
      setMessages(groupMessages);
    } else {
      setMessages([]);
    }
  }, [activeChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !activeChat) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: user.fullname,
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

  const getCurrentChat = () => {
    return chats.find(chat => chat.id === activeChat);
  };

  const directChats = chats.filter(chat => chat.type === 'direct');
  const groupChats = chats.filter(chat => chat.type === 'group');

  return (
    <div className="h-full flex bg-white rounded-lg shadow-sm border overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
            <button 
              onClick={() => setShowNewChatModal(true)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Direct Messages */}
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Direct Messages
            </h3>
            <div className="space-y-1">
              {directChats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setActiveChat(chat.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                    activeChat === chat.id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="relative">
                    <img
                      src={chat.participants[0]?.avatar}
                      alt={chat.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                      chat.participants[0]?.status === 'online' ? 'bg-green-400' : 'bg-gray-400'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900 truncate">{chat.name}</p>
                      {chat.unreadCount > 0 && (
                        <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {chat.lastMessage?.content || 'Start a conversation...'}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Group Chats */}
          <div className="p-4 border-t border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
              <Hash className="h-4 w-4" />
              Group Chats
            </h3>
            <div className="space-y-1">
              {groupChats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setActiveChat(chat.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                    activeChat === chat.id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Hash className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900 truncate">{chat.name}</p>
                      {chat.unreadCount > 0 && (
                        <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {chat.participants.length} members
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getCurrentChat()?.type === 'direct' ? (
                    <div className="relative">
                      <img
                        src={getCurrentChat()?.participants[0]?.avatar}
                        alt={getCurrentChat()?.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                        getCurrentChat()?.participants[0]?.status === 'online' ? 'bg-green-400' : 'bg-gray-400'
                      }`} />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Hash className="h-5 w-5 text-white" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900">{getCurrentChat()?.name}</h3>
                    <p className="text-sm text-gray-500">
                      {getCurrentChat()?.type === 'direct' 
                        ? getCurrentChat()?.participants[0]?.status 
                        : `${getCurrentChat()?.participants.length} members`
                      }
                    </p>
                  </div>
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex gap-3 ${
                  message.sender === user?.username ? 'flex-row-reverse' : ''
                }`}>
                  <img
                    src={message.senderAvatar}
                    alt={message.sender}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  />
                  <div className={`flex flex-col max-w-xs lg:max-w-md ${
                    message.sender === user?.username ? 'items-end' : 'items-start'
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-gray-700">{message.sender}</span>
                      <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                    </div>
                    <div className={`rounded-lg px-4 py-2 ${
                      message.sender === user?.username
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
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-600">Choose a chat from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Start New Chat</h3>
              <button
                onClick={() => setShowNewChatModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setChatType('direct')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    chatType === 'direct' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Direct Message
                </button>
                <button
                  onClick={() => setChatType('group')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    chatType === 'group' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Group Chat
                </button>
              </div>

              <div className="max-h-60 overflow-y-auto">
                <div className="space-y-2">
                  {availableUsers.map((chatUser) => (
                    <button
                      key={chatUser.id}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="relative">
                        <img
                          src={chatUser.avatar}
                          alt={chatUser.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                          chatUser.status === 'online' ? 'bg-green-400' : 'bg-gray-400'
                        }`} />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-gray-900">{chatUser.name}</p>
                        <p className="text-sm text-gray-500 capitalize">{chatUser.status}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}