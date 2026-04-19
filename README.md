# ✦ Ethos-AI | Enterprise Communications Trainer

![Ethos-AI Banner](client/src/assets/hero.png)

🚀 **Live Production Site:** [https://ethos-ai.vercel.app](https://ethos-ai.vercel.app)

**Ethos-AI** is a premium, next-generation AI platform designed to analyze, critique, and elevate professional communication. Acting as a master Human Resources (HR) Director, the intelligence backend identifies emotional nuance, evaluates tone, and coaches users through high-stakes workplace simulations using the advanced Google Gemini AI engine.

## 🚀 Key Features and Use Cases

### 1. The Interactive Simulator (Chat Environment)
Engage in high-stakes, real-time roleplay scenarios where the AI takes on strict, professional personas to pressure-test your communication strategies before you face them in the real world.
* **How it Helps:** Avoid crucial missteps in real life by practicing difficult conversations dynamically. The AI assigns specific HR archetypes based on your chosen scenario.
* **Available Modules:** 
  * *Job Interview*: Practice with a strict, behavioral HR Hiring Manager.
  * *Conflict Resolution*: Mediate workplace tension against an HR Business Partner.
  * *Executive Brief*: Deliver high-level reports to an intimidating executive presence.
* **Live Coaching**: The AI doesn't just respond in-character; it returns active metrics mid-conversation advising you on how your tone is shifting and how you can improve your next response.

### 2. Text Intelligence (Analyzer Page)
The "AI Diagnostic" engine acts as an expert editor. You can paste an email, memo, or policy draft into the platform, and the analyzer engine will parse it automatically with zero latency.
* **How it Helps:** It provides an instant secondary review mechanism to ensure you don't send emails that sound too aggressive, unclear, or unprofessional.
* **The "Score Matrix":** Grades your text comprehensively out of 100 on *Clarity*, *Professionalism*, *Conciseness*, *Tone*, and *Empathy*.
* **Refined Logic Generation:** Not only does the AI point out subjective weaknesses in specific paragraphs (Highlighting the Exact Issue -> Suggestion), but it also automatically generates a fully rewriten, polished variant of your text that you can directly copy to your clipboard.

### 3. Sleek, Distraction-Free UI
Designed with a sophisticated, "Glassmorphism" dark-mode aesthetic utilizing a strict base-8 spacing layout.
* **How it Helps:** By completely eliminating UI clutter, the user’s cognitive load is freed up entirely for writing and analyzing text without distraction. Features smooth toggle-password authentication and seamless component scaling.

### 4. Progress Dashboard (Save Audits)
Securely tokenize and log into your dashboard to save historical sessions.
* **How it Helps:** By clicking "Save Audit" during an analysis, you can historically track your growth over time, allowing managers or individuals to map out measurable improvements in their empathetic and professional delivery.

---

## 🛠️ Technology Stack
This platform separates concerns efficiently between a resilient backend and a fast frontend framework:

* **Frontend:** React.js, Vite, Vanilla CSS (Custom Design System), Lucide-React Icons.
* **Backend:** Node.js, Express.js.
* **Database:** MongoDB (Session storage and historical metrics).
* **Intelligence:** Google Generative AI (Gemini Flash Model) executing heavily prompted JSON extraction.

---

## 🔧 Local Development Setup

To run this application efficiently, you must split your terminals for the client and the server.

### Prerequisites
- Node `v18+`
- A MongoDB Cluster URI
- A Google API Key (Gemini)

### Backend (Server)
1. Navigate to the server folder: `cd server`
2. Install standard dependencies: `npm install`
3. Create a `.env` file referencing your variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_cluster_string
   JWT_SECRET=your_secure_random_string
   GOOGLE_API_KEY=your_google_gemini_key
   ```
4. Start the backend: `npm run dev`

### Frontend (Client)
1. In a new terminal, navigate to the client folder: `cd client`
2. Install frontend dependencies: `npm install`
3. Create a `.env` file pointing to your local environment:
   ```env
   VITE_API_URL=http://localhost:5000
   ```
4. Start the Vite development build: `npm run dev`

---

*Built with precision for the modern professional.*
