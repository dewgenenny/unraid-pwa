This is a new Unraid PWA that can be used to access and control unraid instances.

The app is designed to be statically hosted on GitHub pages, with only local on device storage leveraged along with the Unraid GraphQL interface (schema.json contains the description of the interface).

Rules to follow as an agent (please review each time):

- Always ensure that tests are written and run to cover the code you produce
- Make sure you add comments to your code, ensuring those that follow can easily understand
- Use SOLID principles when developing
- Always remember our focus on delivering a statically hosted PWA - this must never be broken
- Always update README and agents.md to reflect the current state of the app. Agents.md should capture any of your concerns or planned next steps.


## Current State

A basic PWA scaffold has been created using plain HTML and JavaScript. Service worker registration and a placeholder GraphQL helper are included. Simple Node based tests verify the manifest and exported functions.

## Next Steps

- Implement UI components for interacting with the Unraid GraphQL API.
- Expand test coverage as features are added.
- Investigate build tooling for production assets while maintaining static hosting.
