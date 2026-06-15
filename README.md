<div align="center">
  <h1>🧬 Niramay</h1>
  <h3>Precision Pharmacogenomics AI Platform</h3>
  <p><strong>Bridging the gap between raw genetic data and actionable clinical safety.</strong></p>

  <p>
    <img src="https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
    <br/>
    <img src="https://img.shields.io/badge/Python_3.12-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
    <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
    <img src="https://img.shields.io/badge/Gemini_2.0_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini" />
    <img src="https://img.shields.io/badge/Pinecone-000000?style=for-the-badge&logo=pinecone&logoColor=white" alt="Pinecone" />
    <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  </p>
</div>

<br/>

## 🚀 The Vision

Adverse Drug Reactions (ADRs) are a leading cause of hospitalization and death globally. While pharmacogenomic (PGx) testing exists, the results are buried in unreadable, dense Variant Call Format (VCF) files that clinicians struggle to interpret during a standard 15-minute consultation.

**Niramay** solves this. It is an enterprise-grade, AI-powered clinical decision support system that analyzes a patient's genetic profile to predict drug response and toxicity risks in real-time, delivering a stunning 3D interactive dashboard for rapid clinical scanning.

---

## 🧠 Neuro-Symbolic Architecture

Niramay pioneers a hybrid AI architecture to completely eliminate the "Black Box" problem in medical AI:

1. **The "Symbolic" Safety Layer**: A deterministic, hard-coded rules engine that strictly follows **CPIC (Clinical Pharmacogenetics Implementation Consortium)** guidelines. It ensures **zero hallucination risk**. If the medical guidelines say "Avoid Codeine," the system outputs "Avoid Codeine."
2. **The "Neural" Cortex**: A Retrieval-Augmented Generation (RAG) system powered by **Google Gemini 2.0 Flash** and **Pinecone**. It reads the patient's genetic markers and synthesizes plain-English, literature-grounded clinical explanations.

---

## ✨ Cutting-Edge Features

*   **Interactive 3D Dashboard**: A visually stunning, hardware-accelerated frontend built with Framer Motion, featuring volumetric charts, mouse-tracking parallax cards, and live energy pipelines.
*   **100% Guideline Compliance**: Risk levels (High/Moderate/Low) are mapped directly to gold-standard medical protocols.
*   **Real-time VCF Processing**: Pure Python parsing engine extracts genotypes directly from `.vcf` files in milliseconds.
*   **End-to-End Encryption**: Zero genomic data retention policy. Files are processed securely via Supabase signed URLs and discarded.
*   **Multi-Model Resiliency**: Implements an AI "Key Cascade" and "Model Waterfall" to handle API quotas and guarantee 99.9% uptime.

---

## 🏗️ System Architecture

### 1. Frontend: Next.js 15 (React)
*   **UI/UX**: Modern glassmorphic Bento-box aesthetic, fully responsive from mobile to 4K displays.
*   **Animations**: Custom physics engines using `framer-motion` for fluid, native-feeling interactions.
*   **Security**: Client-side direct uploads to Supabase storage buckets.

### 2. Backend: Python FastAPI Microservice
*   **Performance**: Asynchronous, highly concurrent API endpoints.
*   **Bio-Parsing**: Maps extracted genotypes (e.g., `rs1799853`) to diplotypes (e.g., `*2/*2`).
*   **Orchestration**: Manages the parallel execution of the CPIC rules engine and the Pinecone RAG agent.

---

## 🔄 End-to-End Workflow

1.  **Upload**: Clinician securely uploads a standard `.vcf` file.
2.  **Ingestion**: The backend extracts variants for key pharmacogenes (`CYP2C9`, `CYP2C19`, `SLCO1B1`, `CYP2D6`, etc.).
3.  **Deterministic Evaluation**:
    *   Determines Phenotype (e.g., "Poor Metabolizer").
    *   Assigns a Risk Level based on CPIC tables.
4.  **Neural Explanation (RAG)**:
    *   System queries the vectorized 2025 CPIC Guidelines in Pinecone.
    *   Gemini generates a "clinical impact statement" explaining the biological mechanism.
5.  **Presentation**: The frontend renders a traffic-light risk assessment and 3D severity profiling for instant clinical action.

---

## 🚀 Getting Started

### Prerequisites
*   Node.js 18+
*   Python 3.12+
*   Google Gemini API Key
*   Pinecone API Key
*   Supabase Project URL & Anon Key

### 1. Clone the Repository
```bash
git clone https://github.com/Shudhanshu9122/Niramaya.git
cd Niramaya
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# Windows
.\venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env 
# Add your GEMINI_API_KEY and PINECONE_API_KEY
python -m uvicorn app.main:app --reload
```

### 3. Frontend Setup
```bash
cd ../niramay
npm install
cp .env.local.example .env.local
# Add your Supabase keys
npm run dev
```

### 4. Seed the Database
```bash
# In the backend terminal
python scripts/init_pinecone.py
python scripts/seed_database.py
```
*Open `http://localhost:3000` to access the dashboard.*

---

## 👥 Lead Developer

**Sudhanshu Kumar** ([@Shudhanshu9122](https://github.com/Shudhanshu9122))
*Full-Stack Engineer & AI Architect*

---
<div align="center">
  <i>Built with ❤️ to make precision medicine accessible to everyone.</i>
</div>
