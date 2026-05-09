import React, { useState } from "react";
import { Card } from "@servicenow/react-components/Card";
import { Button } from "@servicenow/react-components/Button";
import { Textarea } from "@servicenow/react-components/Textarea";
import { Select } from "@servicenow/react-components/Select";
import { Badge } from "@servicenow/react-components/Badge";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const SAMPLE_MESSAGES: ChatMessage[] = [
  {
    role: "user",
    content: "How do I fix a GlideRecord null reference error when the record doesn't exist?",
  },
  {
    role: "assistant",
    content: `To handle null reference errors with GlideRecord, always check if the query returned a result before accessing fields:

\`\`\`javascript
var gr = new GlideRecord('sys_user_group');
if (gr.get(assignmentGroup)) {
  // Record exists - safe to access fields
  var manager = gr.getValue('manager');
} else {
  // Handle missing record
  gs.warn('Group not found: ' + assignmentGroup);
}
\`\`\`

Key best practices:
1. Always use \`if (gr.get(...))\` or check \`gr.next()\` after query
2. Use \`gr.isValidRecord()\` for additional safety
3. Add null checks before \`getValue()\` calls
4. Log warnings for missing references to aid debugging`,
  },
];

export default function AIAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>(SAMPLE_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [context, setContext] = useState("");

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const newMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: inputValue },
      {
        role: "assistant",
        content: "Analyzing your code... I'll provide a detailed solution based on ServiceNow best practices and the current scope context.",
      },
    ];
    setMessages(newMessages);
    setInputValue("");
  };

  return (
    <div>
      <div className="sacc-page-header">
        <div>
          <h2>AI Code Assistant</h2>
          <p className="sacc-page-header__subtitle">
            Intelligent coding help for ServiceNow custom development
          </p>
        </div>
        <Badge value={2} color="info" variant="primary" />
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
        <Button label="Clear Chat" variant="tertiary" size="sm" icon="close-outline" />
      </div>

      <div className="sacc-chat-container">
        <div className="sacc-chat-messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`sacc-chat-message sacc-chat-message--${msg.role}`}>
              {msg.content}
            </div>
          ))}
        </div>

        <div className="sacc-chat-input">
          <div style={{ flex: 1 }}>
            <Textarea
              label=""
              placeholder="Ask about ServiceNow code, APIs, best practices..."
              value={inputValue}
              onValueSet={(e: any) => setInputValue(e.detail.payload.value)}
              rows={2}
            />
          </div>
          <Button label="Send" variant="primary" size="md" icon="send-outline" onClicked={handleSend} />
        </div>
      </div>
    </div>
  );
}
