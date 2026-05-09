import React from "react";
import { NowRecordListConnected } from "@servicenow/react-components/NowRecordListConnected";
import { Card } from "@servicenow/react-components/Card";
import { Badge } from "@servicenow/react-components/Badge";

interface ScopeManagerProps {
  navigateToView: (view: string, id?: string | null, opts?: { title?: string }) => void;
}

export default function ScopeManager({ navigateToView }: ScopeManagerProps) {
  return (
    <div>
      <div className="sacc-page-header">
        <div>
          <h2>Scope Manager</h2>
          <p className="sacc-page-header__subtitle">
            Control, monitor, and maintain all custom application scopes
          </p>
        </div>
        <Badge value={12} color="info" variant="primary" />
      </div>

      <div className="sacc-grid--3col sacc-grid">
        <Card size="sm" sidebar={{ color: "positive", variant: "primary" }}>
          <div className="sacc-stat">
            <span className="sacc-stat__value">9</span>
            <span className="sacc-stat__label">Active Scopes</span>
          </div>
        </Card>
        <Card size="sm" sidebar={{ color: "warning", variant: "primary" }}>
          <div className="sacc-stat">
            <span className="sacc-stat__value">2</span>
            <span className="sacc-stat__label">Pending Review</span>
          </div>
        </Card>
        <Card size="sm" sidebar={{ color: "critical", variant: "primary" }}>
          <div className="sacc-stat">
            <span className="sacc-stat__value">1</span>
            <span className="sacc-stat__label">Errors Detected</span>
          </div>
        </Card>
      </div>

      <div className="sacc-section">
        <NowRecordListConnected
          table="sys_scope"
          key="privateISNOTEMPTY"
          listTitle="Custom Application Scopes"
          columns="name,scope,version,short_description,active"
          limit={20}
          onRowClicked={(e: any) => {
            const sysId = e.detail?.payload?.sys_id;
            if (sysId) {
              navigateToView("scopes", sysId, { title: "SACC - Scope Detail" });
            }
          }}
          hideHeader={false}
        />
      </div>
    </div>
  );
}
