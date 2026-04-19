import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { bookRouter } from "./modules/books/router.js";

const app = new Hono()
  .route("/books", bookRouter);

serve(
  {
    fetch: app.fetch,
    port: 8000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
