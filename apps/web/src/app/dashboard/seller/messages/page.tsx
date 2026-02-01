'use client';

import React from 'react';

export default function MessagesPage() {
    const chats = [
        { name: 'Sarah Jenkins', lastMsg: 'I haven\'t received my tracking number yet...', time: '12m', unread: true },
        { name: 'Michael Chen', lastMsg: 'Thanks for the quick shipping!', time: '2h', unread: false },
        { name: 'Emma Wilson', lastMsg: 'Do you have the white tee in Large?', time: '5h', unread: false },
        { name: 'Store AI Assistant', lastMsg: 'Successfully auto-replied to 3 queries.', time: '1d', unread: false, isAI: true },
    ];

    return (
        <div className="h-full flex flex-col space-y-8">
            <div className="flex justify-between items-end shrink-0">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Messages</h1>
                    <p className="text-slate-500 mt-1">Customer support and AI-assisted responses</p>
                </div>
                <div className="flex items-center space-x-2 bg-emerald-50 px-4 py-2 rounded-full">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">AI Agent Online</span>
                </div>
            </div>

            <div className="flex-1 flex space-x-8 min-h-0">
                {/* Chat List */}
                <div className="w-80 bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 flex flex-col overflow-hidden">
                    <div className="px-2 mb-6">
                        <input
                            type="text"
                            placeholder="Search messages..."
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-2 no-scrollbar px-2">
                        {chats.map((chat, idx) => (
                            <div key={idx} className={`p-4 rounded-2xl cursor-pointer transition-all ${chat.unread ? 'bg-emerald-50/50 ring-1 ring-emerald-100' : 'hover:bg-slate-50'}`}>
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-xs font-black text-slate-900 flex items-center">
                                        {chat.isAI && <span className="mr-1.5 grayscale">🤖</span>}
                                        {chat.name}
                                    </span>
                                    <span className="text-[10px] text-slate-400">{chat.time}</span>
                                </div>
                                <p className="text-[11px] text-slate-500 line-clamp-1">{chat.lastMsg}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Empty Chat State */}
                <div className="flex-1 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-center justify-center p-10 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-4xl mb-6 shadow-inner ring-1 ring-slate-100">
                        💬
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">Select a conversation</h3>
                    <p className="text-sm text-slate-500 max-w-sm mb-8 leading-relaxed">Respond to customers and let your AI Copilot handle the tedious queries automatically.</p>
                    <button className="px-8 py-3 bg-primary text-white rounded-xl text-xs font-bold hover:brightness-110 transition-all shadow-lg shadow-emerald-900/10">
                        Open AI Agent Settings
                    </button>
                </div>
            </div>
        </div>
    );
}
