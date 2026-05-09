import React from "react";
import { Card } from "@servicenow/react-components/Card";
import { CardHeader } from "@servicenow/react-components/CardHeader";
import { Badge } from "@servicenow/react-components/Badge";
import { ProgressBar } from "@servicenow/react-components/ProgressBar";
import { Button } from "@servicenow/react-components/Button";

interface DashboardProps {
  navigateToView: (view: string, id?: string | null, opts?: { title?: string }) => void;
}

export default function Dashboard({ navigateToView }: DashboardProps) {
  return (
    <div>
      <div className="sacc-page-header">
        <div>
          <h2>Command Center Dashboard</h2>
          <p className="sacc-page-header__subtitle">
            System overview and quick access to all admin tools
          </p>
        </div>
        <Button
          label="Refresh Data"
          icon="circle-arrow-down-outline"
          variant="secondary"
          size="sm"
          onClicked={() => window.location.reload()}
        />
      </div>

      <div className="sacc-grid--3col sacc-grid">
        <Card size="md">
          <div className="sacc-stat">
            <span className="sacc-stat__value">12</span>
            <span className="sacc-stat__label">Custom Scopes</span>
          </div>
        </Card>
        <Card size="md" sidebar={{ color: "positive", variant: "primary" }}>
          <div className="sacc-stat">
            <span className="sacc-stat__value">98.7%</span>
            <span className="sacc-stat__label">System Uptime</span>
          </div>
        </Card>
        <Card size="md" sidebar={{ color: "warning", variant: "primary" }}>
          <div className="sacc-stat">
            <span className="sacc-stat__value">3</span>
            <span className="sacc-stat__label">Active Issues</span>
          </div>
        </Card>
      </div>

      <div className="sacc-section">
        <h3 className="sacc-section__title">System Health</h3>
        <Card size="md">
          <div className="sacc-card-content">
            <ProgressBar label="CPU Usage" value={0.42} pathType="positive" size="md" />
            <ProgressBar label="Memory Usage" value={0.67} pathType="initial" size="md" />
            <ProgressBar label="Storage Capacity" value={0.81} pathType="alert" size="md" />
          </div>
        </Card>
      </div>

      <div className="sacc-section">
        <h3 className="sacc-section__title">Quick Actions</h3>
        <div className="sacc-grid">
          <Card
            interaction="click"
            size="md"
            sidebar={{ color: "blue", variant: "primary" }}
            configAria={{ button: { "aria-label": "Navigate to Scope Manager" } }}
            onClicked={() => navigateToView("scopes", null, { title: "SACC - Scope Manager" })}
          >
            <div className="sacc-card-content">
              <h3>Manage Scopes</h3>
              <p>View, monitor, and control all custom application scopes</p>
            </div>
          </Card>
          <Card
            interaction="click"
            size="md"
            sidebar={{ color: "purple", variant: "primary" }}
            configAria={{ button: { "aria-label": "Navigate to Process Debugger" } }}
            onClicked={() => navigateToView("debugger", null, { title: "SACC - Process Debugger" })}
          >
            <div className="sacc-card-content">
              <h3>Debug Process</h3>
              <p>End-to-end visibility for issue diagnosis and resolution</p>
            </div>
          </Card>
          <Card
            interaction="click"
            size="md"
            sidebar={{ color: "teal", variant: "primary" }}
            configAria={{ button: { "aria-label": "Navigate to Performance" } }}
            onClicked={() => navigateToView("performance", null, { title: "SACC - Performance" })}
          >
            <div className="sacc-card-content">
              <h3>Performance Metrics</h3>
              <p>Execution time and storage performance measurement</p>
            </div>
          </Card>
          <Card
            interaction="click"
            size="md"
            sidebar={{ color: "green", variant: "primary" }}
            configAria={{ button: { "aria-label": "Navigate to AI Assistant" } }}
            onClicked={() => navigateToView("ai-assistant", null, { title: "SACC - AI Assistant" })}
          >
            <div className="sacc-card-content">
              <h3>AI Code Assistant</h3>
              <p>Intelligent coding help for custom development tasks</p>
            </div>
          </Card>
        </div>
      </div>

      <div className="sacc-section">
        <h3 className="sacc-section__title">Recent Activity</h3>
        <Card size="md">
          <div className="sacc-card-content">
            <div className="sacc-metric-row">
              <span className="sacc-metric-row__label">Last deployment</span>
              <span className="sacc-metric-row__value">2 hours ago</span>
            </div>
            <div className="sacc-metric-row">
              <span className="sacc-metric-row__label">Open incidents</span>
              <span className="sacc-metric-row__value">
                <Badge value={3} color="warning" variant="primary" />
              </span>
            </div>
            <div className="sacc-metric-row">
              <span className="sacc-metric-row__label">Pending code reviews</span>
              <span className="sacc-metric-row__value">
                <Badge value={5} color="info" variant="primary" />
              </span>
            </div>
            <div className="sacc-metric-row">
              <span className="sacc-metric-row__label">Failed tests (24h)</span>
              <span className="sacc-metric-row__value">
                <Badge value={1} color="critical" variant="primary" />
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
