import React, { useState, useCallback } from "react";
import { Card } from "@servicenow/react-components/Card";
import { Button } from "@servicenow/react-components/Button";
import { Tabs, TabsSelectedItemSet } from "@servicenow/react-components/Tabs";
import { Select } from "@servicenow/react-components/Select";
import { Textarea } from "@servicenow/react-components/Textarea";

const TAB_ITEMS = [
  { id: "uml", label: "UML Diagram" },
  { id: "technical", label: "Technical Spec" },
  { id: "export", label: "Export" },
];

const UML_DIAGRAM = `┌─────────────────────┐     ┌──────────────────────┐
│    <<Interface>>    │     │    ServiceCatalog     │
│   RequestHandler    │     │                      │
├─────────────────────┤     ├──────────────────────┤
│ + handleRequest()   │────▶│ + submitRequest()    │
│ + validateInput()   │     │ + getApprovals()     │
│ + formatResponse()  │     │ + fulfill()          │
└─────────────────────┘     └──────────┬───────────┘
                                       │
                                       │ extends
                                       ▼
                            ┌──────────────────────┐
                            │   CustomCatalogItem   │
                            ├──────────────────────┤
                            │ - variables: Map     │
                            │ - workflow: Flow     │
                            ├──────────────────────┤
                            │ + onSubmit()         │
                            │ + validate()         │
                            │ + notifyApprover()   │
                            └──────────────────────┘`;

const TECH_SPEC = `# Technical Specification: Custom Catalog Fulfillment

## 1. Overview
This module handles end-to-end catalog item fulfillment including
request validation, approval routing, and task generation.

## 2. Architecture
- Pattern: Event-Driven Service Bus
- Protocol: REST/JSON over HTTPS
- Auth: OAuth 2.0 with token refresh

## 3. Data Model
- sc_req_item: Primary request record
- sc_task: Fulfillment tasks (1:N)
- approval_approver: Approval records

## 4. Interfaces
- RequestHandler: Entry point for all requests
- ApprovalEngine: Multi-level approval routing
- FulfillmentWorker: Task execution engine

## 5. Performance Requirements
- Response time: < 200ms (p95)
- Throughput: 500 req/sec sustained
- Storage: < 2KB per request record`;

export default function SpecGenerator() {
  const [selectedTab, setSelectedTab] = useState("uml");
  const [exportFormat, setExportFormat] = useState("");

  const handleTabChange = useCallback<TabsSelectedItemSet>((event) => {
    setSelectedTab(event.detail.payload.value as string);
  }, []);

  return (
    <div>
      <div className="sacc-page-header">
        <div>
          <h2>Spec Generator</h2>
          <p className="sacc-page-header__subtitle">
            UML diagrams and technical specification generator with multi-format export
          </p>
        </div>
        <div className="sacc-export-options">
          <Button label="Generate" icon="star-fill" variant="primary" size="sm" />
        </div>
      </div>

      <Tabs items={TAB_ITEMS} selectedItem={selectedTab} onSelectedItemSet={handleTabChange} />

      {selectedTab === "uml" && (
        <div className="sacc-section">
          <Card size="md">
            <div className="sacc-card-content">
              <h3>Class Diagram — Catalog Fulfillment</h3>
              <div className="sacc-code-block">{UML_DIAGRAM}</div>
            </div>
          </Card>
          <div className="sacc-toolbar" style={{ marginTop: "12px" }}>
            <Button label="Sequence Diagram" variant="secondary" size="sm" />
            <Button label="Class Diagram" variant="primary" size="sm" />
            <Button label="Activity Diagram" variant="secondary" size="sm" />
            <Button label="Component Diagram" variant="secondary" size="sm" />
          </div>
        </div>
      )}

      {selectedTab === "technical" && (
        <div className="sacc-section">
          <Card size="md">
            <div className="sacc-card-content">
              <div className="sacc-code-block">{TECH_SPEC}</div>
            </div>
          </Card>
          <div className="sacc-toolbar" style={{ marginTop: "12px" }}>
            <Button label="Edit Spec" icon="pencil-outline" variant="secondary" size="sm" />
            <Button label="Regenerate" icon="circle-arrow-down-outline" variant="tertiary" size="sm" />
          </div>
        </div>
      )}

      {selectedTab === "export" && (
        <div className="sacc-section">
          <Card size="md">
            <div className="sacc-card-content">
              <h3>Export Options</h3>
              <p>Generate and download documentation in your preferred format</p>
              <div style={{ marginTop: "16px" }}>
                <Select
                  label="Export Format"
                  items={[
                    { id: "pdf", label: "PDF Document" },
                    { id: "docx", label: "Word Document (.docx)" },
                    { id: "html", label: "HTML Page" },
                    { id: "md", label: "Markdown" },
                  ]}
                  selectedItem={exportFormat}
                  onSelectedItemSet={(e: any) => setExportFormat(e.detail.payload.value)}
                />
              </div>
              <div className="sacc-toolbar" style={{ marginTop: "16px" }}>
                <Button label="Export UML Diagram" icon="download-outline" variant="primary" size="md" />
                <Button label="Export Technical Spec" icon="download-outline" variant="secondary" size="md" />
                <Button label="Export Full Package" icon="download-outline" variant="secondary" size="md" />
              </div>
            </div>
          </Card>

          <Card size="md" style={{ marginTop: "16px" }}>
            <div className="sacc-card-content">
              <h3>Recent Exports</h3>
              <div className="sacc-metric-row">
                <span className="sacc-metric-row__label">CatalogFulfillment_Spec.pdf</span>
                <span className="sacc-metric-row__value">Today, 10:32 AM</span>
              </div>
              <div className="sacc-metric-row">
                <span className="sacc-metric-row__label">IncidentFlow_UML.html</span>
                <span className="sacc-metric-row__value">Yesterday, 4:15 PM</span>
              </div>
              <div className="sacc-metric-row">
                <span className="sacc-metric-row__label">UserProvisioning_TechSpec.docx</span>
                <span className="sacc-metric-row__value">Jan 12, 2024</span>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
