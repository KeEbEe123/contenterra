"use client";

import type { FC } from "react";

type CardProps = {
  title: string;
  url: string;
  score: number;
  excerpt: string;
  onOpen: () => void;
};

const Card: FC<CardProps> = ({ title, url, score, excerpt, onOpen }) => {
  const displayTitle = title.length > 50 ? title.slice(0, 50).trim() + "…" : title;
  return (
    <article
      onClick={onOpen}
      className="
        flex flex-col justify-between 
        cursor-pointer gap-3 
        rounded-xl border border-zinc-200 
        bg-white p-5 shadow-sm transition-shadow 
        hover:shadow-md 
        transition-transform duration-200 ease-in-out hover:scale-[1.02] active:scale-[0.98]
        h-auto min-h-[250px]
      "
    >
      <div>
        <h2
          className="text-lg font-semibold text-zinc-900 mb-2 line-clamp-2"
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            wordBreak: "break-word",
            hyphens: "auto",
          }}
        >
          {displayTitle}
        </h2>

        {excerpt ? (
          <p className="text-sm leading-relaxed text-zinc-700 line-clamp-5">
            {excerpt}
          </p>
        ) : (
          <p className="text-sm text-zinc-600">No self text</p>
        )}
      </div>

      <div className="mt-auto flex items-center justify-between pt-2 text-sm">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-[var(--accent)] hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
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
        <span className="rounded-md bg-zinc-100 px-2 py-1 font-medium text-zinc-800">
          Score: {score}
        </span>
      </div>
    </article>
  );
};

export default Card;


