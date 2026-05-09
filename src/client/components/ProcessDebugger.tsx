import React, { useState, useCallback } from "react";
import { Card } from "@servicenow/react-components/Card";
import { CardHeader } from "@servicenow/react-components/CardHeader";
import { Button } from "@servicenow/react-components/Button";
import { Select } from "@servicenow/react-components/Select";
import { Tabs, TabsSelectedItemSet } from "@servicenow/react-components/Tabs";
import { Accordion } from "@servicenow/react-components/Accordion";
import { AccordionItem } from "@servicenow/react-components/AccordionItem";
import { Badge } from "@servicenow/react-components/Badge";
import { HighlightedValue } from "@servicenow/react-components/HighlightedValue";

const PROCESS_STEPS = [
  { id: 1, label: "Trigger", status: "complete" },
  { id: 2, label: "Business Rule", status: "complete" },
  { id: 3, label: "Flow Action", status: "active" },
  { id: 4, label: "Script Include", status: "error" },
  { id: 5, label: "Notification", status: "pending" },
  { id: 6, label: "Response", status: "pending" },
];

const TAB_ITEMS = [
  { id: "flow", label: "Process Flow" },
  { id: "logs", label: "Execution Logs" },
  { id: "variables", label: "Variables" },
  { id: "timeline", label: "Timeline" },
];

