#!/bin/bash

echo "🚀 LinkPro - Quick Start Script"
echo "================================"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local nicht gefunden!"
    echo "📝 Kopiere .env.example zu .env.local und fülle die Werte aus:"
    echo "   cp .env.example .env.local"
    echo ""
    exit 1
fi

echo "✅ Environment Variables gefunden"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
yarn install

echo ""
echo "🏗️  Building application..."
yarn build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build erfolgreich!"
    echo ""
    echo "🎉 LinkPro ist bereit!"
    echo ""
    echo "Nächste Schritte:"
    echo "1. Development: yarn dev"
    echo "2. Production: yarn start"
    echo "3. Deployment: Siehe DEPLOYMENT.md"
    echo ""
else
    echo ""
    echo "❌ Build fehlgeschlagen!"
    echo "🔍 Prüfe die Fehler oben und behebe sie."
    echo ""
    exit 1
fi
