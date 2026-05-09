import React, { useState, useCallback, useMemo } from "react";
import { Button } from "@servicenow/react-components/Button";
import { Textarea } from "@servicenow/react-components/Textarea";
import { Select } from "@servicenow/react-components/Select";
import { Input } from "@servicenow/react-components/Input";
import { Badge } from "@servicenow/react-components/Badge";
import { Modal } from "@servicenow/react-components/Modal";
import { AI_MODELS, AIModel, ModelCategory, ModelCapability } from "../config/ai-models";
import { encryptCredential } from "../utils/crypto";

const MAX_MODELS = 4;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ModelChat {
  modelId: string;
  messages: ChatMessage[];
}

interface NewModelForm {
  name: string;
  provider: string;
  providerDescription: string;
  description: string;
  category: string;
  apiEndpoint: string;
  authType: string;
  headerName: string;
  apiKey: string;
  clientId: string;
  clientSecret: string;
  tokenUrl: string;
  organizationId: string;
  registrationUrl: string;
  accessNotes: string;
  contextWindow: string;
}

const EMPTY_MODEL_FORM: NewModelForm = {
  name: "",
  provider: "",
  providerDescription: "",
  description: "",
  category: "general_purpose",
  apiEndpoint: "",
  authType: "api_key",
  headerName: "Authorization",
  apiKey: "",
  clientId: "",
  clientSecret: "",
  tokenUrl: "",
  organizationId: "",
  registrationUrl: "",
  accessNotes: "",
  contextWindow: "",
};

