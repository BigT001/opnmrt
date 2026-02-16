import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const FormattedMessage = ({ content }: { content: string }) => {
    return (
        <div className="prose prose-sm max-w-none">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    // Headings
                    h1: ({ node, ...props }) => (
                        <h1 className="text-lg font-black mb-3 mt-4 text-slate-900" {...props} />
                    ),
                    h2: ({ node, ...props }) => (
                        <h2 className="text-base font-black mb-2 mt-3 text-slate-800 flex items-center gap-2" {...props} />
                    ),
                    h3: ({ node, ...props }) => (
                        <h3 className="text-sm font-bold mb-2 mt-2 text-slate-700" {...props} />
                    ),

                    // Paragraphs
                    p: ({ node, ...props }) => (
                        <p className="text-sm leading-relaxed mb-3 text-slate-700" {...props} />
                    ),

                    // Lists
                    ul: ({ node, ...props }) => (
                        <ul className="list-disc pl-5 mb-3 space-y-1" {...props} />
                    ),
                    ol: ({ node, ...props }) => (
                        <ol className="list-decimal pl-5 mb-3 space-y-1" {...props} />
                    ),
                    li: ({ node, ...props }) => (
                        <li className="text-sm text-slate-700 leading-relaxed pl-1" {...props} />
                    ),

                    // Text formatting
                    strong: ({ node, ...props }) => (
                        <strong className="font-bold text-slate-900" {...props} />
                    ),
                    em: ({ node, ...props }) => (
                        <em className="italic text-slate-600" {...props} />
                    ),

                    // Code
                    code: ({ node, inline, ...props }: any) =>
                        inline ? (
                            <code className="px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded text-xs font-mono font-semibold" {...props} />
                        ) : (
                            <code className="block px-4 py-3 bg-slate-900 text-green-400 rounded-xl text-xs font-mono overflow-x-auto my-3 shadow-lg" {...props} />
                        ),

                    // Blockquotes
                    blockquote: ({ node, ...props }) => (
                        <blockquote className="border-l-4 border-indigo-600 pl-4 py-2 my-3 bg-indigo-50/50 rounded-r-lg italic text-slate-600" {...props} />
                    ),

                    // Links
                    a: ({ node, ...props }) => (
                        <a className="text-indigo-600 hover:text-indigo-700 underline font-medium transition-colors" target="_blank" rel="noopener noreferrer" {...props} />
                    ),

                    // Horizontal rule
                    hr: ({ node, ...props }) => (
                        <hr className="my-4 border-slate-200" {...props} />
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};