export default function ProcessDebugger() {
  const [selectedTab, setSelectedTab] = useState("flow");
  const [selectedProcess, setSelectedProcess] = useState("");

  const handleTabChange = useCallback<TabsSelectedItemSet>((event) => {
    setSelectedTab(event.detail.payload.value as string);
  }, []);

  return (
    <div>
      <div className="sacc-page-header">
        <div>
          <h2>Process Debugger</h2>
          <p className="sacc-page-header__subtitle">
            End-to-end visibility of processes for issue diagnosis
          </p>
        </div>
        <Button label="Start Debug Session" icon="bug-outline" variant="primary" size="md" />
      </div>

      <div className="sacc-toolbar">
        <Select
          label="Select Process"
          items={[
            { id: "inc-create", label: "Incident Creation Flow" },
            { id: "change-approval", label: "Change Approval Process" },
            { id: "catalog-fulfill", label: "Catalog Item Fulfillment" },
            { id: "user-provision", label: "User Provisioning" },
          ]}
          selectedItem={selectedProcess}
          onSelectedItemSet={(e: any) => setSelectedProcess(e.detail.payload.value)}
        />
        <Button label="Analyze" variant="primary" size="sm" icon="magnifying-glass-outline" />
        <Button label="Clear" variant="tertiary" size="sm" />
      </div>

      <Card size="md">
        <div className="sacc-card-content">
          <h3>Process Execution Flow</h3>
          <div className="sacc-process-flow">
            {PROCESS_STEPS.map((step, idx) => (
              <React.Fragment key={step.id}>
                <div className="sacc-process-step">
                  <div className={`sacc-process-step__node sacc-process-step__node--${step.status}`}>
                    {step.id}
                  </div>
                  <span className="sacc-process-step__label">{step.label}</span>
                </div>
                {idx < PROCESS_STEPS.length - 1 && <div className="sacc-process-connector" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </Card>

      <div className="sacc-section" style={{ marginTop: "16px" }}>
        <Tabs items={TAB_ITEMS} selectedItem={selectedTab} onSelectedItemSet={handleTabChange} />

        {selectedTab === "flow" && (
          <Card size="md">
            <Accordion headingLevel={3}>
              <AccordionItem header="Step 1: Record Trigger" caption="Completed in 12ms" expanded>
                <div slot="content">
                  <HighlightedValue label="Success" color="positive" size="sm" slot="metadata" />
                  <div className="sacc-code-block">
{`Event: sys_trigger.insert
Table: incident
Condition: priority == 1
Execution Time: 12ms
Status: Complete`}
                  </div>
                </div>
              </AccordionItem>
              <AccordionItem header="Step 2: Business Rule - Auto Assignment" caption="Completed in 34ms">
                <div slot="content">
                  <div className="sacc-code-block">
{`Script: AssignmentRules.execute()
Table: incident
When: after insert
Execution Time: 34ms
Status: Complete`}
                  </div>
                </div>
              </AccordionItem>
              <AccordionItem header="Step 3: Flow Action - Approval" caption="In Progress">
                <div slot="content">
                  <div className="sacc-code-block">
{`Flow: Incident Approval v2.1
Action: Request Manager Approval
Current State: Waiting for approval
Duration: 2m 14s (running)
Assigned To: Manager Group`}
                  </div>
                </div>
              </AccordionItem>
              <AccordionItem header="Step 4: Script Include - Validation" caption="Error detected">
                <div slot="content">
                  <div className="sacc-code-block" style={{ borderColor: "rgb(198, 30, 30)" }}>
{`ERROR at line 42: validateAssignment()
TypeError: Cannot read property 'getValue' of null
Script: CustomValidation
Stack: CustomValidation.validateAssignment:42
       BusinessRuleEngine.execute:156
       GlideController.run:89`}
                  </div>
                </div>
              </AccordionItem>
            </Accordion>
          </Card>
        )}

        {selectedTab === "logs" && (
          <Card size="md">
            <div className="sacc-code-block">
{`[2024-01-15 14:32:01.123] INFO  - Process initiated: INC0010045
[2024-01-15 14:32:01.135] INFO  - Business Rule triggered: Auto Assignment
[2024-01-15 14:32:01.169] INFO  - Assignment group resolved: Network Support
[2024-01-15 14:32:01.201] INFO  - Flow action started: Approval Request
[2024-01-15 14:32:03.415] WARN  - Approval timeout threshold approaching
[2024-01-15 14:32:03.456] ERROR - Script Include validation failed
[2024-01-15 14:32:03.456] ERROR - CustomValidation.validateAssignment:42
[2024-01-15 14:32:03.457] ERROR - TypeError: Cannot read property 'getValue' of null
[2024-01-15 14:32:03.458] INFO  - Process paused at Step 4 due to error`}
            </div>
          </Card>
        )}

        {selectedTab === "variables" && (
          <Card size="md">
            <div className="sacc-card-content">
              <div className="sacc-metric-row">
                <span className="sacc-metric-row__label">current.number</span>
                <span className="sacc-metric-row__value">INC0010045</span>
              </div>
              <div className="sacc-metric-row">
                <span className="sacc-metric-row__label">current.priority</span>
                <span className="sacc-metric-row__value">1 - Critical</span>
              </div>
              <div className="sacc-metric-row">
                <span className="sacc-metric-row__label">current.assignment_group</span>
                <span className="sacc-metric-row__value">Network Support</span>
              </div>
              <div className="sacc-metric-row">
                <span className="sacc-metric-row__label">current.assigned_to</span>
                <span className="sacc-metric-row__value">null (unassigned)</span>
              </div>
              <div className="sacc-metric-row">
                <span className="sacc-metric-row__label">workflow.scratchpad.approval_state</span>
                <span className="sacc-metric-row__value">requested</span>
              </div>
            </div>
          </Card>
        )}

        {selectedTab === "timeline" && (
          <Card size="md">
            <div className="sacc-card-content">
              <div className="sacc-metric-row">
                <span className="sacc-metric-row__label">14:32:01.123 — Process Start</span>
                <span className="sacc-metric-row__value">0ms</span>
              </div>
              <div className="sacc-metric-row">
                <span className="sacc-metric-row__label">14:32:01.135 — BR Triggered</span>
                <span className="sacc-metric-row__value">+12ms</span>
              </div>
              <div className="sacc-metric-row">
                <span className="sacc-metric-row__label">14:32:01.169 — BR Complete</span>
                <span className="sacc-metric-row__value">+46ms</span>
              </div>
              <div className="sacc-metric-row">
                <span className="sacc-metric-row__label">14:32:01.201 — Flow Started</span>
                <span className="sacc-metric-row__value">+78ms</span>
              </div>
              <div className="sacc-metric-row">
                <span className="sacc-metric-row__label">14:32:03.456 — Error at Step 4</span>
                <span className="sacc-metric-row__value">+2333ms</span>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
