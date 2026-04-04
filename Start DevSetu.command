#!/bin/bash
cd "$(dirname "$0")"
echo "🚀 Starting DevSetu..."
echo "📦 Installing dependencies (first time may take a minute)..."
npm install --legacy-peer-deps
echo ""
echo "✅ Opening http://localhost:5173 in your browser..."
sleep 2
open http://localhost:5173
echo ""
echo "🕉️ DevSetu is running! Keep this window open."
echo "   Press Ctrl+C to stop the server."
echo ""
npm run dev
