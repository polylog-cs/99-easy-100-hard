#!/bin/bash
# Set up Motion Canvas with workspaces and pre-commit hooks
set -ex # exit on error, print commands

echo "Setting up Motion Canvas with workspaces..."

# Clone motion-canvas repository
if [ ! -d "motion-canvas" ]; then
	git clone https://github.com/polylog-cs/motion-canvas.git motion-canvas
fi

cd motion-canvas
git pull

# Install dependencies in motion-canvas
npm install --save-dev rollup

# Fix TypeScript configuration for core package
# Set sed in-place flag based on OS
SED_INPLACE=(-i)
[[ "$OSTYPE" == "darwin"* ]] && SED_INPLACE=(-i '')
sed "${SED_INPLACE[@]}" 's/"target": "es2020",/"target": "es2020",\n    "lib": ["es2020", "dom", "es2022.intl"],/' packages/core/tsconfig.json

# Build all packages
npx lerna run build

# Go back to main project
cd ..

# Install project dependencies using workspaces
npm install

echo "Motion Canvas setup with workspaces complete!"

# Set up Python virtual environment and pre-commit hooks
echo "Setting up pre-commit hooks..."

# Create virtual environment if it doesn't exist
if [ ! -d ".venv" ]; then
	python3 -m venv .venv
fi

# Activate virtual environment
source .venv/bin/activate

# Upgrade pip
pip install --upgrade pip

# Install pre-commit
pip install pre-commit

# Install pre-commit hooks
pre-commit install

echo "Pre-commit hooks installed successfully!"
echo ""
echo "Setup complete! You can now run 'npm run start' to start the preview server."
echo "Pre-commit hooks will automatically check your code when you commit."
