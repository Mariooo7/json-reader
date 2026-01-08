# JSON Reader

A minimalist, fast, and elegant local application for visualizing and reading JSON data.

## ✨ Features

- **Smart Extraction**: Automatically extracts multiple JSON blocks from mixed text (logs, prompts, code).
- **GUI Visualization**: Interactive tree view with clear type indicators and structure lines.
- **Markdown Support**: Renders Markdown content within JSON strings, including Mermaid diagrams and syntax highlighting.
- **Local & Secure**: All processing happens locally in your browser/app. No data is sent to any server.
- **Developer Friendly**:
  - **Syntax Highlighting**: Input area supports JSON syntax highlighting.
  - **Auto-Format**: Automatically formats valid JSON on paste.
  - **Smart Copy**: Copy as JSON, YAML-like Text, or Markdown code block.
- **Theming**: Native Dark/Light mode support.

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Shadcn UI (concepts)
- **State Management**: Zustand
- **Markdown**: react-markdown + remark-gfm + PrismJS
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
```

## 📦 Building Desktop App (Tauri)

This project is designed to be wrapped with [Tauri](https://tauri.app/) for a native desktop experience.

To initialize Tauri:

1. Install Rust and Cargo (if not already installed).
2. Run the Tauri initialization:

```bash
npm install -D @tauri-apps/cli
npx tauri init
```

3. Update `src-tauri/tauri.conf.json` identifier and window settings as needed.
4. Run the desktop app:

```bash
npm run tauri dev
```

## 📄 License

MIT
