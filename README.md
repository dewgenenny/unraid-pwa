# Unraid PWA

This project is a statically hosted Progressive Web App for managing Unraid instances.
It communicates with the Unraid GraphQL interface (see `schema.json`) and stores data locally on the device.

## Development

The application lives in the `src` directory and is built using plain HTML and JavaScript. Tests are located in the `tests` directory and can be executed with:

```bash
npm test
```

## Project Structure

- `src/index.html` – main entry point that registers the service worker.
- `src/main.js` – JavaScript entry module with a placeholder GraphQL fetch helper.
- `src/sw.js` – service worker providing offline capabilities.
- `src/manifest.json` – PWA manifest configuration.
- `tests/` – simple assertion based tests run via Node.

The project is designed to be hosted on GitHub Pages without any server side components.
