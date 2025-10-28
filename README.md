# AfriGrowth AI

A Ghana-first SaaS platform that empowers small businesses and digital creators through localized AI tools.

## 🚀 Features

- **AI-Powered Content Generation**: GPT-based content creation tailored for Ghanaian businesses
- **Audio Transcription**: Whisper-powered audio-to-text conversion in local languages
- **Local Language Support**: Hugging Face integration for Ghanaian language tone modeling
- **Mobile-First Design**: Responsive interface optimized for Ghanaian users
- **Business Tools**: Specialized AI tools for small business operations
- **Creator Tools**: Digital content creation and management tools

## 🏗️ Architecture

- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS
- **Backend**: Node.js with Express and TypeScript
- **Database**: MongoDB with Mongoose ODM
- **AI Services**: OpenAI (GPT, Whisper) + Hugging Face
- **Authentication**: JWT-based auth with role management
- **Deployment**: Docker containers with CI/CD pipeline

## 🛠️ Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React Query
- Zustand (State Management)
- React Hook Form
- Framer Motion

### Backend
- Node.js
- Express.js
- TypeScript
- MongoDB + Mongoose
- JWT Authentication
- Multer (File Uploads)
- Winston (Logging)

### AI & External Services
- OpenAI API (GPT-4, Whisper)
- Hugging Face Transformers
- Cloudinary (Media Storage)

## 🚀 Quick Start

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd afrigrowth-ai
   npm run install:all
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Configure your environment variables
   ```

3. **Development**
   ```bash
   npm run dev
   ```

4. **Production Build**
   ```bash
   npm run build
   npm start
   ```

## 📁 Project Structure

```
afrigrowth-ai/
├── frontend/                 # Next.js frontend application
│   ├── app/                 # App Router pages
│   ├── components/          # Reusable React components
│   ├── lib/                 # Utilities and configurations
│   ├── hooks/               # Custom React hooks
│   └── types/               # TypeScript type definitions
├── backend/                 # Node.js backend API
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Express middleware
│   │   ├── services/        # Business logic
│   │   └── utils/           # Utility functions
│   └── tests/               # Backend tests
├── docs/                    # Documentation
└── scripts/                 # Deployment and utility scripts
```

## 🌍 Localization

The platform supports multiple Ghanaian languages:
- English (Primary)
- Twi (Akan)
- Ga
- Ewe
- Hausa

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/afrigrowth-ai

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Hugging Face
HUGGINGFACE_API_KEY=your_huggingface_api_key

# JWT
JWT_SECRET=your_jwt_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Server
PORT=3001
NODE_ENV=development
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@afrigrowth.ai or join our community Discord.

---

**Built with ❤️ for Ghana's digital economy**
