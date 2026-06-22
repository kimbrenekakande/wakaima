/**
 * Parses a raw scraped profile text into structured sections.
 * The profile text uses markdown-like syntax with `#`, `*`, and plain text.
 */

export interface ProfileSection {
  level: number; // heading level (0 for root/untitled)
  title: string | null;
  lines: ProfileLine[];
}

export type ProfileLine =
  | { type: "bullet"; text: string; indent: number }
  | { type: "text"; text: string }
  | { type: "separator" };

export function parseProfile(raw: string | null): ProfileSection[] {
  if (!raw) return [];

  const lines = raw.split("\n");
  const sections: ProfileSection[] = [];
  let currentSection: ProfileSection = { level: 0, title: null, lines: [] };

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip empty lines
    if (trimmed === "") continue;

    // Separator
    if (trimmed === "---") {
      currentSection.lines.push({ type: "separator" });
      continue;
    }

    // Heading detection
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      // Save previous section if it has content
      if (currentSection.lines.length > 0) {
        sections.push(currentSection);
      }
      currentSection = {
        level: headingMatch[1].length,
        title: headingMatch[2].trim(),
        lines: [],
      };
      continue;
    }

    // Bullet point detection
    const bulletMatch = trimmed.match(/^(\s*)\*\s+(.+)$/);
    if (bulletMatch) {
      const indent = Math.floor(bulletMatch[1].length / 2);
      currentSection.lines.push({
        type: "bullet",
        text: bulletMatch[2].trim(),
        indent,
      });
      continue;
    }

    // Plain text
    currentSection.lines.push({ type: "text", text: trimmed });
  }

  // Push final section
  if (currentSection.lines.length > 0) {
    sections.push(currentSection);
  }

  return sections;
}

/**
 * Extracts contact info from the first section (which typically contains
 * address, hours, email, phone in bullet form).
 */
export function extractContactInfo(sections: ProfileSection[]) {
  const contactSection = sections[0];
  if (!contactSection) return null;

  const bullets = contactSection.lines.filter(
    (l): l is { type: "bullet"; text: string; indent: number } =>
      l.type === "bullet" && l.indent === 0,
  );

  let address: string | null = null;
  let hours: string | null = null;
  let email: string | null = null;
  let phone: string | null = null;

  for (const bullet of bullets.slice(0, 6)) {
    const t = bullet.text;
    if (!address && (t.toLowerCase().includes("plot") || t.toLowerCase().includes("road") || t.toLowerCase().includes("block") || t.toLowerCase().includes("street"))) {
      address = t;
    } else if (!hours && (t.toLowerCase().includes("mon") || t.toLowerCase().includes("fri") || t.toLowerCase().includes("sat") || t.toLowerCase().includes("sun") || t.includes(".") && (t.includes("am") || t.includes("pm") || /\d/.test(t)))) {
      hours = t;
    } else if (!email && t.includes("@")) {
      email = t;
    } else if (!phone && /[\d\s+()-]{7,}/.test(t)) {
      phone = t;
    }
  }

  return { address, hours, email, phone };
}

/**
 * Extracts stat-like numbers from the profile text.
 * Looks for patterns like "0+ Years", "0 Countries", etc.
 */
export function extractStats(sections: ProfileSection[]): { label: string; value: string }[] {
  const stats: { label: string; value: string }[] = [];
  const seen = new Set<string>();

  for (const section of sections) {
    for (const line of section.lines) {
      if (line.type !== "text") continue;
      const match = line.text.match(/^###\s*(\d+\+?)\s*\n?\s*(.+)$/i);
      if (match) {
        const label = match[2].trim();
        if (!seen.has(label)) {
          seen.add(label);
          stats.push({ value: match[1], label });
        }
      }
    }
  }

  return stats;
}
