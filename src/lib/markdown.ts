// Minimal, dependency-free Markdown -> HTML renderer for admin-authored blog
// posts. Input is HTML-escaped first, so only the explicit inline patterns
// below can produce markup — no raw HTML passthrough.
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function inline(text: string): string {
  let t = escapeHtml(text);
  // `code`
  t = t.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-black/60 border border-zinc-800 text-void-cyan text-[0.85em]">$1</code>');
  // **bold**
  t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  // *italic*
  t = t.replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");
  // [text](url) — only http(s) and relative links allowed
  t = t.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]*)\)/g,
    '<a href="$2" class="text-void-cyan underline hover:text-cyan-300" rel="noopener noreferrer">$1</a>');
  return t;
}

export function renderMarkdown(md: string): string {
  const lines = (md || "").replace(/\r\n/g, "\n").split("\n");
  const html: string[] = [];
  let listType: "ul" | "ol" | null = null;
  let para: string[] = [];

  const flushPara = () => {
    if (para.length) {
      html.push(`<p class="my-4 leading-relaxed">${inline(para.join(" "))}</p>`);
      para = [];
    }
  };
  const closeList = () => {
    if (listType) {
      html.push(`</${listType}>`);
      listType = null;
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      flushPara();
      closeList();
      continue;
    }
    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      flushPara();
      closeList();
      const level = h[1].length;
      const sizes: Record<number, string> = {
        1: "text-2xl md:text-3xl font-black text-white mt-8 mb-3",
        2: "text-xl md:text-2xl font-bold text-white mt-7 mb-2",
        3: "text-lg font-bold text-white mt-6 mb-2",
        4: "text-base font-bold text-zinc-200 mt-5 mb-1",
      };
      html.push(`<h${level} class="${sizes[level]}">${inline(h[2])}</h${level}>`);
      continue;
    }
    const ul = line.match(/^[-*]\s+(.*)$/);
    const ol = line.match(/^\d+\.\s+(.*)$/);
    if (ul || ol) {
      flushPara();
      const type = ul ? "ul" : "ol";
      if (listType !== type) {
        closeList();
        const cls = type === "ul" ? "list-disc" : "list-decimal";
        html.push(`<${type} class="${cls} pl-6 my-4 space-y-1.5">`);
        listType = type;
      }
      html.push(`<li>${inline((ul ? ul[1] : ol![1]))}</li>`);
      continue;
    }
    closeList();
    para.push(line.trim());
  }
  flushPara();
  closeList();
  return html.join("\n");
}
