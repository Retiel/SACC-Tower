import React, { useState, useCallback } from "react";
import { Card } from "@servicenow/react-components/Card";
import { Button } from "@servicenow/react-components/Button";
import { Input } from "@servicenow/react-components/Input";
import { Tabs, TabsSelectedItemSet } from "@servicenow/react-components/Tabs";
import { Accordion } from "@servicenow/react-components/Accordion";
import { AccordionItem } from "@servicenow/react-components/AccordionItem";
import { Badge } from "@servicenow/react-components/Badge";

const TAB_ITEMS = [
  { id: "trace", label: "Stack Trace" },
  { id: "source", label: "Source Code" },
  { id: "context", label: "Execution Context" },
];

const STACK_TRACE = `Error: Cannot read property 'getValue' of null
    at CustomValidation.validateAssignment (sys_script_include.CustomValidation:42:18)
    at BusinessRuleEngine.executeRule (sys_script.AutoAssign:156:12)
    at GlideController.runBusinessRule (com.glide.script.GlideController:89:5)
    at GlideRecord.insert (com.glide.db.GlideRecord:234:8)
    at RESTAPIController.processRequest (sys_ws_operation.createIncident:67:3)
    at ServiceNowPlatform.handleRequest (com.glide.rest.ServiceNowPlatform:45:1)`;

const SOURCE_CODE = `// sys_script_include: CustomValidation
// Line 42 highlighted

38 │  validateAssignment: function(gr) {
39 │    var assignmentGroup = gr.getValue('assignment_group');
40 │    var assignedTo = gr.getValue('assigned_to');
41 │    
42 │    var groupGr = new GlideRecord('sys_user_group');  // ← ERROR HERE
43 │    groupGr.get(assignmentGroup);
44 │    var manager = groupGr.getValue('manager');  // groupGr is null
45 │    
46 │    if (!manager) {
47 │      gs.addErrorMessage('Group has no manager assigned');
48 │      return false;
49 │    }
50 │    return true;
51 │  }`;

export default function StackTrace() {
  const [selectedTab, setSelectedTab] = useState("trace");
  const [searchQuery, setSearchQuery] = useState("");

  const handleTabChange = useCallback<TabsSelectedItemSet>((event) => {
    setSelectedTab(event.detail.payload.value as string);
  }, []);

  return (
    <div>
      <div className="sacc-page-header">
        <div>
          <h2>Advanced Stack Trace</h2>
          <p className="sacc-page-header__subtitle">
            Deep code analysis with full execution path visibility
          </p>
        </div>
        <Badge value={3} color="critical" variant="primary" />
      </div>

      <div className="sacc-toolbar">
        <Input
          label="Search traces"
          placeholder="Enter error message, script name, or sys_id..."
          value={searchQuery}
          onValueSet={(e: any) => setSearchQuery(e.detail.payload.value)}
        />
        <Button label="Search" variant="primary" size="sm" icon="magnifying-glass-outline" />
        <Button label="Live Trace" variant="secondary" size="sm" icon="circle-fill" />
      </div>

      <Tabs items={TAB_ITEMS} selectedItem={selectedTab} onSelectedItemSet={handleTabChange} />

      {selectedTab === "trace" && (
        <Card size="md">
          <div className="sacc-card-content">
            <h3>Exception Stack Trace</h3>
            <div className="sacc-code-block" style={{ borderLeft: "3px solid rgb(198, 30, 30)" }}>
              {STACK_TRACE}
            </div>
            <div style={{ marginTop: "16px" }}>
              <Accordion headingLevel={4}>
                <AccordionItem header="Frame 1: CustomValidation.validateAssignment" caption="Line 42" expanded>
                  <div slot="content">
                    <div className="sacc-metric-row">
                      <span className="sacc-metric-row__label">Script Include</span>
                      <span className="sacc-metric-row__value">CustomValidation</span>
                    </div>
                    <div className="sacc-metric-row">
                      <span className="sacc-metric-row__label">Method</span>
                      <span className="sacc-metric-row__value">validateAssignment()</span>
                    </div>
                    <div className="sacc-metric-row">
                      <span className="sacc-metric-row__label">Line</span>
                      <span className="sacc-metric-row__value">42</span>
                    </div>
                    <div className="sacc-metric-row">
                      <span className="sacc-metric-row__label">Root Cause</span>
                      <span className="sacc-metric-row__value">GlideRecord.get() returned false (no record found)</span>
                    </div>
                  </div>
                </AccordionItem>
                <AccordionItem header="Frame 2: BusinessRuleEngine.executeRule" caption="Line 156">
                  <div slot="content">
                    <div className="sacc-metric-row">
                      <span className="sacc-metric-row__label">Business Rule</span>
                      <span className="sacc-metric-row__value">AutoAssign</span>
                    </div>
                    <div className="sacc-metric-row">
                      <span className="sacc-metric-row__label">Table</span>
                      <span className="sacc-metric-row__value">incident</span>
                    </div>
                    <div className="sacc-metric-row">
                      <span className="sacc-metric-row__label">When</span>
                      <span className="sacc-metric-row__value">before insert</span>
                    </div>
                  </div>
                </AccordionItem>
                <AccordionItem header="Frame 3: GlideController.runBusinessRule" caption="Line 89">
                  <div slot="content">
                    <div className="sacc-metric-row">
                      <span className="sacc-metric-row__label">Module</span>
                      <span className="sacc-metric-row__value">GlideController (platform)</span>
                    </div>
                    <div className="sacc-metric-row">
                      <span className="sacc-metric-row__label">Operation</span>
                      <span className="sacc-metric-row__value">insert</span>
                    </div>
                  </div>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </Card>
      )}

      {selectedTab === "source" && (
        <Card size="md">
          <div className="sacc-card-content">
            <h3>Source: CustomValidation.validateAssignment</h3>
            <div className="sacc-code-block">{SOURCE_CODE}</div>
            <div className="sacc-toolbar" style={{ marginTop: "12px" }}>
              <Button label="Open in Studio" icon="pop-in-outline" variant="secondary" size="sm" />
              <Button label="View History" icon="clock-outline" variant="tertiary" size="sm" />
              <Button label="Compare Versions" icon="compass-outline" variant="tertiary" size="sm" />
            </div>
          </div>
        </Card>
      )}

      {selectedTab === "context" && (
        <Card size="md">
          <div className="sacc-card-content">
            <h3>Execution Context</h3>
            <div className="sacc-metric-row">
              <span className="sacc-metric-row__label">Session User</span>
              <span className="sacc-metric-row__value">admin</span>
            </div>
            <div className="sacc-metric-row">
              <span className="sacc-metric-row__label">Application Scope</span>
              <span className="sacc-metric-row__value">x_custom_app</span>
            </div>
            <div className="sacc-metric-row">
              <span className="sacc-metric-row__label">Domain</span>
              <span className="sacc-metric-row__value">global</span>
            </div>
            <div className="sacc-metric-row">
              <span className="sacc-metric-row__label">Transaction ID</span>
              <span className="sacc-metric-row__value">8a4f2b1c3d5e6f7g</span>
            </div>
            <div className="sacc-metric-row">
              <span className="sacc-metric-row__label">Memory (heap)</span>
              <span className="sacc-metric-row__value">142 MB / 512 MB</span>
            </div>
            <div className="sacc-metric-row">
              <span className="sacc-metric-row__label">Execution Time</span>
              <span className="sacc-metric-row__value">2,334 ms</span>
            </div>
            <div className="sacc-metric-row">
              <span className="sacc-metric-row__label">DB Queries</span>
              <span className="sacc-metric-row__value">14 queries (total 89ms)</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
