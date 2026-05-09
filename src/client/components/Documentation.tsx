import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Card } from "@servicenow/react-components/Card";
import { Button } from "@servicenow/react-components/Button";
import { Input } from "@servicenow/react-components/Input";
import { Select } from "@servicenow/react-components/Select";
import { Badge } from "@servicenow/react-components/Badge";
import { Accordion } from "@servicenow/react-components/Accordion";
import { AccordionItem } from "@servicenow/react-components/AccordionItem";
import { Loader } from "@servicenow/react-components/Loader";
import { Modal } from "@servicenow/react-components/Modal";
import { Textarea } from "@servicenow/react-components/Textarea";
import { Checkbox } from "@servicenow/react-components/Checkbox";
import { Typeahead } from "@servicenow/react-components/Typeahead";
import {
  fetchAllDocumentation,
  DocItem,
  DocSource,
} from "../services/DocumentationService";
import { getEnabledSources, DOC_SOURCES, SourceOwner, ExternalSource, SourceCategory, CATEGORY_LABELS } from "../config/doc-sources";

const LIST_CONSTRAIN = { maxHeight: 400, minWidth: 280 };

interface NewSourceForm {
  name: string;
  description: string;
  baseUrl: string;
  category: string;
  authRequired: boolean;
  ownerName: string;
  ownerDescription: string;
}

const EMPTY_FORM: NewSourceForm = {
  name: "",
  description: "",
  baseUrl: "",
  category: "general_reference",
  authRequired: false,
  ownerName: "",
  ownerDescription: "",
};

/** Collect all unique tags from existing sources */
function getAllExistingTags(): string[] {
  const tags = new Set<string>();
  DOC_SOURCES.forEach((s) => s.tags.forEach((t) => tags.add(t)));
  return [...tags].sort();
}

