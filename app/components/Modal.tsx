"use client";

import type { FC } from "react";

export type Block = { type: "text" | "code"; content: string };

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  url: string;
  score: number;
  blocks: Block[];
};

const Modal: FC<ModalProps> = ({ open, onClose, title, url, score, blocks }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 max-h-[85vh] w-[92vw] max-w-3xl overflow-auto rounded-xl bg-white p-5 shadow-lg" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-start justify-between gap-4">
          <h3 className="text-xl font-semibold text-zinc-900">{title}</h3>
          <button onClick={onClose} className="rounded-md border border-zinc-200 px-3 py-1 text-sm text-zinc-700 hover:bg-zinc-50">Close</button>
        </div>
        <div className="mb-4 flex items-center justify-between text-sm">
          <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[var(--accent)] hover:underline">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M10 13a5 5 0 0 1 0-7.07l2.83-2.83a5 5 0 1 1 7.07 7.07L18 12" />
              <path d="M14 11a5 5 0 0 1 0 7.07L11.17 20.9a5 5 0 0 1-7.07-7.07L6 12" />
            </svg>
            <span>Link to post</span>
          </a>
          <span className="rounded-md bg-zinc-100 px-2 py-1 font-medium text-zinc-800">Score: {score}</span>
        </div>
        <div className="flex flex-col gap-3">
          {blocks.map((b, i) =>
            b.type === "text" ? (
              <p key={i} className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-700">{b.content}</p>
            ) : (
              <pre key={i} className="overflow-x-auto rounded-md bg-zinc-950 p-3 text-xs leading-relaxed text-zinc-100"><code>{b.content}</code></pre>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;


