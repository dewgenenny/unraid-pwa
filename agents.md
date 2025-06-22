This is a new Unraid PWA that can be used to access and control unraid instances.

The app is designed to be statically hosted on GitHub pages, with only local on device storage leveraged along with the Unraid GraphQL interface (schema.json contains the description of the interface).

Rules to follow as an agent (please review each time):

- Always ensure that tests are written and run to cover the code you produce
- Make sure you add comments to your code, ensuring those that follow can easily understand
- Use SOLID principles when developing
- Always remember our focus on delivering a statically hosted PWA - this must never be broken
- Always update README and agents.md to reflect the current state of the app. Agents.md should capture any of your concerns or planned next steps.


## Current State

The PWA now includes a small settings form allowing a host URL and API token to be stored in `localStorage`. `main.js` exposes helpers for saving these values and for performing authenticated requests to the Unraid GraphQL endpoint. The page fetches and displays the server version as a basic example. Tests cover the new settings logic.

## Next Steps

- Extend the UI to display more data from Unraid (array status, VMs, etc.).
- Continue expanding test coverage for new features.
- Investigate build tooling for production assets while maintaining static hosting.
