import React, { useState } from "react";
import { Card } from "@servicenow/react-components/Card";
import { Button } from "@servicenow/react-components/Button";
import { Input } from "@servicenow/react-components/Input";
import { Select } from "@servicenow/react-components/Select";
import { Badge } from "@servicenow/react-components/Badge";
import { Accordion } from "@servicenow/react-components/Accordion";
import { AccordionItem } from "@servicenow/react-components/AccordionItem";

interface DocItem {
  id: string;
  title: string;
  type: string;
  relevance: string;
  summary: string;
}

const DOCS: DocItem[] = [
  {
    id: "1",
    title: "GlideRecord API Reference",
    type: "Technical Documentation",
    relevance: "Direct API usage",
    summary: "Complete reference for GlideRecord class including query methods, CRUD operations, and best practices for database interactions in ServiceNow.",
  },
  {
    id: "2",
    title: "Event-Driven Architecture Patterns",
    type: "Research Paper",
    relevance: "Architecture pattern",
    summary: "Academic research on event-driven architectures in enterprise platforms. Covers message queues, event buses, and asynchronous processing patterns.",
  },
  {
    id: "3",
    title: "ServiceNow Flow Designer Best Practices",
    type: "Technical Guide",
    relevance: "Workflow optimization",
    summary: "Official best practices for designing efficient flows including error handling, subflow reuse, and performance considerations.",
  },
  {
    id: "4",
    title: "Distributed Systems Error Handling",
    type: "Research Paper",
    relevance: "Error management",
    summary: "Research on fault-tolerant error handling in distributed systems with circuit breaker patterns and retry strategies.",
  },
  {
    id: "5",
    title: "ServiceNow Security ACL Guide",
    type: "Technical Documentation",
    relevance: "Security implementation",
    summary: "Comprehensive guide to Access Control Lists in ServiceNow covering table, field, and row-level security configurations.",
  },
  {
    id: "6",
    title: "Performance Optimization in ITSM Platforms",
    type: "Research Paper",
    relevance: "Performance tuning",
    summary: "Study on query optimization, caching strategies, and resource management in IT Service Management platforms.",
  },
];

export default function Documentation() {
  const [selectedDoc, setSelectedDoc] = useState<DocItem | null>(DOCS[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [docType, setDocType] = useState("");

  const filteredDocs = DOCS.filter((doc) => {
    const matchesSearch = !searchQuery || doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !docType || doc.type.toLowerCase().includes(docType.toLowerCase());
    return matchesSearch && matchesType;
  });

  return (
    <div>
      <div className="sacc-page-header">
        <div>
          <h2>Documentation & Research</h2>
          <p className="sacc-page-header__subtitle">
            Scientific research and technical documentation related to your code
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
          label="Type"
          items={[
            { id: "all", label: "All Types" },
            { id: "technical", label: "Technical Documentation" },
            { id: "research", label: "Research Papers" },
            { id: "guide", label: "Technical Guides" },
          ]}
          selectedItem={docType}
          onSelectedItemSet={(e: any) => setDocType(e.detail.payload.value)}
        />
        <Button label="Suggest Docs" variant="primary" size="sm" icon="star-fill" />
      </div>

      <div className="sacc-doc-panel">
        <div className="sacc-doc-panel__list">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className={`sacc-doc-item ${selectedDoc?.id === doc.id ? "sacc-doc-item--active" : ""}`}
              onClick={() => setSelectedDoc(doc)}
            >
              <div className="sacc-doc-item__title">{doc.title}</div>
              <div className="sacc-doc-item__type">{doc.type} • {doc.relevance}</div>
            </div>
          ))}
        </div>

        <div className="sacc-doc-panel__preview">
          {selectedDoc ? (
            <div>
              <h3 style={{ margin: "0 0 8px", fontSize: "16px" }}>{selectedDoc.title}</h3>
              <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                <Badge value={1} color="info" />
                <span style={{ fontSize: "12px", color: "rgb(var(--now-color--neutral-10, 79, 92, 98))" }}>
                  {selectedDoc.type} — {selectedDoc.relevance}
                </span>
              </div>
              <p style={{ fontSize: "13px", lineHeight: "1.6", color: "rgb(var(--now-color--neutral-12, 55, 68, 74))" }}>
                {selectedDoc.summary}
              </p>

              <Accordion headingLevel={4}>
                <AccordionItem header="Key Concepts" expanded>
                  <div slot="content">
                    <p style={{ fontSize: "13px", lineHeight: "1.6" }}>
                      This document covers fundamental concepts related to {selectedDoc.relevance.toLowerCase()}, including implementation patterns, common pitfalls, and recommended approaches for enterprise ServiceNow environments.
                    </p>
                  </div>
                </AccordionItem>
                <AccordionItem header="Code Examples">
                  <div slot="content">
                    <div className="sacc-code-block">
{`// Example pattern from documentation
var gr = new GlideRecord('table_name');
gr.addQuery('active', true);
gr.query();
while (gr.next()) {
  // Process each record
  gs.info('Processing: ' + gr.getDisplayValue());
}`}
                    </div>
                  </div>
                </AccordionItem>
                <AccordionItem header="Related Resources">
                  <div slot="content">
                    <div className="sacc-metric-row">
                      <span className="sacc-metric-row__label">ServiceNow Developer Portal</span>
                      <span className="sacc-metric-row__value">developer.servicenow.com</span>
                    </div>
                    <div className="sacc-metric-row">
                      <span className="sacc-metric-row__label">Community Knowledge Base</span>
                      <span className="sacc-metric-row__value">community.servicenow.com</span>
                    </div>
                  </div>
                </AccordionItem>
              </Accordion>

              <div className="sacc-toolbar" style={{ marginTop: "16px" }}>
                <Button label="Open Full Doc" icon="pop-in-outline" variant="primary" size="sm" />
                <Button label="Cite in Spec" icon="link-outline" variant="secondary" size="sm" />
                <Button label="Add to Project" icon="link-outline" variant="tertiary" size="sm" />
              </div>
            </div>
          ) : (
            <p style={{ color: "rgb(var(--now-color--neutral-10, 79, 92, 98))" }}>
              Select a document from the list to preview its content.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
