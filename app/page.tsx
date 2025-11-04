"use client";

import { useEffect, useState } from "react";
import Card from "./components/Card";
import Modal from "./components/Modal";

type Block = { type: "text" | "code"; content: string };

type RedditPost = {
  data: {
    id?: string;
    title: string;
    url: string;
    score: number;
    selftext_html: string | null;
  };
};

function decodeEntities(input: string): string {
  return input
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function normalizeCode(code: string): string {
  const lines = code.split(/\r?\n/);
  const merged: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    const cur = lines[i];
    const next = i + 1 < lines.length ? lines[i + 1] : undefined;
    const curTrim = cur.trim();
    if (
      next !== undefined &&
      curTrim.length > 0 &&
      curTrim.split(/\s+/).length === 1
    ) {
      merged.push(`${curTrim} ${next.replace(/^\s+/, "")}`);
      i++;
      continue;
    }
    merged.push(cur);
  }
  return merged.join("\n").replace(/\s+$/gm, "");
}

function htmlToPlainText(input: string): string {
  if (!input) return "";
  const replaced = input
    .replace(/<\s*br\s*\/?\s*>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<p[^>]*>/gi, "")
    .replace(/<li[^>]*>/gi, "• ")
    .replace(/<\/li>/gi, "\n")
    .replace(/<\/ul>/gi, "\n")
    .replace(/<ul[^>]*>/gi, "")
    .replace(/<[^>]+>/g, "");
  return decodeEntities(replaced)
    .split("\n")
    .map((l) => l.replace(/\s+/g, " ").trimEnd())
    .join("\n")
    .trim();
}

function parseLegibleBlocks(html: string): Block[] {
  if (!html) return [];

  let source = html
    .replace(/<\/?div[^>]*>/gi, "")
    .trim();

  const blocks: Block[] = [];
  const codeRegex = /<pre[^>]*>\s*<code[^>]*>([\s\S]*?)<\/code>\s*<\/pre>/gi;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = codeRegex.exec(source)) !== null) {
    const before = source.slice(lastIndex, match.index);
    const text = htmlToPlainText(before);
    if (text) blocks.push({ type: "text", content: text });

    const codeInner = decodeEntities(match[1].replace(/<[^>]+>/g, ""));
    const normalized = normalizeCode(codeInner);
    if (normalized.trim()) blocks.push({ type: "code", content: normalized });

    lastIndex = match.index + match[0].length;
  }

  const rest = source.slice(lastIndex);
  const text = htmlToPlainText(rest);
  if (text) blocks.push({ type: "text", content: text });

  return blocks;
}


export default function Home() {
  const [listing, setListing] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [open, setOpen] = useState(false);
  const [modalData, setModalData] = useState<{
    title: string;
    url: string;
    score: number;
    blocks: Block[];
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const res = await fetch("/data.json");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!cancelled) setListing(json);
      } catch (e: any) {
        console.error(e);
        if (!cancelled) setError("Failed to load feed");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);
  

  const children: RedditPost[] = (listing?.data?.children as RedditPost[]) ?? [];

  return (
    <div className="flex min-h-screen w-full items-start justify-center bg-[var(--background)] py-6">
      <main className="w-full max-w-[1280px] min-h-[720px] px-2 sm:px-4 lg:px-6">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Reddit Feed
          </h1>
        </header>

        {loading && (
          <p className="text-sm text-zinc-400">Loading…</p>
        )}
        {error && !loading && (
          <p className="text-sm text-red-600">{error}</p>
        )}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {children.map((child, idx) => (
            <Card
              key={child.data.id ?? idx}
              title={child.data.title}
              url={child.data.url}
              score={child.data.score}
              excerpt={(child.data.selftext_html ? parseLegibleBlocks(decodeEntities(child.data.selftext_html)) : []).map((b: Block) => b.content).join("\n\n")}
              onOpen={() => {
                const decodedHTML = child.data.selftext_html ? decodeEntities(child.data.selftext_html) : "";
                const blocks = decodedHTML ? parseLegibleBlocks(decodedHTML) : [];
                setModalData({
                  title: child.data.title,
                  url: child.data.url,
                  score: child.data.score,
                  blocks,
                });
                setOpen(true);
              }}
            />
          ))}
        </section>
      </main>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={modalData?.title ?? ""}
        url={modalData?.url ?? ""}
        score={modalData?.score ?? 0}
        blocks={modalData?.blocks ?? []}
      />
    </div>
  );
}
