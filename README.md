# 🛡️ FinGuard AI

**Your Personal AI-Powered Financial Assistant for India**

FinGuard is an intelligent financial management platform designed specifically for Indian users, combining AI-powered chatbot assistance, budget tracking, government scheme recommendations, and scam detection—all in one place.

![FinGuard Banner](https://img.shields.io/badge/Status-Active-success) ![Python](https://img.shields.io/badge/Python-3.10+-blue) ![React](https://img.shields.io/badge/React-18.3-61DAFB) ![FastAPI](https://img.shields.io/badge/FastAPI-0.128-009688) ![Mobile](https://img.shields.io/badge/Mobile-React%20Native-blueviolet)

---

## 🌟 Features

### 💬 **AI Chat Assistant**
- Natural language conversations about finances, schemes, and more
- Multi-language support (English, Hindi, Hinglish)
- Personalized responses based on user profile
- Context-aware chat sessions with history

### 💰 **Smart Budget Manager**
- Track income and expenses automatically via chat
- AI-powered transaction parsing (supports natural language input)
- Visual analytics with charts and graphs
- Monthly budget planning and alerts
- Category-wise spending breakdown

### 🏛️ **Government Scheme Lookup**
- Comprehensive database of Central and State government schemes
- Eligibility checking based on user profile
- Detailed scheme information (benefits, documents, application steps)
- Filtering by category, state, income, age, gender

### 🛡️ **Scam Detection**
- AI-powered fraud detection for suspicious messages
- Real-time risk assessment with confidence scores
- Educational content about common scams
- Red flag identification

### 📚 **Financial Education**
- Explain financial concepts in simple terms (FD, PPF, SIP, mutual funds, etc.)
- Personalized advice based on spending patterns
- Hinglish support for vernacular users
- Risk-appropriate recommendations

---

## 🏗️ Tech Stack

FinGuard AI also includes a **mobile application** built using **React Native**, enabling users to manage finances seamlessly on the go.

### Mobile Features
- 🔐 Authentication (Login / Signup)
- 💬 Chat with FinGuard AI
- 💰 Budget overview & expense tracking
- 🏛️ Browse government schemes
- 👤 User profile management
- 🎨 Shared design system (colors, spacing, typography)

### Mobile Tech Stack
- **Framework**: React Native (TypeScript)
- **Navigation**: React Navigation
- **UI Components**: Custom reusable components
- **Theming**: Centralized theme tokens
- **Backend**: Shared FastAPI & Express APIs

### **Backend**
- **Framework**: FastAPI (Python)
- **LLM**: Groq (Llama 3.1), Google Gemini
- **Graph Database**: Neo4j (2 instances - schemes & finance)
- **Vector Store**: ChromaDB
- **Graph Framework**: LangGraph
- **Authentication**: JWT

### **Frontend**
- **Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI (shadcn/ui)
- **Charts**: Recharts
- **State Management**: React Context API
- **Routing**: React Router DOM

### **AI/ML Pipeline**
- LangChain for RAG (Retrieval-Augmented Generation)
- Knowledge Graph for structured data retrieval
- Semantic search with embeddings
- Custom transaction parser with NLP

---

## 📂 Project Structure

```
FinGuard-AI/
├── backend/
│   ├── agent/
│   │   ├── __init__.py
│   │   ├── class_agent.py
│   │   ├── finance_agent.py
│   │   ├── financial_explainer_handler.py
│   │   └── graph.py
│   │
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI entry point
│   │   └── query.py             # Main query handler
│   │
│   ├── db_/
│   │   ├── __init__.py
│   │   ├── neo4j_init.py        # Schemes database
│   │   └── neo4j_finance.py     # Finance & budget database
│   │
│   ├── feature_router/
│   │   └── router.py
│   │
│   ├── financial_explainer/
│   │   ├── concept_explainer.py
│   │   └── language_handler.py
│   │
│   ├── llm/
│   │   ├── answer_generator.py
│   │   ├── grader_and_filter.py
│   │   ├── rewriter_query.py
│   │   └── run_agent.py
│   │
│   ├── model/
│   │   └── scam_bundle.pkl
│   │
│   ├── retrieval/
│   │   ├── kg_retrieval.py
│   │   ├── vector_retrieval.py
│   │   ├── pdf_loader.py
│   │   └── run_query.py
│   │
│   ├── scam_detector/
│   │   ├── scam.py
│   │   └── scam_detector.py
│   │
│   ├── smart_budget_manager/
│   │   ├── transaction_parser.py
│   │   ├── spending_analyser.py
│   │   ├── alert_generator.py
│   │   └── report_generator.py
│   │
│   └── src/                     # Express.js service layer
│       ├── controllers/
│       ├── models/
│       ├── repositories/
│       ├── routes/
│       ├── services/
│       └── index.js
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── auth/
│       ├── components/
│       │   ├── budget/
│       │   ├── chat/
│       │   ├── schemes/
│       │   └── ui/
│       ├── context/
│       ├── data/
│       ├── hooks/
│       ├── lib/
│       ├── pages/
│       ├── types/
│       ├── App.tsx
│       ├── main.tsx
│       └── index.css
│
├── mobile/
│   ├── assets/
│   │   ├── adaptive-icon.png
│   │   ├── favicon.png
│   │   ├── icon.png
│   │   └── splash-icon.png
│   │
│   └── src/
│       ├── components/
│       │   └── ui/
│       │       ├── Button.tsx
│       │       ├── Card.tsx
│       │       ├── Input.tsx
│       │       └── index.ts
│       │
│       ├── navigation/
│       │   ├── AppNavigator.tsx
│       │   └── MainTabNavigator.tsx
│       │
│       ├── screens/
│       │   ├── Auth/
│       │   │   └── AuthScreen.tsx
│       │   ├── Budget/
│       │   │   └── BudgetScreen.tsx
│       │   ├── Chat/
│       │   │   └── ChatScreen.tsx
│       │   ├── Home/
│       │   │   └── HomeScreen.tsx
│       │   ├── Profile/
│       │   │   └── ProfileScreen.tsx
│       │   └── Schemes/
│       │       └── SchemesScreen.tsx
│       │
│       ├── theme/
│       │   ├── colors.ts
│       │   ├── spacing.ts
│       │   ├── typography.ts
│       │   └── index.ts
│       │
│       └── types/
│           └── index.ts
│
└── README.md


```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- Neo4j Aura (2 instances recommended)
- MongoDB Atlas (optional for Express backend)
- API Keys:
  - Groq API Key
  - Google Gemini API Key

### Backend Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/finguard.git
cd finguard/backend
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Configure environment variables**
Create a `.env` file in `backend/`:
```env
# LLM API Keys
GROQ_API_KEY=your_groq_api_key
GOOGLE_API_KEY=your_google_api_key

# Neo4j - Schemes Database
NEO4J_URI=neo4j+s://your-scheme-instance.databases.neo4j.io
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=your_password

# Neo4j - Finance Database
NEO4J_URI2=neo4j+s://your-finance-instance.databases.neo4j.io
NEO4J_USERNAME2=neo4j
NEO4J_PASSWORD2=your_password

# PDF for Knowledge Graph (optional)
PDF_URL=https://your-pdf-url.com/schemes.pdf

# CORS (for frontend)
ALLOWED_ORIGINS=http://localhost:8080,https://your-frontend-url.com
```

5. **Run the FastAPI server**
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The backend will be available at `http://localhost:8000`
API docs: `http://localhost:8000/docs`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
Create a `.env` file in `frontend/`:
```env
VITE_BACKEND_URL=http://localhost:8000
```

For Express.js backend (alternative):
```env
VITE_BACKEND_URL=http://localhost:3000
```

4. **Run the development server**
```bash
npm run dev
```

### Mobile Setup

1. ```bash
   cd mobile
   ```

2. ```bash
   npm install
   ```

3. ```bash
   npx expo start
   ```

The app will be available at `http://localhost:8080`

### Express.js Backend Setup (Alternative)

If using the Express.js backend in `backend/src/`:

1. **Install dependencies**
```bash
cd backend
npm install
```

2. **Configure environment**
Create `.env` in `backend/`:
```env
PORT=3000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
BOT_API_URL=https://your-fastapi-url.com/query
```

3. **Run the server**
```bash
npm start
```

---

## 📖 Usage

### 1. **Sign Up / Sign In**
- Create an account with email and password
- Complete your profile (income, age, state, occupation, etc.)
- Profile helps personalize scheme recommendations

### 2. **Chat with FinGuard**
- Ask about government schemes: *"Am I eligible for PMAY?"*
- Log expenses naturally: *"Spent 50 on tea"* or *"Chai pe 50 rupaye kharch kiye"*
- Get financial advice: *"What is FD?"* or *"Should I invest in PPF?"*
- Check for scams: *"Is this message a scam?"*

### 3. **Manage Your Budget**
- View monthly spending overview
- Add income/expenses manually or via chat
- Set category-wise budgets
- Get alerts when overspending

### 4. **Explore Schemes**
- Browse 100+ government schemes
- Filter by category, state, income, age
- View eligibility, benefits, documents needed
- Get application guidance

---

## 🎯 Key Workflows

### Transaction Logging (AI-Powered)
```
User: "50 rupaye chai pe lag gaye"
      ↓
Transaction Parser (NLP)
      ↓
Amount: ₹50, Category: food, Description: chai
      ↓
Stored in Neo4j Finance DB
      ↓
Budget alert if threshold exceeded
```

### Scheme Eligibility Check
```
User: "Am I eligible for MUDRA loan?"
      ↓
Profile Extraction (age, income, occupation)
      ↓
Knowledge Graph Query (Neo4j)
      ↓
Vector Search for scheme details
      ↓
Grading & Filtering
      ↓
Personalized eligibility response
```

### Financial Concept Explanation
```
User: "FD kya hai?" (Hinglish)
      ↓
Language Detection (Hinglish)
      ↓
Concept Explainer + User spending data
      ↓
Risk Profile Inference
      ↓
Personalized explanation in Hinglish
```

### AI Transaction Logging
```
User → Chat  
↓  
NLP Transaction Parser  
↓  
Neo4j Finance DB  
↓  
Budget Alerts & Analytics
```

### Scam Detection
```
Message  
↓  
Scam Detection Model  
↓  
Risk Classification  
↓  
Explanation + Confidence Score
```

---

## 🔧 Configuration

### Neo4j Setup

#### **Instance 1: Schemes Database**
- Stores government scheme entities and relationships
- Full-text index on `Entity.name` for fast search
- Connected via `NEO4J_URI`

#### **Instance 2: Finance Database**
- Stores user transactions and budgets
- Indexes: `User.id`, `Transaction.user_id`, `Budget.user_id`
- Connected via `NEO4J_URI2`

### PDF Knowledge Base (Optional)
Set `PDF_URL` to auto-load scheme PDF into knowledge graph on startup.

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```
### Mobile Tests
```bash
cd mobile
npm test
```

## 🚢 Deployment

### Backend (Render / Railway)
1. Set environment variables in dashboard
2. Build command: `pip install -r requirements.txt`
3. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Frontend (Vercel / Netlify)
1. Set `VITE_BACKEND_URL` to production backend URL
2. Build command: `npm run build`
3. Publish directory: `dist`

### Mobile App Deployment (React Native + Expo)

#### Development
1. cd mobile
2. npx expo start

## 🤝 Contributing

We welcome contributions! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style
- Add tests for new features
- Update documentation
- Use meaningful commit messages

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Himitesh** - [khs007]((https://github.com/khs007))
- **Aryan** - [Aryannaik-max]((https://github.com/Aryannaik-max))
- **Pranshu** - [pran5hu-p]((https://github.com/pran5hu-p))
- **Nitin** - [lobby11]((https://github.com/lobby11))
- **Manaswini** - [Manaswini1224]((https://github.com/Manaswini1224))

---

## 🙏 Acknowledgments

- **LangChain** for RAG framework
- **Groq** for fast LLM inference
- **Neo4j** for graph database
- **shadcn/ui** for beautiful UI components
- **Government of India** for scheme data

---

## 📞 Support

For issues and feature requests, please [open an issue](https://github.com/yourusername/finguard/issues).

For questions, reach out at: your.email@example.com

---

## 📊 Project Status

🚀 **Active Development** - Features being added regularly!

### Roadmap
- [ ] Voice input for transactions
- [ ] Multi-user family budgets
- [ ] Investment tracking
- [ ] Goal-based savings planner
- [ ] WhatsApp bot integration
- [ ] Regional language support (Tamil, Telugu, Bengali)

---

<div align="center">

**Made with ❤️ in India for Indians**

⭐ Star this repo if you found it helpful!

</div>
