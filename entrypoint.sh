#!/bin/sh
set -e

echo "Initializing chat_frontend environment..."

# Only adjust permissions if necessary
if [ -w /opt/app ]; then
  echo "Adjusting permissions for /opt/app and its subdirectories..."
  chown -R node:node /opt/app
  chmod -R 775 /opt/app
else
  echo "Skipping permissions adjustment; insufficient privileges."
fi

# Verifique se o Vite está instalado corretamente
if ! command -v vite &> /dev/null; then
  echo "Vite not found, installing it..."
  npm install vite --save-dev
fi

# Start the development server
echo "Starting the development server..."
exec npm run dev
