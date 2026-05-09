import React, { useState, useCallback } from "react";
import { Card } from "@servicenow/react-components/Card";
import { Button } from "@servicenow/react-components/Button";
import { Tabs, TabsSelectedItemSet } from "@servicenow/react-components/Tabs";
import { ProgressBar } from "@servicenow/react-components/ProgressBar";
import { Select } from "@servicenow/react-components/Select";
import { Badge } from "@servicenow/react-components/Badge";

const TAB_ITEMS = [
  { id: "execution", label: "Execution Time" },
  { id: "storage", label: "Storage Metrics" },
  { id: "e2e", label: "End-to-End" },
  { id: "p2p", label: "Point-to-Point" },
];

const EXECUTION_METRICS = [
  { name: "Incident Create Flow", avg: "234ms", p95: "456ms", p99: "892ms", load: 0.45 },
  { name: "Change Approval", avg: "1.2s", p95: "3.4s", p99: "5.1s", load: 0.78 },
  { name: "CMDB Discovery", avg: "567ms", p95: "1.1s", p99: "2.3s", load: 0.55 },
  { name: "User Provisioning", avg: "890ms", p95: "2.1s", p99: "4.2s", load: 0.67 },
  { name: "Email Notification", avg: "45ms", p95: "120ms", p99: "250ms", load: 0.12 },
];

const STORAGE_METRICS = [
  { table: "incident", records: "1.2M", size: "4.8 GB", growth: "+2.3%/mo" },
  { table: "sys_audit", records: "45.6M", size: "128 GB", growth: "+8.7%/mo" },
  { table: "cmdb_ci", records: "890K", size: "3.2 GB", growth: "+1.1%/mo" },
  { table: "sc_req_item", records: "2.1M", size: "6.7 GB", growth: "+3.4%/mo" },
  { table: "sys_attachment", records: "567K", size: "89 GB", growth: "+5.2%/mo" },
];

export default function Performance() {
  const [selectedTab, setSelectedTab] = useState("execution");
  const [timeRange, setTimeRange] = useState("");

  const handleTabChange = useCallback<TabsSelectedItemSet>((event) => {
    setSelectedTab(event.detail.payload.value as string);
  }, []);

  return (
    <div>
      <div className="sacc-page-header">
        <div>
          <h2>Performance Measurement</h2>
          <p className="sacc-page-header__subtitle">
            Execution time and storage metrics for all custom processes
          </p>
        </div>
        <Button label="Run Benchmark" icon="chart-line-outline" variant="primary" size="sm" />
      </div>

      <div className="sacc-toolbar">
        <Select
          label="Time Range"
          items={[
            { id: "1h", label: "Last Hour" },
            { id: "24h", label: "Last 24 Hours" },
            { id: "7d", label: "Last 7 Days" },
            { id: "30d", label: "Last 30 Days" },
          ]}
          selectedItem={timeRange}
          onSelectedItemSet={(e: any) => setTimeRange(e.detail.payload.value)}
        />
        <Button label="Export Report" icon="download-outline" variant="secondary" size="sm" />
      </div>

      <Tabs items={TAB_ITEMS} selectedItem={selectedTab} onSelectedItemSet={handleTabChange} />

      {selectedTab === "execution" && (
        <div className="sacc-section">
          {EXECUTION_METRICS.map((metric) => (
            <Card key={metric.name} size="sm" style={{ marginBottom: "8px" }}>
              <div className="sacc-card-content">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <h3 style={{ margin: 0, fontSize: "14px" }}>{metric.name}</h3>
                  <Badge value={Math.round(metric.load * 100)} character="%" color={metric.load > 0.7 ? "warning" : "positive"} />
                </div>
                <ProgressBar label={`Avg: ${metric.avg} | P95: ${metric.p95} | P99: ${metric.p99}`} value={metric.load} pathType={metric.load > 0.7 ? "alert" : "positive"} size="sm" />
              </div>
            </Card>
          ))}
        </div>
      )}

      {selectedTab === "storage" && (
        <div className="sacc-section">
          <Card size="md">
            <div className="sacc-card-content">
              <h3>Table Storage Analysis</h3>
              {STORAGE_METRICS.map((metric) => (
                <div key={metric.table} className="sacc-metric-row">
                  <div>
                    <span className="sacc-metric-row__label" style={{ fontWeight: 600, color: "rgb(var(--now-color--neutral-12, 55, 68, 74))" }}>
                      {metric.table}
                    </span>
                    <br />
                    <span className="sacc-metric-row__label">{metric.records} records</span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span className="sacc-metric-row__value">{metric.size}</span>
                    <br />
                    <span className="sacc-metric-row__label">{metric.growth}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card size="md" style={{ marginTop: "12px" }}>
            <div className="sacc-card-content">
              <h3>Total Storage Utilization</h3>
              <ProgressBar label="Used: 231.7 GB / 500 GB" value={0.463} pathType="initial" size="lg" />
            </div>
          </Card>
        </div>
      )}

      {selectedTab === "e2e" && (
        <div className="sacc-section">
          <Card size="md">
            <div className="sacc-card-content">
              <h3>End-to-End Process Performance</h3>
              <p>Complete process execution from trigger to completion</p>
              <div className="sacc-metric-row">
                <span className="sacc-metric-row__label">Incident Resolution (full cycle)</span>
                <span className="sacc-metric-row__value">Avg: 4.2 hours</span>
              </div>
              <div className="sacc-metric-row">
                <span className="sacc-metric-row__label">Change Implementation</span>
                <span className="sacc-metric-row__value">Avg: 18.5 hours</span>
              </div>
              <div className="sacc-metric-row">
                <span className="sacc-metric-row__label">Service Request Fulfillment</span>
                <span className="sacc-metric-row__value">Avg: 6.8 hours</span>
              </div>
              <div className="sacc-metric-row">
                <span className="sacc-metric-row__label">User Onboarding (complete)</span>
                <span className="sacc-metric-row__value">Avg: 2.1 days</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {selectedTab === "p2p" && (
        <div className="sacc-section">
          <Card size="md">
            <div className="sacc-card-content">
              <h3>Point-to-Point Measurements</h3>
              <p>Performance between specific integration points</p>
              <div className="sacc-metric-row">
                <span className="sacc-metric-row__label">REST API → Business Rule</span>
                <span className="sacc-metric-row__value">12ms</span>
              </div>
              <div className="sacc-metric-row">
                <span className="sacc-metric-row__label">Business Rule → Flow Engine</span>
                <span className="sacc-metric-row__value">34ms</span>
              </div>
              <div className="sacc-metric-row">
                <span className="sacc-metric-row__label">Flow Engine → Script Include</span>
                <span className="sacc-metric-row__value">8ms</span>
              </div>
              <div className="sacc-metric-row">
                <span className="sacc-metric-row__label">Script Include → GlideRecord</span>
                <span className="sacc-metric-row__value">67ms</span>
              </div>
              <div className="sacc-metric-row">
                <span className="sacc-metric-row__label">GlideRecord → Database</span>
                <span className="sacc-metric-row__value">23ms</span>
              </div>
              <div className="sacc-metric-row">
                <span className="sacc-metric-row__label">Event Queue → Notification</span>
                <span className="sacc-metric-row__value">145ms</span>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
