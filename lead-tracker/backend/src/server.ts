import dotenv from "dotenv";
dotenv.config();

import app from "./app";

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Lead Tracker API listening on port ${PORT}`);
});
