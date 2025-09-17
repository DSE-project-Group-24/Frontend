import React, { useState } from 'react';
import { X, Send, MessageCircle } from 'lucide-react';

const Chatbot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! I can help you with accident data insights. Try asking about total accidents, top roads, or trends.' },
  ]);
  const [input, setInput] = useState('');

  // Simulated data for responses (in a real app, this would come from the dashboard's currentData or API)
  const data = {
    totalAccidents: 1250,
    fatalAccidents: 85,
    topRoad: 'Route 66',
    topRoadCount: 120,
    mostCommonVehicle: 'Car',
    mostCommonVehicleCount: 400,
    peakPeriod: 'Aug 2025',
    peakAccidentCount: 200,
  };

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    setMessages([...messages, { sender: 'user', text: input }]);

    // Process user input and generate bot response
    let botResponse = 'Sorry, I didn’t understand that. Try asking about total accidents, top roads, or trends.';
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes('total accidents')) {
      botResponse = `The total number of accidents is ${data.totalAccidents}.`;
    } else if (lowerInput.includes('fatal accidents')) {
      botResponse = `There were ${data.fatalAccidents} fatal accidents recorded.`;
    } else if (lowerInput.includes('top road') || lowerInput.includes('most accidents')) {
      botResponse = `The road with the most accidents is ${data.topRoad} with ${data.topRoadCount} incidents.`;
    } else if (lowerInput.includes('vehicle')) {
      botResponse = `The most common vehicle involved in accidents is ${data.mostCommonVehicle}, accounting for ${data.mostCommonVehicleCount} incidents.`;
    } else if (lowerInput.includes('trend') || lowerInput.includes('peak')) {
      botResponse = `The peak period for accidents was ${data.peakPeriod} with ${data.peakAccidentCount} incidents.`;
    }

    // Add bot response
    setMessages((prev) => [...prev, { sender: 'bot', text: botResponse }]);
    setInput('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl flex flex-col h-[500px] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <MessageCircle className="text-white" size={24} />
            <h2 className="text-lg font-bold text-white">Accident Data Assistant</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-3 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  msg.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about accidents..."
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;