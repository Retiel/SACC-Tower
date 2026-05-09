# 🛡️ SACC Tower — Super Admin Command Center

> A comprehensive React-based command center dashboard for ServiceNow super administrators to control, monitor, develop, and maintain all custom application scopes.

![Platform](https://img.shields.io/badge/Platform-ServiceNow-00C389)
![Framework](https://img.shields.io/badge/Framework-React%2019-61DAFB)
![SDK](https://img.shields.io/badge/Now--SDK-4.6.0-0080A3)
![License](https://img.shields.io/badge/License-UNLICENSED-red)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Views & Navigation](#views--navigation)
- [Technology Stack](#technology-stack)
- [Development](#development)
- [Troubleshooting](#troubleshooting)

---

## Overview

**SACC Tower** (Super Admin Command Center) is a single-page application (SPA) built with React on the ServiceNow platform. It provides a unified dashboard for super administrators to streamline issue debugging on custom developments, with full end-to-end visibility of processes, performance metrics, AI-assisted coding, and contextual documentation.

### Key Capabilities

| Capability | Description |
|------------|-------------|
| **Scope Management** | Control, monitor, and maintain all custom application scopes from a single interface |
| **Process Debugging** | End-to-end visibility of any process currently being debugged |
| **Spec Generation** | UML and technical specification generator with PDF, Word, and HTML export |
| **Stack Trace Analysis** | Advanced code stack trace with frame-by-frame analysis |
| **Performance Metrics** | End-to-end and point-to-point performance measurement (execution time & storage) |
| **AI Code Assistant** | Intelligent coding assistant for ServiceNow development |
| **Documentation Hub** | Scientific research and technical documentation interface with contextual suggestions |

---

## Features

### 🏠 Dashboard Overview
- Real-time system health metrics (CPU, memory, storage)
- Custom scope statistics with active/inactive counts
- Quick action cards for one-click navigation
- Recent activity feed with badges for pending items

### 📦 Scope Manager
- Full list of all custom application scopes using `NowRecordListConnected`
- Scope status indicators (active, pending review, errors)
- Direct scope record access for editing

### 🐛 Process Debugger
- Visual process flow with step-by-step execution status
- Four sub-views: Flow, Execution Logs, Variables, Timeline
- Color-coded step indicators (complete, active, error, pending)
- Expandable accordion for each execution frame

### 📐 Spec Generator
- ASCII UML class diagrams with multiple diagram type support
- Technical specification viewer with Markdown rendering
- Export to PDF, Word (.docx), HTML, and Markdown formats
- Recent export history tracking

### 🔍 Stack Trace Viewer
- Full exception stack traces with highlighted error lines
- Frame-by-frame analysis with metadata
- Source code viewer with line numbers
- Execution context (session, scope, domain, memory, queries)
- Links to open in Studio and compare versions

### 📊 Performance Measurement
- **Execution Time**: Average, P95, P99 metrics with visual progress bars
- **Storage Metrics**: Table-level storage analysis with growth rates
- **End-to-End**: Full process cycle performance measurement
- **Point-to-Point**: Integration segment performance between components

### 🤖 AI Code Assistant
- Chat-based interface for ServiceNow development questions
- Scope-aware context selection
- Code suggestions with best practices
- GlideRecord, Flow, and API guidance

### 📚 Documentation Interface
- Split-panel view: document list + content preview
- Search and filter by document type
- Categories: Technical Documentation, Research Papers, Technical Guides
- Expandable sections for Key Concepts, Code Examples, Related Resources
- Actions to cite in specs and add to project

---

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    SACC Tower SPA                         │
├──────────────┬───────────────────────────────────────────┤
│              │                                           │
│   Sidebar    │              Main Content                 │
│   Navigation │                                          │
│              │   ┌─────────────────────────────────┐    │
│  • Dashboard │   │  URLSearchParams Router          │    │
│  • Scopes    │   │                                  │    │
│  • Debugger  │   │  ?view=dashboard                 │    │
│  • Specs     │   │  ?view=scopes                    │    │
│  • Stack     │   │  ?view=debugger                  │    │
│  • Perf      │   │  ?view=specs                     │    │
│  • AI        │   │  ?view=stacktrace                │    │
│  • Docs      │   │  ?view=performance               │    │
│              │   │  ?view=ai-assistant               │    │
│              │   │  ?view=documentation              │    │
│              │   └─────────────────────────────────┘    │
└──────────────┴───────────────────────────────────────────┘
```

### Navigation Pattern

The application uses **URLSearchParams-based routing** for deep-linkable views:
- Each view has a unique URL: `?view=<viewName>&id=<optionalId>`
- Browser back/forward navigation is fully supported via `popstate` events
- Polaris iframe detection ensures compatibility with ServiceNow's Polaris UI framework

---

## Project Structure

```
sacc-tower/
├── package.json                    # Dependencies and scripts
├── now.config.json                 # ServiceNow SDK configuration
├── now.dev.mjs                     # Development configuration
├── now.prebuild.mjs                # Pre-build hooks
└── src/
    ├── client/
    │   ├── index.html              # HTML entry point (Polaris-enabled)
    │   ├── main.tsx                # React bootstrap
    │   ├── app.tsx                 # Root SPA component + router
    │   ├── app.css                 # Global styles (design tokens)
    │   ├── tsconfig.json           # TypeScript configuration
    │   ├── global.d.ts             # Global type declarations
    │   ├── utils/
    │   │   └── fields.ts           # display() / value() field helpers
    │   └── components/
    │       ├── Sidebar.tsx         # Navigation sidebar
    │       ├── Sidebar.css         # Sidebar styles
    │       ├── Dashboard.tsx       # Overview dashboard
    │       ├── ScopeManager.tsx    # Scope list (NowRecordListConnected)
    │       ├── ProcessDebugger.tsx # Process debugging view
    │       ├── SpecGenerator.tsx   # UML & spec generation
    │       ├── StackTrace.tsx      # Code stack trace analysis
    │       ├── Performance.tsx     # Performance metrics
    │       ├── AIAssistant.tsx     # AI code assistant chat
    │       └── Documentation.tsx   # Documentation interface
    ├── fluent/
    │   ├── index.now.ts            # Fluent entry point
    │   ├── tsconfig.json           # Fluent TypeScript config
    │   ├── tsconfig.client.json
    │   ├── tsconfig.server.json
    │   └── ui-pages/
    │       └── command-center.now.ts  # UiPage definition
    └── server/
        └── tsconfig.json
```

---

## Prerequisites

| Requirement | Version |
|-------------|---------|
| ServiceNow Instance | Washington DC+ |
| Now SDK (CLI) | 4.6.0+ |
| Node.js | 20.0.0+ |
| npm | 9.0.0+ |

---

## Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd sacc-tower
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Instance Connection

Ensure your `now.config.json` points to your ServiceNow instance:

```json
{
  "instanceUrl": "https://<your-instance>.service-now.com"
}
```

### 4. Build the Application

```bash
npm run build
```

### 5. Deploy to Instance

```bash
npm run deploy
```

---

## Usage

### Accessing the Application

Once deployed, access the command center at:

```
https://<your-instance>.service-now.com/x_920325_sacctower_command_center.do
```

### Direct View Navigation

You can deep-link directly to any view:

| View | URL |
|------|-----|
| Dashboard | `...command_center.do?view=dashboard` |
| Scope Manager | `...command_center.do?view=scopes` |
| Process Debugger | `...command_center.do?view=debugger` |
| Spec Generator | `...command_center.do?view=specs` |
| Stack Trace | `...command_center.do?view=stacktrace` |
| Performance | `...command_center.do?view=performance` |
| AI Assistant | `...command_center.do?view=ai-assistant` |
| Documentation | `...command_center.do?view=documentation` |

### Workflow Examples

#### Debugging a Process Issue

1. Navigate to **Process Debugger** (`?view=debugger`)
2. Select the process from the dropdown (e.g., "Incident Creation Flow")
3. Click **Analyze** to trace the execution
4. Review the visual flow — red nodes indicate errors
5. Expand each step in the accordion for execution details
6. Switch to **Execution Logs** tab for chronological log output
7. Check **Variables** tab to inspect runtime state
8. Use **Timeline** tab to identify performance bottlenecks

#### Analyzing Performance

1. Navigate to **Performance** (`?view=performance`)
2. Select time range (Last Hour → Last 30 Days)
3. Review **Execution Time** tab for avg/P95/P99 metrics
4. Check **Storage Metrics** for table growth trends
5. Use **End-to-End** tab for full process cycle measurements
6. Use **Point-to-Point** tab for segment-level analysis

#### Using the AI Assistant

1. Navigate to **AI Assistant** (`?view=ai-assistant`)
2. Select the context scope from the dropdown
3. Type your ServiceNow development question
4. Click **Send** for AI-powered code guidance
5. Review code examples with best practices

---

## Views & Navigation

### URL Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `view` | string | The active view name (see table above) |
| `id` | string | Optional record sys_id for detail views |

### Keyboard Navigation

- **Browser Back/Forward**: Fully supported via history API
- **Sidebar**: Click any nav item to switch views

### Polaris Compatibility

The application automatically detects whether it's running inside ServiceNow's Polaris iframe and adjusts navigation accordingly:
- **In Polaris**: Uses `CustomEvent.fireTop` for permalink updates
- **Standalone**: Uses `history.pushState` directly

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| **UI Framework** | React 19 |
| **Language** | TypeScript |
| **Components** | `@servicenow/react-components` (Horizon Design System) |
| **Styling** | CSS with ServiceNow Design Tokens (`--now-*`) |
| **Build System** | Now SDK (automatic bundling) |
| **Platform** | ServiceNow (UiPage API) |
| **Navigation** | URLSearchParams SPA routing |

### Key Components Used

| Component | Purpose |
|-----------|---------|
| `NowRecordListConnected` | Scope list with pagination/sorting |
| `Card`, `CardHeader` | Content containers and sections |
| `Button` | Actions and navigation triggers |
| `Tabs` | Sub-view navigation within views |
| `Accordion`, `AccordionItem` | Collapsible content sections |
| `Badge` | Status indicators and counts |
| `ProgressBar` | Visual metrics display |
| `Select` | Dropdown selections |
| `Input`, `Textarea` | Text input fields |
| `HighlightedValue` | Status labels with color coding |

---

## Development

### Local Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Deploy

```bash
npm run deploy
```

### Adding a New View

1. Create a new component in `src/client/components/NewView.tsx`
2. Import it in `src/client/app.tsx`
3. Add a case to the `renderView()` switch statement
4. Add a navigation item to `NAV_ITEMS` in `src/client/components/Sidebar.tsx`
5. Build and deploy

### File Size Guidelines

- Keep each component under **100 lines**
- Split large views into sub-components
- Use the service layer pattern for API calls

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Page shows blank | Check browser console for errors; ensure `now-ux-globals` is loaded |
| Components not rendering | Verify `@servicenow/react-components` is installed (`npm install`) |
| Navigation not working | Ensure `window.g_ck` is available (user must be authenticated) |
| Stale content after deploy | The `uxpcb` parameter in `index.html` should handle cache busting |
| Build fails | Run `npm install` first; check TypeScript errors with `npx tsc --noEmit` |

---

## Scope Information

| Property | Value |
|----------|-------|
| **Application Name** | SACC Tower |
| **Scope** | `x_920325_sacctower` |
| **Endpoint** | `x_920325_sacctower_command_center.do` |
| **SDK Version** | 4.6.0 |

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit changes (`git commit -am 'Add new feature'`)
4. Push to branch (`git push origin feature/my-feature`)
5. Open a Pull Request

---

## License

This project is **UNLICENSED** — proprietary software for internal use.

---

<p align="center">
  Built with ❤️ on the ServiceNow Platform using Now SDK Fluent APIs
</p>
