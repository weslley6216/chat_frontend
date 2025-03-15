#!/bin/sh
set -e

# Display initialization message
echo "Initializing chat_frontend environment..."

# Only adjust permissions if necessary
if [ -w /opt/app ]; then
  echo "Adjusting permissions for /opt/app and its subdirectories..."
  chown -R node:node /opt/app
  chmod -R 775 /opt/app
else
  echo "Skipping permissions adjustment; insufficient privileges."
fi

# Start the development server
echo "Starting the development server..."
exec npm run dev
