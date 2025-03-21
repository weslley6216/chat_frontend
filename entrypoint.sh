#!/bin/sh
set -e

echo "Initializing chat_frontend environment..."

# Only adjust permissions if necessary
if [ -w /opt/app ]; then
  echo "Adjusting permissions for /opt/app and its subdirectories..."
  chown -R node:node /opt/app
else
  echo "Skipping permissions adjustment; insufficient privileges."
fi

# Verify that Vite is installed correctly
if ! command -v vite &> /dev/null; then
  echo "Vite not found, installing it..."
  npm install vite --save-dev > /dev/null 2>&1
fi

# Start the development server
echo "Starting the development server..."
exec npm run dev