export default function Documentation() {
  const [docs, setDocs] = useState<DocItem[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<DocItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [docType, setDocType] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [sourceNameFilter, setSourceNameFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // Add Source Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<NewSourceForm>({ ...EMPTY_FORM });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagInputValue, setTagInputValue] = useState("");
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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

  // --- Modal Handlers ---
  function openAddSourceModal() {
    setForm({ ...EMPTY_FORM });
    setSelectedTags([]);
    setTagInputValue("");
    setFormErrors([]);
    setSubmitSuccess(false);
    setModalOpen(true);
  }

  function validateForm(): string[] {
    const errors: string[] = [];
    if (!form.name.trim()) errors.push("Source Name is required");
    if (!form.description.trim()) errors.push("Description is required");
    if (!form.baseUrl.trim()) errors.push("URL is required");
    if (!form.baseUrl.trim().startsWith("http")) errors.push("URL must start with http:// or https://");
    if (!form.category) errors.push("Category is required");
    if (selectedTags.length === 0) errors.push("At least one tag is required");
    if (!form.ownerName.trim()) errors.push("Owner Name is required");
    if (!form.ownerDescription.trim()) errors.push("Owner Description is required");
    return errors;
  }

  function handleSubmit() {
    const errors = validateForm();
    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }

    const newSource: ExternalSource = {
      id: `user-${Date.now()}`,
      name: form.name.trim(),
      description: form.description.trim(),
      baseUrl: form.baseUrl.trim(),
      category: form.category as SourceCategory,
      tags: selectedTags,
      enabled: true,
      authRequired: form.authRequired,
      authConfig: form.authRequired ? { type: "session", registrationNotes: "Registration required." } : { type: "none" },
      owner: { name: form.ownerName.trim(), description: form.ownerDescription.trim() },
      lastVerified: new Date().toISOString().split("T")[0],
      priority: 3,
    };

    // Register in the runtime DOC_SOURCES array
    DOC_SOURCES.push(newSource);

    setFormErrors([]);
    setSubmitSuccess(true);

    // Refresh the documentation list after short delay to show feedback
    setTimeout(() => {
      setModalOpen(false);
      setSubmitSuccess(false);
      loadDocs();
    }, 1500);
  }

  const handleModalOpenedSet = useCallback((e: any) => {
    setModalOpen(e.detail.payload.value);
  }, []);

  const handleFooterAction = useCallback((e: any) => {
    const action = e.detail.payload.action;
    if (action.label === "Cancel") {
      setModalOpen(false);
    } else if (action.label === "Submit") {
      handleSubmit();
    }
  }, [form, selectedTags]);

  // Source name options
  const sourceNameOptions = useMemo(() => {
    const names = [...new Set(docs.map((d) => d.sourceName))];
    return [
      { id: "all", label: "All Sources" },
      ...names.map((n) => ({ id: n, label: n })),
    ];
  }, [docs]);

  // Client-side filtering
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
        <Button label="Add Source" variant="secondary" size="sm" icon="plus-outline" onClicked={openAddSourceModal} />
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

      {/* Add Source Modal */}
      <Modal
        opened={modalOpen}
        size="lg"
        headerLabel="Register New Documentation Source"
        footerActions={[
          { label: "Cancel", variant: "secondary" },
          { label: "Submit", variant: "primary", icon: "check-outline" },
        ]}
        onOpenedSet={handleModalOpenedSet}
        onFooterActionClicked={handleFooterAction}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", padding: "8px 0" }}>
          {submitSuccess && (
            <div style={{ padding: "12px 16px", borderRadius: "4px", backgroundColor: "rgb(var(--now-color--alert-positive-1, 223, 240, 216))", color: "rgb(var(--now-color--alert-positive-3, 42, 100, 25))", fontSize: "13px", fontWeight: 600 }}>
              ✅ Source registered successfully! Refreshing documentation list...
            </div>
          )}
          {formErrors.length > 0 && (
            <div style={{ padding: "12px 16px", borderRadius: "4px", backgroundColor: "rgb(var(--now-color--alert-critical-1, 253, 226, 226))", color: "rgb(var(--now-color--alert-critical-3, 150, 20, 20))", fontSize: "12px" }}>
              <strong>Please fix the following:</strong>
              <ul style={{ margin: "6px 0 0", paddingLeft: "18px" }}>
                {formErrors.map((err, i) => <li key={i}>{err}</li>)}
              </ul>
            </div>
          )}

          <Input
            label="Source Name *"
            placeholder="e.g., MIT Libraries"
            value={form.name}
            onValueSet={(e: any) => setForm({ ...form, name: e.detail.payload.value })}
          />
          <Textarea
            label="Description *"
            placeholder="Brief description of what this source provides..."
            value={form.description}
            onValueSet={(e: any) => setForm({ ...form, description: e.detail.payload.value })}
          />
          <Input
            label="URL *"
            placeholder="https://example.com/documentation"
            value={form.baseUrl}
            onValueSet={(e: any) => setForm({ ...form, baseUrl: e.detail.payload.value })}
          />
          <Select
            label="Category *"
            items={[
              { id: "servicenow_official", label: "ServiceNow Official" },
              { id: "servicenow_community", label: "ServiceNow Community" },
              { id: "api_reference", label: "API Reference" },
              { id: "developer_tools", label: "Developer Tools" },
              { id: "academic_research", label: "Academic & Research" },
              { id: "industry_standards", label: "Industry Standards" },
              { id: "general_reference", label: "General Reference" },
            ]}
            selectedItem={form.category}
            onSelectedItemSet={(e: any) => setForm({ ...form, category: e.detail.payload.value })}
            itemsListConstrain={{ maxHeight: 300, minWidth: 280 }}
          />
          <div>
            <Typeahead
              label="Tags * (select existing or type new)"
              items={getAllExistingTags().filter((t) => !selectedTags.includes(t)).map((t) => ({ id: t, label: t }))}
              value={tagInputValue}
              search="contains"
              placeholder="Type to search or add a new tag..."
              helperContent="Select an existing tag or type a new one and press Enter"
              itemsListConstrain={{ maxHeight: 200, minWidth: 280 }}
              onValueSet={(e: any) => setTagInputValue(e.detail.payload.value)}
              onSelectedItemSet={(e: any) => {
                const tag = String(e.detail.payload.value).trim().toLowerCase();
                if (tag && !selectedTags.includes(tag)) {
                  setSelectedTags([...selectedTags, tag]);
                }
                setTagInputValue("");
              }}
              onEnterKeydown={(e: any) => {
                const tag = String(e.detail.payload.value).trim().toLowerCase();
                if (tag && !selectedTags.includes(tag)) {
                  setSelectedTags([...selectedTags, tag]);
                }
                setTagInputValue("");
              }}
            />
            {selectedTags.length > 0 && (
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "8px" }}>
                {selectedTags.map((tag) => (
                  <span
                    key={tag}
                    style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "12px", padding: "3px 10px", borderRadius: "12px", backgroundColor: "rgb(var(--now-color_surface--brand-1, 229, 242, 246))", color: "rgb(var(--now-color--neutral-12, 55, 68, 74))" }}
                  >
                    {tag}
                    <span
                      style={{ cursor: "pointer", fontWeight: 700, fontSize: "14px", lineHeight: 1, marginLeft: "2px" }}
                      onClick={() => setSelectedTags(selectedTags.filter((t) => t !== tag))}
                    >
                      ×
                    </span>
                  </span>
                ))}
              </div>
            )}
          </div>
          <Checkbox
            label="Requires registration / authentication"
            checked={form.authRequired}
            onCheckedSet={(e: any) => setForm({ ...form, authRequired: e.detail.payload.value })}
          />
          <div style={{ borderTop: "1px solid rgb(var(--now-color--divider-secondary, 218, 222, 224))", paddingTop: "16px" }}>
            <p style={{ fontSize: "13px", fontWeight: 600, margin: "0 0 12px", color: "rgb(var(--now-color--neutral-12, 55, 68, 74))" }}>Source Owner Information</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <Input
                label="Owner Name *"
                placeholder="e.g., Massachusetts Institute of Technology (MIT)"
                value={form.ownerName}
                onValueSet={(e: any) => setForm({ ...form, ownerName: e.detail.payload.value })}
              />
              <Textarea
                label="Owner Description *"
                placeholder="Short description of the owner entity (organization, university, company)..."
                value={form.ownerDescription}
                onValueSet={(e: any) => setForm({ ...form, ownerDescription: e.detail.payload.value })}
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
