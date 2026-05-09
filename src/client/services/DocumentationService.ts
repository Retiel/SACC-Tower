import { display, value } from "../utils/fields";
import { getEnabledSources, ExternalSource, CATEGORY_LABELS, SourceOwner } from "../config/doc-sources";

// ============================================================================
// TYPES
// ============================================================================

export interface DocItem {
  id: string;
  title: string;
  type: string;
  source: DocSource;
  sourceName: string;
  owner?: SourceOwner;
  relevance: string;
  summary: string;
  url?: string;
  authRequired?: boolean;
  tags?: string[];
  metadata?: Record<string, string>;
}

export type DocSource = "knowledge_base" | "external";

// ============================================================================
// KNOWLEDGE BASE SERVICE
// ============================================================================

/**
 * Fetches published articles from ServiceNow Knowledge Bases
 */
export async function fetchKnowledgeBaseArticles(
  query?: string,
  limit: number = 20
): Promise<DocItem[]> {
  const params = new URLSearchParams({
    sysparm_display_value: "all",
    sysparm_limit: String(limit),
    sysparm_fields: "sys_id,short_description,number,topic,kb_knowledge_base,category,workflow_state,author,sys_updated_on,meta_description",
    sysparm_query: buildKBQuery(query),
  });

  try {
    const response = await fetch(`/api/now/table/kb_knowledge?${params}`, {
      headers: {
        Accept: "application/json",
        "X-UserToken": (window as any).g_ck,
      },
    });

    if (!response.ok) {
      console.error("KB fetch failed:", response.status);
      return [];
    }

    const data = await response.json();
    const results = data.result || [];

    return results.map((article: any) => ({
      id: value(article.sys_id),
      title: display(article.short_description) || "Untitled Article",
      type: "Knowledge Base Article",
      source: "knowledge_base" as DocSource,
      sourceName: display(article.kb_knowledge_base) || "Knowledge Base",
      relevance: display(article.topic) || display(article.category) || "General",
      summary: display(article.meta_description) || `KB Article ${display(article.number)}`,
      url: `/kb_view.do?sys_kb_id=${value(article.sys_id)}`,
      authRequired: false,
      tags: [display(article.topic), display(article.category)].filter(Boolean),
      metadata: {
        number: display(article.number),
        author: display(article.author),
        updated: display(article.sys_updated_on),
        state: display(article.workflow_state),
      },
    }));
  } catch (error) {
    console.error("Error fetching KB articles:", error);
    return [];
  }
}

/**
 * Build the encoded query for KB articles
 */
function buildKBQuery(searchTerm?: string): string {
  const conditions = ["workflow_state=published", "active=true"];
  if (searchTerm) {
    conditions.push(`short_descriptionLIKE${searchTerm}^ORmeta_descriptionLIKE${searchTerm}`);
  }
  return conditions.join("^");
}

// ============================================================================
// EXTERNAL SOURCES SERVICE
// ============================================================================

/**
 * Gets documentation items from the configured external sources.
 * This maps the external connector config into DocItem format.
 */
export function getExternalSourceDocItems(): DocItem[] {
  const sources = getEnabledSources();
  const items: DocItem[] = [];

  for (const source of sources) {
    // Create a main entry for each source
    items.push(mapSourceToDocItem(source));

    // Also create entries for each specific documentation path
    if (source.paths) {
      for (const path of source.paths) {
        items.push({
          id: `${source.id}__${path.path}`,
          title: path.title,
          type: CATEGORY_LABELS[source.category] || "External Documentation",
          source: "external",
          sourceName: source.name,
          owner: source.owner,
          relevance: path.description,
          summary: `${path.description} — from ${source.name}`,
          url: `${source.baseUrl}${path.path}`,
          authRequired: source.authRequired,
          tags: source.tags,
        });
      }
    }
  }

  return items;
}

/**
 * Maps an ExternalSource config to a DocItem
 */
function mapSourceToDocItem(source: ExternalSource): DocItem {
  return {
    id: source.id,
    title: source.name,
    type: CATEGORY_LABELS[source.category] || "External Documentation",
    source: "external",
    sourceName: source.name,
    owner: source.owner,
    relevance: source.category.replace(/_/g, " "),
    summary: source.description,
    url: source.baseUrl,
    authRequired: source.authRequired,
    tags: source.tags,
  };
}

// ============================================================================
// COMBINED SERVICE
// ============================================================================

/**
 * Fetches all documentation items from all sources
 * Primary: Knowledge Base | Secondary: External connector sources
 */
export async function fetchAllDocumentation(
  query?: string,
  sourceFilter?: DocSource | "all"
): Promise<DocItem[]> {
  let kbItems: DocItem[] = [];
  let externalItems: DocItem[] = [];

  if (!sourceFilter || sourceFilter === "all" || sourceFilter === "knowledge_base") {
    kbItems = await fetchKnowledgeBaseArticles(query);
  }

  if (!sourceFilter || sourceFilter === "all" || sourceFilter === "external") {
    externalItems = getExternalSourceDocItems();
    // Client-side filter for external items when searching
    if (query) {
      const lowerQuery = query.toLowerCase();
      externalItems = externalItems.filter(
        (item) =>
          item.title.toLowerCase().includes(lowerQuery) ||
          item.summary.toLowerCase().includes(lowerQuery) ||
          (item.tags || []).some((t) => t.toLowerCase().includes(lowerQuery))
      );
    }
  }

  // Knowledge Base articles first (primary source), then external
  return [...kbItems, ...externalItems];
}

/**
 * Get unique source names from external connector
 */
export function getAvailableSourceNames(): string[] {
  const sources = getEnabledSources();
  return [...new Set(sources.map((s) => s.name))];
}