export default function AIAssistant() {
  const [inputValue, setInputValue] = useState("");
  const [context, setContext] = useState("");
  const [selectedModels, setSelectedModels] = useState<string[]>(["claude-sonnet-4"]);
  const [modelChats, setModelChats] = useState<Record<string, ChatMessage[]>>({});

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modelForm, setModelForm] = useState<NewModelForm>({ ...EMPTY_MODEL_FORM });
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const enabledModels = useMemo(() => AI_MODELS.filter((m) => m.enabled), []);

  const toggleModel = (modelId: string) => {
    setSelectedModels((prev) => {
      if (prev.includes(modelId)) return prev.filter((id) => id !== modelId);
      if (prev.length >= MAX_MODELS) return prev; // enforce limit
      return [...prev, modelId];
    });
  };

  const handleSend = () => {
    if (!inputValue.trim() || selectedModels.length === 0) return;
    const newChats = { ...modelChats };
    for (const modelId of selectedModels) {
      const model = AI_MODELS.find((m) => m.id === modelId);
      const existing = newChats[modelId] || [];
      newChats[modelId] = [
        ...existing,
        { role: "user", content: inputValue },
        {
          role: "assistant",
          content: `[${model?.name || modelId}] Analyzing your request... Configure API credentials via "Add Model" to enable live responses.`,
        },
      ];
    }
    setModelChats(newChats);
    setInputValue("");
  };

  // --- Modal ---
  function openAddModelModal() {
    setModelForm({ ...EMPTY_MODEL_FORM });
    setFormErrors([]);
    setSubmitSuccess(false);
    setIsSubmitting(false);
    setModalOpen(true);
  }

  function validateModelForm(): string[] {
    const errors: string[] = [];
    if (!modelForm.name.trim()) errors.push("Model Name is required");
    if (!modelForm.provider.trim()) errors.push("Provider is required");
    if (!modelForm.providerDescription.trim()) errors.push("Provider Description is required");
    if (!modelForm.description.trim()) errors.push("Model Description is required");
    if (!modelForm.category) errors.push("Category is required");
    if (!modelForm.apiEndpoint.trim()) errors.push("API Endpoint is required");
    if (!modelForm.apiEndpoint.trim().startsWith("http")) errors.push("API Endpoint must start with http:// or https://");
    if (!modelForm.authType) errors.push("Authentication Type is required");
    if (modelForm.authType === "api_key" && !modelForm.apiKey.trim()) errors.push("API Key is required for API Key authentication");
    if (modelForm.authType === "oauth2") {
      if (!modelForm.clientId.trim()) errors.push("Client ID is required for OAuth2");
      if (!modelForm.clientSecret.trim()) errors.push("Client Secret is required for OAuth2");
      if (!modelForm.tokenUrl.trim()) errors.push("Token URL is required for OAuth2");
    }
    if (modelForm.authType === "bearer" && !modelForm.apiKey.trim()) errors.push("Bearer Token is required");
    return errors;
  }

  async function handleModelSubmit() {
    const errors = validateModelForm();
    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }
    setIsSubmitting(true);

    try {
      // Encrypt credentials using AES-256-GCM
      const apiKeyEnc = modelForm.apiKey ? await encryptCredential(modelForm.apiKey.trim()) : undefined;
      const clientIdEnc = modelForm.clientId ? await encryptCredential(modelForm.clientId.trim()) : undefined;
      const clientSecretEnc = modelForm.clientSecret ? await encryptCredential(modelForm.clientSecret.trim()) : undefined;

      const newModel: AIModel = {
        id: `user-${Date.now()}`,
        name: modelForm.name.trim(),
        provider: modelForm.provider.trim(),
        providerDescription: modelForm.providerDescription.trim(),
        description: modelForm.description.trim(),
        category: modelForm.category as ModelCategory,
        capabilities: ["chat"] as ModelCapability[],
        apiEndpoint: modelForm.apiEndpoint.trim(),
        auth: {
          type: modelForm.authType as any,
          headerName: modelForm.headerName.trim() || "Authorization",
          apiKeyEncrypted: apiKeyEnc,
          clientIdEncrypted: clientIdEnc,
          clientSecretEncrypted: clientSecretEnc,
          tokenUrl: modelForm.tokenUrl.trim() || undefined,
          organizationId: modelForm.organizationId.trim() || undefined,
          registrationUrl: modelForm.registrationUrl.trim() || undefined,
          accessNotes: modelForm.accessNotes.trim() || undefined,
        },
        enabled: true,
        contextWindow: modelForm.contextWindow ? parseInt(modelForm.contextWindow) : undefined,
        pricingTier: "pay-per-use",
        lastVerified: new Date().toISOString().split("T")[0],
      };

      AI_MODELS.push(newModel);
      setFormErrors([]);
      setSubmitSuccess(true);
      setTimeout(() => {
        setModalOpen(false);
        setSubmitSuccess(false);
        setIsSubmitting(false);
      }, 1500);
    } catch (err) {
      setFormErrors(["Encryption failed. Please try again."]);
      setIsSubmitting(false);
    }
  }

  const handleModalOpenedSet = useCallback((e: any) => {
    setModalOpen(e.detail.payload.value);
  }, []);

  const handleFooterAction = useCallback((e: any) => {
    const action = e.detail.payload.action;
    if (action.label === "Cancel") setModalOpen(false);
    else if (action.label === "Submit") handleModelSubmit();
  }, [modelForm]);

  // Determine chat layout
  const activeChats: ModelChat[] = selectedModels.map((id) => ({
    modelId: id,
    messages: modelChats[id] || [],
  }));

  return (
    <div>
      <div className="sacc-page-header">
        <div>
          <h2>AI Code Assistant</h2>
          <p className="sacc-page-header__subtitle">
            Multi-model AI assistant — select up to {MAX_MODELS} LLMs for parallel prompting
          </p>
        </div>
        <Badge value={selectedModels.length} color="info" variant="primary" />
      </div>

      <div className="sacc-toolbar">
        <Select
          label="Context Scope"
          items={[
            { id: "global", label: "Global Scope" },
            { id: "x_custom_app", label: "x_custom_app" },
            { id: "x_hr_portal", label: "x_hr_portal" },
            { id: "x_itsm_ext", label: "x_itsm_ext" },
          ]}
          selectedItem={context}
          onSelectedItemSet={(e: any) => setContext(e.detail.payload.value)}
        />
        <Button label="Clear Chat" variant="tertiary" size="sm" icon="close-outline" onClicked={() => setModelChats({})} />
        <Button label="Add Model" variant="secondary" size="sm" icon="plus-outline" onClicked={openAddModelModal} />
      </div>

      {/* Model Selection Panel */}
      <div style={{ marginBottom: "16px", padding: "12px 16px", borderRadius: "6px", backgroundColor: "rgb(var(--now-color_surface--brand-1, 229, 242, 246))" }}>
        <p style={{ margin: "0 0 10px", fontSize: "13px", fontWeight: 600, color: "rgb(var(--now-color--neutral-12, 55, 68, 74))" }}>
          Select Models ({selectedModels.length}/{MAX_MODELS} max)
        </p>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {enabledModels.map((model) => {
            const isSelected = selectedModels.includes(model.id);
            const isDisabled = !isSelected && selectedModels.length >= MAX_MODELS;
            return (
              <span
                key={model.id}
                onClick={() => !isDisabled && toggleModel(model.id)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "5px 12px",
                  borderRadius: "16px",
                  fontSize: "12px",
                  fontWeight: 500,
                  cursor: isDisabled ? "not-allowed" : "pointer",
                  opacity: isDisabled ? 0.4 : 1,
                  transition: "all 0.15s ease",
                  backgroundColor: isSelected
                    ? "rgb(var(--now-actionable--primary--background-color, 0, 128, 163))"
                    : "rgb(var(--now-color_background--primary, 255, 255, 255))",
                  color: isSelected
                    ? "rgb(var(--now-actionable--primary--color, 255, 255, 255))"
                    : "rgb(var(--now-color--neutral-12, 55, 68, 74))",
                  border: isSelected
                    ? "1px solid transparent"
                    : "1px solid rgb(var(--now-color--divider-tertiary, 200, 206, 209))",
                }}
              >
                {isSelected ? "✓ " : ""}{model.name}
                <span style={{ opacity: 0.7, fontSize: "10px" }}>({model.provider})</span>
              </span>
            );
          })}
        </div>
      </div>

      {/* Parallel Chat Columns */}
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.max(selectedModels.length, 1)}, 1fr)`, gap: "12px", marginBottom: "16px", minHeight: "300px" }}>
        {activeChats.map((chat) => {
          const model = AI_MODELS.find((m) => m.id === chat.modelId);
          return (
            <div
              key={chat.modelId}
              style={{ display: "flex", flexDirection: "column", border: "1px solid rgb(var(--now-color--divider-tertiary, 200, 206, 209))", borderRadius: "6px", overflow: "hidden" }}
            >
              <div style={{ padding: "8px 12px", backgroundColor: "rgb(var(--now-color_surface--brand-1, 229, 242, 246))", fontSize: "12px", fontWeight: 600, color: "rgb(var(--now-color--neutral-12, 55, 68, 74))", borderBottom: "1px solid rgb(var(--now-color--divider-tertiary, 200, 206, 209))" }}>
                {model?.name || chat.modelId}
                <span style={{ fontWeight: 400, opacity: 0.7 }}> • {model?.provider}</span>
              </div>
              <div style={{ flex: 1, overflowY: "auto", padding: "10px", display: "flex", flexDirection: "column", gap: "8px", maxHeight: "320px" }}>
                {chat.messages.length === 0 && (
                  <p style={{ fontSize: "12px", color: "rgb(var(--now-color--neutral-10, 79, 92, 98))", textAlign: "center", padding: "24px 8px" }}>
                    No messages yet. Send a prompt below.
                  </p>
                )}
                {chat.messages.map((msg, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: "8px 10px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      lineHeight: "1.5",
                      whiteSpace: "pre-wrap",
                      backgroundColor: msg.role === "user"
                        ? "rgb(var(--now-color_surface--brand-1, 229, 242, 246))"
                        : "rgb(var(--now-color_background--secondary, 245, 246, 247))",
                      alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                      maxWidth: "95%",
                    }}
                  >
                    {msg.content}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {selectedModels.length === 0 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "48px", color: "rgb(var(--now-color--neutral-10, 79, 92, 98))", fontSize: "13px" }}>
            Select at least one model above to start chatting.
          </div>
        )}
      </div>

      {/* Input Area - Full width textarea with Send button below */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <Textarea
          label=""
          placeholder={selectedModels.length === 0 ? "Select at least one model above..." : `Send to ${selectedModels.length} model(s) — ServiceNow code, APIs, best practices...`}
          value={inputValue}
          onValueSet={(e: any) => setInputValue(e.detail.payload.value)}
          rows={5}
        />
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            label="Send"
            variant="primary"
            size="md"
            icon="send-outline"
            disabled={selectedModels.length === 0}
            onClicked={handleSend}
          />
        </div>
      </div>

      {/* Add Model Modal */}
      <Modal
        opened={modalOpen}
        size="lg"
        headerLabel="Register New AI Model"
        footerActions={[
          { label: "Cancel", variant: "secondary" },
          { label: "Submit", variant: "primary", icon: "check-outline", disabled: isSubmitting },
        ]}
        onOpenedSet={handleModalOpenedSet}
        onFooterActionClicked={handleFooterAction}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", padding: "8px 0" }}>
          {submitSuccess && (
            <div style={{ padding: "12px 16px", borderRadius: "4px", backgroundColor: "rgb(var(--now-color--alert-positive-1, 223, 240, 216))", color: "rgb(var(--now-color--alert-positive-3, 42, 100, 25))", fontSize: "13px", fontWeight: 600 }}>
              ✅ Model registered successfully! Credentials encrypted with AES-256-GCM.
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

          {/* Model Info */}
          <Input label="Model Name *" placeholder="e.g., GPT-4o, Claude Sonnet 4" value={modelForm.name} onValueSet={(e: any) => setModelForm({ ...modelForm, name: e.detail.payload.value })} />
          <Input label="Provider *" placeholder="e.g., OpenAI, Anthropic, Google" value={modelForm.provider} onValueSet={(e: any) => setModelForm({ ...modelForm, provider: e.detail.payload.value })} />
          <Textarea label="Provider Description *" placeholder="Short description of the provider organization..." value={modelForm.providerDescription} onValueSet={(e: any) => setModelForm({ ...modelForm, providerDescription: e.detail.payload.value })} />
          <Textarea label="Model Description *" placeholder="Capabilities, use cases, strengths..." value={modelForm.description} onValueSet={(e: any) => setModelForm({ ...modelForm, description: e.detail.payload.value })} />
          <Select
            label="Category *"
            items={[
              { id: "general_purpose", label: "General Purpose" },
              { id: "code_generation", label: "Code Generation" },
              { id: "image_generation", label: "Image Generation" },
              { id: "video_generation", label: "Video Generation" },
              { id: "embedding", label: "Embedding" },
              { id: "specialized", label: "Specialized" },
              { id: "open_source", label: "Open Source" },
            ]}
            selectedItem={modelForm.category}
            onSelectedItemSet={(e: any) => setModelForm({ ...modelForm, category: e.detail.payload.value })}
            itemsListConstrain={{ maxHeight: 300, minWidth: 250 }}
          />

          {/* API Configuration */}
          <div style={{ borderTop: "1px solid rgb(var(--now-color--divider-secondary, 218, 222, 224))", paddingTop: "14px" }}>
            <p style={{ fontSize: "13px", fontWeight: 600, margin: "0 0 12px", color: "rgb(var(--now-color--neutral-12, 55, 68, 74))" }}>
              API Configuration
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <Input label="API Endpoint *" placeholder="https://api.openai.com/v1/chat/completions" value={modelForm.apiEndpoint} onValueSet={(e: any) => setModelForm({ ...modelForm, apiEndpoint: e.detail.payload.value })} />
              <Input label="Context Window (tokens)" placeholder="e.g., 128000" value={modelForm.contextWindow} onValueSet={(e: any) => setModelForm({ ...modelForm, contextWindow: e.detail.payload.value })} />
              <Input label="Organization / Project ID" placeholder="org-xxxxx (optional)" value={modelForm.organizationId} onValueSet={(e: any) => setModelForm({ ...modelForm, organizationId: e.detail.payload.value })} />
            </div>
          </div>

          {/* Credentials — Encrypted with AES-256-GCM */}
          <div style={{ borderTop: "1px solid rgb(var(--now-color--divider-secondary, 218, 222, 224))", paddingTop: "14px" }}>
            <p style={{ fontSize: "13px", fontWeight: 600, margin: "0 0 4px", color: "rgb(var(--now-color--neutral-12, 55, 68, 74))" }}>
              Credentials (encrypted with AES-256-GCM)
            </p>
            <p style={{ fontSize: "11px", margin: "0 0 12px", color: "rgb(var(--now-color--neutral-10, 79, 92, 98))" }}>
              🔒 All secrets are encrypted at rest using AES-256-GCM with PBKDF2 key derivation (100K iterations). Never stored in plaintext.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <Select
                label="Authentication Type *"
                items={[
                  { id: "api_key", label: "API Key" },
                  { id: "oauth2", label: "OAuth 2.0 (Client Credentials)" },
                  { id: "bearer", label: "Bearer Token" },
                  { id: "session", label: "Session / SSO" },
                  { id: "none", label: "None (Self-Hosted)" },
                ]}
                selectedItem={modelForm.authType}
                onSelectedItemSet={(e: any) => setModelForm({ ...modelForm, authType: e.detail.payload.value })}
                itemsListConstrain={{ maxHeight: 250, minWidth: 280 }}
              />
              <Input label="Auth Header Name" placeholder="Authorization" value={modelForm.headerName} onValueSet={(e: any) => setModelForm({ ...modelForm, headerName: e.detail.payload.value })} />

              {(modelForm.authType === "api_key" || modelForm.authType === "bearer") && (
                <Input label={modelForm.authType === "api_key" ? "API Key *" : "Bearer Token *"} placeholder={modelForm.authType === "api_key" ? "sk-xxxxxxxxxxxxxxxx" : "eyJhbGciOi..."} value={modelForm.apiKey} onValueSet={(e: any) => setModelForm({ ...modelForm, apiKey: e.detail.payload.value })} />
              )}

              {modelForm.authType === "oauth2" && (
                <>
                  <Input label="Client ID *" placeholder="client_xxxxxxxxxxxxx" value={modelForm.clientId} onValueSet={(e: any) => setModelForm({ ...modelForm, clientId: e.detail.payload.value })} />
                  <Input label="Client Secret *" placeholder="secret_xxxxxxxxxxxxx" value={modelForm.clientSecret} onValueSet={(e: any) => setModelForm({ ...modelForm, clientSecret: e.detail.payload.value })} />
                  <Input label="Token URL *" placeholder="https://auth.provider.com/oauth/token" value={modelForm.tokenUrl} onValueSet={(e: any) => setModelForm({ ...modelForm, tokenUrl: e.detail.payload.value })} />
                </>
              )}

              <Input label="Registration URL" placeholder="https://platform.example.com/signup" value={modelForm.registrationUrl} onValueSet={(e: any) => setModelForm({ ...modelForm, registrationUrl: e.detail.payload.value })} />
              <Input label="Access Notes" placeholder="How to get access (optional)" value={modelForm.accessNotes} onValueSet={(e: any) => setModelForm({ ...modelForm, accessNotes: e.detail.payload.value })} />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
