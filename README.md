# Unraid PWA

This project is a statically hosted Progressive Web App for managing Unraid instances.
It communicates with the Unraid GraphQL interface (see `schema.json`) and stores data locally on the device.

## Development

The application lives in the `src` directory and is built using plain HTML and JavaScript. Tests are located in the `tests` directory and can be executed with:

```bash
npm test
```

`package.json` declares `"type": "module"`, so Node treats `.js` files as ES modules. The test files use the `.cjs`
extension so they continue to run in a CommonJS environment while dynamically
importing the module from `src/main.js`.

## Project Structure

- `src/index.html` – main entry point that registers the service worker.
- `src/main.js` – JavaScript entry module with helpers for storing connection settings and querying the Unraid GraphQL API.
- `src/sw.js` – service worker providing offline capabilities.
- `src/manifest.json` – PWA manifest configuration.
- `tests/` – simple assertion based tests run via Node.
- `server/` – lightweight Node server used when running via Docker.

The project can still be hosted on GitHub Pages without any server side components.
A small Node server is provided for convenience when running in Docker.

## Usage

Open `index.html` in a browser (or deploy the contents of `src` to GitHub Pages).
Enter the URL of your Unraid server and an API token in the form at the top of the page.
These values are saved to `localStorage` on your device and used for subsequent requests.
After saving, the application will query the server for basic information such as the Unraid version and display the JSON response.

### Self-signed certificates

If your Unraid server uses a self-signed TLS certificate you can check the
"Allow self-signed certificates" option in the settings form. When running in
Node (for example during tests), this will disable certificate validation so the
GraphQL requests succeed. Browsers still require you to manually trust the
certificate the first time you connect.

## Docker

You can run the PWA using Docker which now starts a small Node server. The
server serves the static files and proxies GraphQL requests to your Unraid
instance, handling CSRF cookies automatically:

```bash
docker build -t unraid-pwa .
docker run -d -p 8080:3000 -e UNRAID_HOST=https://my-unraid unraid-pwa
```

The application will then be available at `http://localhost:8080`.

## CI/CD

Pushes to the `main` branch trigger a GitHub Actions workflow that runs the test suite and then builds and publishes a Docker image. The image is pushed to Docker Hub using the account specified in the `DOCKERHUB_USERNAME` secret and is tagged as `latest`. A personal access token for that account should be stored in the `DOCKERHUB_TOKEN` secret.
