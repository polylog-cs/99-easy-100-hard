# 99% is easy, 100% is hard

Run `./setup.sh` to set up the project. This script will:
- Install Motion Canvas from source (needed because audio support is not yet in the npm package)
- Install other `npm` packages
- Set up pre-commit hooks in a Python virtual environment

After setup is complete, run `npm run start` to start the preview server.
It'll be available on http://localhost:9000/.

## Working with LLMs
When using LLMs for Motion Canvas development, using [repomix](https://repomix.com/) to provide context on Motion Canvas, as well as the typical way we write animations, is useful.
You can use this repository, as well as the more general https://github.com/xiaoxiae/motion-canvas-examples/.

You likely want to run something like `repomix --include "**/*.tsx,**/*.glsl"` so only animation/shader files are packed.
