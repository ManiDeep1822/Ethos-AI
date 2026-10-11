# Ethos Enterprise | Communications Intelligence Platform

**Ethos Enterprise** is an institutional-grade communication intelligence platform designed to analyze, critique, and elevate executive and workplace communication. Powered by Google Gemini AI, the system evaluates emotional nuance, tone calibration, and diplomatic risk, allowing leaders and teams to pressure-test critical correspondence and navigate high-stakes workplace simulations.

---

## Core Capabilities

### 1. Simulation Arena (Interactive Roleplay Environment)
Engage in real-time, high-stakes workplace roleplay scenarios where the AI assumes demanding executive and counterpart personas:
* **Enterprise Scenarios:**
  * *Executive Leadership Briefing*: Defend capital allocation and project timelines under intense C-suite and board scrutiny.
  * *Critical Client SLA Escalation*: De-escalate enterprise accounts following outages without conceding unvetted liability.
  * *Cross-Functional Roadmap Alignment*: Negotiate tradeoffs and align engineering and product leadership.
  * *Strategic Compensation & Role Review*: Make a data-driven case for promotion and compensation adjustments.
  * *Senior Executive Behavioral Interview*: Demonstrate crisis leadership and strategic accountability.
* **Live Diplomatic HUD**: Turn-by-turn metrics advising on tone shifts, tactical coaching, and diplomatic impact.
* **Session Debrief Report**: Comprehensive performance report card synthesized at session conclusion with strengths, vulnerabilities, and strategic directives.

### 2. Text Intelligence & Governance (Diagnostic Suite)
Institutional-grade diagnostic engine for sensitive correspondence:
* **Context & Audience Calibration**: Tailor evaluations for Executive Board, Client Escalations, Cross-Functional Alignment, or Enterprise Policy memos.
* **Side-by-Side Comparison (Diff View)**: Contrast original drafts directly against executive polished variants.
* **One-Click Inline Remediation**: Directly apply recommended fixes to flagged phrases within the editor.
* **Multi-Dimensional Score Matrix**: Quantitative evaluation out of 100 on *Clarity*, *Professionalism*, *Conciseness*, *Empathy*, and *Diplomatic Tone*.
* **Export & Audit Logging**: Export structured audit summaries to disk or save to the persistent enterprise ledger.

### 3. Executive Analytics Dashboard
* **Institutional KPIs**: Track Institutional Communication Index, Audit Volume, 30-Day Diplomatic Velocity, and Benchmark Compliance.
* **Progression Curve & Competency Radar**: Longitudinal performance tracking and multi-axis skill maps.
* **Searchable Audit Ledger**: Search historical drafts by keyword or filter by score tier.
* **Audit Inspection Modal**: Inspect full historical drafts, polished variants, and coaching feedback.

### 4. Enterprise Security Architecture
* **Enterprise Dark Slate Design System**: Zero neon gradients or AI tropes; built with high-contrast Inter typography and strict layout spacing scales.
* **Zero-Retention Policy**: Private correspondence is never utilized to fine-tune foundational AI models.
* **Cryptographic Security**: TLS 1.3 in transit and AES-256 encryption at rest.

---

## Technology Stack

* **Frontend:** React 19, Vite, Redux Toolkit, React Router v7, Recharts, Lucide Icons.
* **Backend:** Node.js, Express.js.
* **Database:** MongoDB (Session storage and historical audit metrics).
* **Intelligence:** Google Generative AI (Gemini Flash Model) executing heavily structured JSON extraction.

---

## Local Development Setup

### Prerequisites
* Node `v18+`
* MongoDB Cluster URI
* Google Gemini API Key

### Backend Setup
1. Navigate to the server folder: `cd server`
2. Install dependencies: `npm install`
3. Configure environment variables in `.env`:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_cluster_string
   JWT_SECRET=your_secure_random_string
   GOOGLE_API_KEY=your_google_gemini_key
   ```
4. Start the server: `npm run dev`

### Frontend Setup
1. Navigate to the client folder: `cd client`
2. Install dependencies: `npm install`
3. Configure environment variables in `.env`:
   ```env
   VITE_API_URL=http://localhost:5000
   ```
4. Start the development server: `npm run dev`
5. Build for production: `npm run build`

---

*Ethos Enterprise — Built for Executive Communications Governance.*
