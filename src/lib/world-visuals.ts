// Shared per-world display metadata (icon + accent color) used by the
// World Map and world detail pages. Purely presentational - has no effect
// on curriculum data or progress logic.
export const WORLD_VISUALS: Record<string, { icon: string; accent: string }> = {
  "web-foundations": { icon: "🌐", accent: "#4f8cff" },
  "html-harbor": { icon: "⚓", accent: "#e8590c" },
  "css-city": { icon: "🎨", accent: "#ae3ec9" },
  "javascript-jungle": { icon: "🌴", accent: "#f0c419" },
  "typescript-tower": { icon: "🏰", accent: "#3178c6" },
  "react-realm": { icon: "⚛️", accent: "#61dafb" },
  "nextjs-network": { icon: "🕸️", accent: "#e6edf3" },
  "api-headquarters": { icon: "📡", accent: "#2fb344" },
  "database-district": { icon: "🗄️", accent: "#f76707" },
  "prisma-workshop": { icon: "🔧", accent: "#0c8599" },
  "authentication-fortress": { icon: "🔐", accent: "#e03131" },
  "github-mountain": { icon: "🏔️", accent: "#adb5bd" },
  "railway-launch-center": { icon: "🚀", accent: "#f06595" },
  "debugging-dungeon": { icon: "🐛", accent: "#5c940d" },
  "testing-laboratory": { icon: "🧪", accent: "#1098ad" },
  "security-stronghold": { icon: "🛡️", accent: "#c2255c" },
  "full-stack-final-challenge": { icon: "🏆", accent: "#f59f00" },
};

const DEFAULT_VISUAL = { icon: "🗺️", accent: "#8b98a5" };

export function getWorldVisual(slug: string): { icon: string; accent: string } {
  return WORLD_VISUALS[slug] ?? DEFAULT_VISUAL;
}
