# SubScout: AI-Powered Subscription Analyzer

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-purple.svg)](https://vitejs.dev/)
[![Gemini 3](https://img.shields.io/badge/Gemini-3_Flash-orange.svg)](https://ai.google.dev/)

**SubScout** is a secure, intelligent tool designed to give you total control over your digital spending. By leveraging the power of **Gemini 3 Flash**, SubScout analyzes your bank statements to automatically detect recurring payments, predict renewal dates, and provide actionable financial insights.

---

## Key Features

- **Smart Detection**: Automatically identifies subscriptions (SaaS, Gyms, Utilities, Streaming) from PDF, CSV, and Image formats.
- **Predictive Alerts**: Calculates and projects your next payment dates so you're never surprised by a renewal.
- **Financial Visualization**: Beautiful, interactive charts (powered by Recharts) to visualize your monthly burn rate and category spending.
- **Modern UX**: A sleek, responsive interface built with Tailwind CSS and Plus Jakarta Sans.
- **Secure & Private**: Your data is processed for analysis only and never stored.

---

## Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS, Lucide React (Icons)
- **Visualization**: Recharts
- **AI Engine**: Google Gemini 3 Flash Preview
- **Build Tool**: Vite 6

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (Latest LTS)
- A Google Gemini API Key (Get it from [AI Studio](https://aistudio.google.com/))

### Privacy Note
Your privacy is paramount. **You enter your own API key, and it is stored locally in your browser (localStorage).** It is used **only** to process your analysis requests and is never sent to any external server other than the official Google Gemini API.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/vinayanand3/SubScout.git
   cd SubScout
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env.local` file in the root directory and add your API key:
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

---

## Usage

1. **Upload**: Drag and drop at least 3 months of bank statements (PDF, CSV, or screenshots).
2. **Configure**: Set custom keywords to force-include or exclude specific transactions in the Settings modal.
3. **Analyze**: Click "Start Analysis" and let Gemini process your data.
4. **Insights**: Review your active subscriptions, monthly stats, and upcoming payments.

---

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Made with ❤️ by Vinay Anand
</p>
