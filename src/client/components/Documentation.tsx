import React, { useState, useEffect, useMemo } from "react";
import { Card } from "@servicenow/react-components/Card";
import { Button } from "@servicenow/react-components/Button";
import { Input } from "@servicenow/react-components/Input";
import { Select } from "@servicenow/react-components/Select";
import { Badge } from "@servicenow/react-components/Badge";
import { Accordion } from "@servicenow/react-components/Accordion";
import { AccordionItem } from "@servicenow/react-components/AccordionItem";
import { Loader } from "@servicenow/react-components/Loader";
import {
  fetchAllDocumentation,
  DocItem,
  DocSource,
} from "../services/DocumentationService";
import { getEnabledSources, SourceOwner } from "../config/doc-sources";

const LIST_CONSTRAIN = { maxHeight: 400, minWidth: 280 };

export default function Documentation() {
  const [docs, setDocs] = useState<DocItem[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<DocItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [docType, setDocType] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [sourceNameFilter, setSourceNameFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDocs();
  }, [sourceFilter]);

  async function loadDocs() {
    setLoading(true);
    try {
      const sf = sourceFilter === "all" ? "all" : (sourceFilter as DocSource);
      const items = await fetchAllDocumentation(undefined, sf);
      setDocs(items);
      if (items.length > 0 && !selectedDoc) {
        setSelectedDoc(items[0]);
      }
    } catch (err) {
      console.error("Failed to load documentation:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch() {
    setLoading(true);
    try {
      const sf = sourceFilter === "all" ? "all" : (sourceFilter as DocSource);
      const items = await fetchAllDocumentation(searchQuery || undefined, sf);
      setDocs(items);
      if (items.length > 0) setSelectedDoc(items[0]);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  }

  const sourceNameOptions = useMemo(() => {
    const names = [...new Set(docs.map((d) => d.sourceName))];
    return [
      { id: "all", label: "All Sources" },
      ...names.map((n) => ({ id: n, label: n })),
    ];
  }, [docs]);

  const filteredDocs = useMemo(() => {
    return docs.filter((doc) => {
      const matchesSearch =
        !searchQuery ||
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.summary.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType =
        docType === "all" || doc.type.toLowerCase().includes(docType.toLowerCase());
      const matchesSourceName =
        sourceNameFilter === "all" || doc.sourceName === sourceNameFilter;
      return matchesSearch && matchesType && matchesSourceName;
    });
  }, [docs, searchQuery, docType, sourceNameFilter]);

  return (
    <div>
      <div className="sacc-page-header">
        <div>
          <h2>Documentation & Research</h2>
          <p className="sacc-page-header__subtitle">
            Knowledge Base articles and external technical documentation sources
          </p>
        </div>
        <Badge value={filteredDocs.length} color="info" variant="primary" />
      </div>

      <div className="sacc-toolbar">
        <Input
          label="Search Documentation"
          placeholder="Search by title, topic, or keyword..."
          value={searchQuery}
          onValueSet={(e: any) => setSearchQuery(e.detail.payload.value)}
        />
        <Select
          label="Source"
          items={[
            { id: "all", label: "All Sources" },
            { id: "knowledge_base", label: "Knowledge Base (ServiceNow)" },
            { id: "external", label: "External Connector" },
          ]}
          selectedItem={sourceFilter}
          onSelectedItemSet={(e: any) => setSourceFilter(e.detail.payload.value)}
          itemsListConstrain={LIST_CONSTRAIN}
        />
        <Select
          label="Type"
          items={[
            { id: "all", label: "All Types" },
            { id: "knowledge base", label: "Knowledge Base Article" },
            { id: "servicenow official", label: "ServiceNow Official" },
            { id: "servicenow community", label: "ServiceNow Community" },
            { id: "api reference", label: "API Reference" },
            { id: "developer tools", label: "Developer Tools" },
            { id: "academic", label: "Academic & Research" },
            { id: "industry", label: "Industry Standards" },
            { id: "general", label: "General Reference" },
          ]}
          selectedItem={docType}
          onSelectedItemSet={(e: any) => setDocType(e.detail.payload.value)}
          itemsListConstrain={LIST_CONSTRAIN}
        />
        <Select
          label="Source Name"
          items={sourceNameOptions}
          selectedItem={sourceNameFilter}
          onSelectedItemSet={(e: any) => setSourceNameFilter(e.detail.payload.value)}
          search="contains"
          itemsListConstrain={{ maxHeight: 400, minWidth: 320 }}
        />
        <Button label="Search" variant="primary" size="sm" icon="magnifying-glass-outline" onClicked={handleSearch} />
      </div>

      {loading ? (
        <Loader label="Loading documentation..." />
      ) : (
        <div className="sacc-doc-panel">
          <div className="sacc-doc-panel__list">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className={`sacc-doc-item ${selectedDoc?.id === doc.id ? "sacc-doc-item--active" : ""}`}
                onClick={() => setSelectedDoc(doc)}
              >
                <div className="sacc-doc-item__title">
                  {doc.authRequired ? "🔒 " : ""}
                  {doc.title}
                </div>
                <div className="sacc-doc-item__type">
                  {doc.type} • {doc.sourceName}
                </div>
              </div>
            ))}
            {filteredDocs.length === 0 && (
              <p style={{ padding: "16px", fontSize: "13px", color: "rgb(var(--now-color--neutral-10, 79, 92, 98))" }}>
                No documentation found. Try adjusting your filters.
              </p>
            )}
          </div>

          <div className="sacc-doc-panel__preview">
            {selectedDoc ? (
              <div>
                <h3 style={{ margin: "0 0 8px", fontSize: "16px" }}>{selectedDoc.title}</h3>
                <div style={{ display: "flex", gap: "8px", marginBottom: "16px", alignItems: "center" }}>
                  <Badge value={1} color={selectedDoc.source === "knowledge_base" ? "positive" : "info"} />
                  <span style={{ fontSize: "12px", color: "rgb(var(--now-color--neutral-10, 79, 92, 98))" }}>
                    {selectedDoc.source === "knowledge_base" ? "📚 Knowledge Base" : "🌐 External"} — {selectedDoc.sourceName}
                  </span>
                  {selectedDoc.authRequired && (
                    <span style={{ fontSize: "11px", color: "rgb(198, 30, 30)" }}>🔒 Registration Required</span>
                  )}
                </div>
                <p style={{ fontSize: "13px", lineHeight: "1.6", color: "rgb(var(--now-color--neutral-12, 55, 68, 74))" }}>
                  {selectedDoc.summary}
                </p>

                <Accordion headingLevel={4}>
                  <AccordionItem header="Details" expanded>
                    <div slot="content">
                      <div className="sacc-metric-row">
                        <span className="sacc-metric-row__label">Source Type</span>
                        <span className="sacc-metric-row__value">
                          {selectedDoc.source === "knowledge_base" ? "ServiceNow Knowledge Base" : "External Connector"}
                        </span>
                      </div>
                      <div className="sacc-metric-row">
                        <span className="sacc-metric-row__label">Category</span>
                        <span className="sacc-metric-row__value">{selectedDoc.type}</span>
                      </div>
                      {selectedDoc.owner && (
                        <>
                          <div className="sacc-metric-row">
                            <span className="sacc-metric-row__label">Source Owner</span>
                            <span className="sacc-metric-row__value">{selectedDoc.owner.name}</span>
                          </div>
                          <div className="sacc-metric-row">
                            <span className="sacc-metric-row__label">About Owner</span>
                            <span className="sacc-metric-row__value" style={{ fontSize: "12px", lineHeight: "1.5" }}>{selectedDoc.owner.description}</span>
                          </div>
                        </>
                      )}
                      {selectedDoc.url && (
                        <div className="sacc-metric-row">
                          <span className="sacc-metric-row__label">URL</span>
                          <span className="sacc-metric-row__value" style={{ fontSize: "12px", wordBreak: "break-all" }}>
                            {selectedDoc.url}
                          </span>
                        </div>
                      )}
                      {selectedDoc.metadata && (
                        <>
                          {selectedDoc.metadata.number && (
                            <div className="sacc-metric-row">
                              <span className="sacc-metric-row__label">Article #</span>
                              <span className="sacc-metric-row__value">{selectedDoc.metadata.number}</span>
                            </div>
                          )}
                          {selectedDoc.metadata.author && (
                            <div className="sacc-metric-row">
                              <span className="sacc-metric-row__label">Author</span>
                              <span className="sacc-metric-row__value">{selectedDoc.metadata.author}</span>
                            </div>
                          )}
                          {selectedDoc.metadata.updated && (
                            <div className="sacc-metric-row">
                              <span className="sacc-metric-row__label">Last Updated</span>
                              <span className="sacc-metric-row__value">{selectedDoc.metadata.updated}</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </AccordionItem>
                  {selectedDoc.tags && selectedDoc.tags.length > 0 && (
                    <AccordionItem header="Tags">
                      <div slot="content">
                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                          {selectedDoc.tags.map((tag) => (
                            <span
                              key={tag}
                              style={{
                                fontSize: "11px",
                                padding: "2px 8px",
                                borderRadius: "12px",
                                backgroundColor: "rgb(var(--now-color_surface--brand-1, 229, 242, 246))",
                                color: "rgb(var(--now-color--neutral-12, 55, 68, 74))",
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </AccordionItem>
                  )}
                </Accordion>

                <div className="sacc-toolbar" style={{ marginTop: "16px" }}>
                  {selectedDoc.url && (
                    <Button label="Open Source" icon="pop-in-outline" variant="primary" size="sm" onClicked={() => window.open(selectedDoc!.url, "_blank")} />
                  )}
                  <Button label="Cite in Spec" icon="link-outline" variant="secondary" size="sm" />
                  <Button label="Add to Project" icon="document-outline" variant="tertiary" size="sm" />
                </div>
              </div>
            ) : (
              <p style={{ color: "rgb(var(--now-color--neutral-10, 79, 92, 98))" }}>
                Select a document from the list to preview its content.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
