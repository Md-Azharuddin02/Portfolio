import {
  Binoculars,
  Blocks,
  BrainCircuit,
  MessageSquareText,
  Rocket,
  Route,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Telescope,
} from "lucide-react";

export const aiTimeline = [
  { label: "Discover", Icon: Binoculars, copy: "Map user value, data sources, and decision points." },
  { label: "Architect", Icon: Route, copy: "Design retrieval, model, product, and API boundaries." },
  { label: "Build", Icon: Blocks, copy: "Ship the feature surface with clean state and data flows." },
  { label: "Integrate LLM", Icon: BrainCircuit, copy: "Connect OpenAI, Anthropic, tools, and product context." },
  { label: "Evaluate", Icon: ShieldCheck, copy: "Score quality, relevance, latency, and failure modes." },
  { label: "Ship", Icon: Rocket, copy: "Release with useful UX, telemetry, and practical fallbacks." },
  { label: "Observe", Icon: Telescope, copy: "Track usage, drift, cost, and signals for iteration." },
];

export const aiCapabilities = [
  { title: "RAG Pipelines", tag: "Grounded answers", Icon: Search },
  { title: "LLM Orchestration", tag: "Model + tool flows", Icon: SlidersHorizontal },
  { title: "AI Assistants & Chat UX", tag: "Human-centered chat", Icon: MessageSquareText },
  { title: "Vector Search", tag: "Semantic retrieval", Icon: Sparkles },
  { title: "Model Evaluation & Guardrails", tag: "Safer outputs", Icon: ShieldCheck },
];
