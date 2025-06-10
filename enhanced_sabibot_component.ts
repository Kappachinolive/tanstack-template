import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Notebook as Robot, ChevronDown, Loader2, DollarSign, CreditCard, Zap, TrendingUp } from 'lucide-react';
import Button from '../ui/Button';
import { SabiBotMessage } from '../../types';
import { SABIBOT_GREETING, SABIBOT_SUGGESTIONS } from '../../config/constants';

interface SabiBotProps {
  isOpen: boolean;
  onClose: () => void;
  initialMessages?: SabiBotMessage[];
  userBalance?: number;
  userName?: string;
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  message: string;
  category: 'transfer' | 'bills' | 'balance' | 'help';
}

const SabiBot: React.FC<SabiBotProps> = ({ 
  isOpen, 
  onClose,
  initialMessages = [],
  userBalance = 250000.75,
  userName = 'User'
}) => {
  const [messages, setMessages] = useState<SabiBotMessage[]>(
    initialMessages.length > 0 
      ? initialMessages 
      : [
          {
            id: 'welcome',
            role: 'assistant',
            content: `${SABIBOT_GREETING}\n\nHello ${userName}! 👋 I'm your personal financial assistant. How can I help you manage your finances today?`,
            timestamp: new Date().toISOString()
          }
        ]
  );
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const quickActions: QuickAction[] = [
    {
      id: 'balance',
      label: 'Check Balance',
      icon: <DollarSign size={16} />,
      message: 'What is my current balance?',
      category: 'balance'
    },
    {
      id: 'transfer',
      label: 'Send Money',
      icon: <Send size={16} />,
      message: 'I want to transfer money',
      category: 'transfer'
    },
    {
      id: 'bills',
      label: 'Pay Bills',
      icon: <CreditCard size={16} />,
      message: 'Help me pay bills',
      category: 'bills'
    },
    {
      id: 'insights',
      label: 'Financial Tips',
      icon: <TrendingUp size={16} />,
      message: 'Give me financial advice',
      category: 'help'
    }
  ];
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Hide quick actions after first user message
  useEffect(() => {
    const userMessages = messages.filter(msg => msg.role === 'user');
    if (userMessages.length > 0) {
      setShowQuickActions(false);
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (inputValue.trim() === '' || isLoading) return;
    
    const userMessage: SabiBotMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    // Simulate response delay
    setTimeout(() => {
      const botResponse: SabiBotMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: generateEnhancedBotResponse(inputValue.trim()),
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const generateEnhancedBotResponse = (message: string): string => {
    const normalizedMessage = message.toLowerCase();
    
    // Greeting responses
    if (normalizedMessage.includes('hello') || normalizedMessage.includes('hi')) {
      return `Hello ${userName}! 👋 I'm here to help you manage your finances with KappaXchange. What would you like to do today?`;
    }
    
    // Balance inquiry with detailed breakdown
    if (normalizedMessage.includes('balance')) {
      return `💰 **Account Balance Summary**\n\nCurrent Balance: ₦${userBalance.toLocaleString()}\n\n📊 **Quick Stats:**\n• Available for spending: ₦${(userBalance * 0.9).toLocaleString()}\n• Reserved funds: ₦${(userBalance * 0.1).toLocaleString()}\n\nWould you like to:\n✅ Add funds to your account\n✅ View transaction history\n✅ Set up savings goals`;
    }
    
    // Enhanced transfer responses
    if (normalizedMessage.includes('transfer') || normalizedMessage.includes('send money')) {
      return `💸 **Money Transfer Options**\n\nI can help you send money quickly and securely:\n\n🏦 **Bank Transfer**\n• To saved beneficiaries\n• To new bank accounts\n• Same bank or other banks\n\n📱 **Quick Transfer**\n• To phone numbers\n• To email addresses\n\nYour daily transfer limit: ₦500,000\n\nWho would you like to send money to?`;
    }
    
    // Enhanced bill payment responses
    if (normalizedMessage.includes('bill') || normalizedMessage.includes('pay')) {
      if (normalizedMessage.includes('dstv') || normalizedMessage.includes('tv')) {
        return `📺 **DSTV Bill Payment**\n\nI found your DSTV subscription details:\n• Smartcard: 12345678901\n• Package: DSTV Premium\n• Last payment: ₦24,000\n• Due date: 15th of every month\n\n💡 **Pro tip:** Enable auto-renewal to never miss your favorite shows!\n\nWould you like to:\n✅ Pay current bill (₦24,000)\n✅ Upgrade/downgrade package\n✅ Set up auto-renewal`;
      }
      
      if (normalizedMessage.includes('electricity') || normalizedMessage.includes('light')) {
        return `⚡ **Electricity Bill Payment**\n\nIkeja Electric Account Details:\n• Meter Number: 45678901234\n• Account Type: Prepaid\n• Last purchase: ₦5,000 (3 weeks ago)\n• Estimated usage: ₦8,000/month\n\n📊 **Smart Suggestions:**\n• Buy ₦10,000 for 2 weeks coverage\n• Buy ₦20,000 for 1 month coverage\n\nHow much would you like to purchase?`;
      }
      
      if (normalizedMessage.includes('data') || normalizedMessage.includes('airtime')) {
        return `📱 **Airtime & Data Purchase**\n\nYour registered number: 080****1234 (MTN)\n\n🎯 **Popular Options:**\n• ₦500 - 1GB (7 days)\n• ₦1,000 - 2.5GB (30 days)\n• ₦2,000 - 6GB (30 days)\n• ₦5,000 - 15GB (30 days)\n\n📞 **Airtime:** Any amount from ₦100 - ₦50,000\n\nWhich would you prefer - airtime or data bundle?`;
      }
      
      return `🧾 **Bill Payment Services**\n\nI can help you pay these bills instantly:\n\n⚡ **Utilities**\n• Electricity (EKEDC, IKEDC, AEDC, etc.)\n• Water bills\n• Waste management\n\n📺 **Entertainment**\n• DSTV, GOTV, StarTimes\n• Netflix, Spotify subscriptions\n\n📱 **Telecom**\n• Airtime & Data bundles\n• Internet subscriptions\n\n🎓 **Education**\n• School fees\n• WAEC, JAMB, NECO forms\n\nWhich category interests you?`;
    }
    
    // Financial advice and tips
    if (normalizedMessage.includes('advice') || normalizedMessage.includes('tip') || normalizedMessage.includes('financial')) {
      return `💡 **Personalized Financial Tips**\n\nBased on your account activity, here are some recommendations:\n\n📈 **Smart Savings**\n• Set aside 20% of income automatically\n• Try our savings challenge: Save ₦500 daily for 30 days\n\n💳 **Spending Insights**\n• Your top expense: Bill payments (45%)\n• Consider budgeting ₦30,000 monthly for utilities\n\n🎯 **Goals**\n• Emergency fund target: ₦150,000 (6 months expenses)\n• Investment opportunity: Start with ₦5,000 monthly\n\nWould you like me to help you set up a savings plan?`;
    }
    
    // Enhanced help response
    if (normalizedMessage.includes('help')) {
      return `🤖 **SabiBot Capabilities**\n\nI'm your AI financial assistant with these superpowers:\n\n💰 **Account Management**\n• Check balance & transaction history\n• Fund account via bank transfer/card\n• Generate account statements\n\n💸 **Money Transfer**\n• Send to banks, wallets, or internationally\n• Schedule recurring transfers\n• Split bills with friends\n\n🧾 **Bill Payments**\n• All major utilities & subscriptions\n• Set up auto-pay for regular bills\n• Get payment reminders\n\n📊 **Financial Insights**\n• Spending analysis & budgeting\n• Savings recommendations\n• Investment opportunities\n\nWhat specific area can I help you with?`;
    }
    
    // Security and account inquiries
    if (normalizedMessage.includes('secure') || normalizedMessage.includes('safe')) {
      return `🔒 **Your Security is Our Priority**\n\n✅ **Active Protection:**\n• 256-bit SSL encryption\n• Two-factor authentication enabled\n• Real-time fraud monitoring\n• Instant transaction alerts\n\n🛡️ **Your Account Status:**\n• Security level: High ✅\n• Last login: Today, 2:30 PM\n• No suspicious activities detected\n\n💡 **Security Tips:**\n• Never share your PIN/password\n• Always verify transaction details\n• Report suspicious activities immediately\n\nNeed help with any security settings?`;
    }
    
    // Transaction history requests
    if (normalizedMessage.includes('history') || normalizedMessage.includes('transaction')) {
      return `📊 **Recent Transaction History**\n\n**Today:**\n• 2:45 PM - DSTV Payment: -₦24,000\n• 11:30 AM - Transfer to John: -₦15,000\n\n**Yesterday:**\n• 6:20 PM - MTN Data: -₦1,000\n• 2:15 PM - Fund Account: +₦50,000\n\n**This Week:**\n• Total Spent: ₦67,500\n• Total Received: ₦125,000\n• Net Change: +₦57,500 ✅\n\nWould you like to:\n✅ Download full statement\n✅ View specific date range\n✅ Export to Excel/PDF`;
    }
    
    // Default response with context
    return `I'm here to help with your finances! 🤖\n\nBased on your message, I think you might want to:\n\n• 💰 Check your balance (₦${userBalance.toLocaleString()})\n• 💸 Make a transfer or payment\n• 🧾 Pay bills or buy airtime/data\n• 📊 Get financial insights and tips\n\nCould you be more specific about what you'd like to do? I'm designed to make your banking experience seamless! ✨`;
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setTimeout(() => {
      handleSendMessage();
    }, 0);
  };

  const handleQuickActionClick = (action: QuickAction) => {
    setInputValue(action.message);
    setTimeout(() => {
      handleSendMessage();
    }, 0);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-NG', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 right-0 lg:right-4 z-50 flex flex-col w-full sm:w-96 h-[600px] max-h-[80vh] bg-white rounded-t-xl sm:rounded-xl shadow-xl border border-gray-200">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-brand-primary/5 to-brand-accent/5">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-brand-primary to-brand-accent flex items-center justify-center">
            <Robot size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">SabiBot</h3>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-xs text-gray-500">Online • AI Assistant</p>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
      </div>
      
      {/* Messages Container */}
      <div className="flex-1 p-4 overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
        {messages.map((message) => (
          <div 
            key={message.id}
            className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] rounded-2xl p-4 ${
                message.role === 'user' 
                  ? 'bg-gradient-to-r from-brand-primary to-brand-accent text-white rounded-tr-md shadow-lg'
                  : 'bg-white text-gray-800 border border-gray-100 rounded-tl-md shadow-sm'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
              <div 
                className={`text-xs mt-2 ${
                  message.role === 'user' ? 'text-white/70' : 'text-gray-400'
                }`}
              >
                {formatTimestamp(message.timestamp)}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="mb-4 flex justify-start">
            <div className="max-w-[75%] rounded-2xl p-4 bg-white text-gray-800 border border-gray-100 rounded-tl-md shadow-sm flex items-center">
              <Loader2 size={16} className="animate-spin mr-3 text-brand-primary" />
              <p className="text-sm">SabiBot is thinking...</p>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Quick Actions */}
      {showQuickActions && (
        <div className="p-4 bg-white border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-3 font-medium">Quick Actions:</p>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleQuickActionClick(action)}
                className="flex items-center space-x-2 p-3 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-brand-primary/10 hover:to-brand-accent/10 rounded-xl transition-all duration-200 group border border-gray-200 hover:border-brand-primary/20"
              >
                <div className="text-brand-primary group-hover:scale-110 transition-transform">
                  {action.icon}
                </div>
                <span className="text-xs font-medium text-gray-700 group-hover:text-brand-primary">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Suggestions (only show early in conversation) */}
      {messages.length <= 2 && !showQuickActions && (
        <div className="p-3 bg-white border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-2">Suggested questions:</p>
          <div className="flex flex-wrap gap-2">
            {SABIBOT_SUGGESTIONS.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="text-xs bg-gradient-to-r from-gray-100 to-gray-200 hover:from-brand-primary/10 hover:to-brand-accent/10 text-gray-700 px-3 py-2 rounded-full transition-all duration-200 border border-gray-200 hover:border-brand-primary/20"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Enhanced Input Box */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex items-center gap-3 bg-gray-50 rounded-full p-2 border border-gray-200 focus-within:border-brand-primary focus-within:bg-white transition-all">
          <input
            ref={inputRef}
            type="text"
            placeholder="Ask me anything about your finances..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1 px-3 py-2 bg-transparent text-sm focus:outline-none placeholder-gray-500"
          />
          <Button
            size="sm"
            rounded
            icon={isLoading ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
            onClick={handleSendMessage}
            disabled={isLoading || inputValue.trim() === ''}
            className="!p-2 min-w-[40px]"
          >
          </Button>
        </div>
        
        {/* Enhanced Footer */}
        <div className="flex items-center justify-center mt-3">
          <div className="flex items-center text-xs text-gray-400">
            <Sparkles size={12} className="mr-1 text-brand-accent animate-pulse" />
            <span>Powered by SabiBot AI • Secure & Intelligent</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SabiBot;