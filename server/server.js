import { createApp } from './index.js';

const port = process.env.PORT || 3000;
const app = createApp();
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
