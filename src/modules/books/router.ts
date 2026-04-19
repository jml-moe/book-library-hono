import { Hono } from "hono";
import { prisma } from "../../utils/prisma.js";
import { zValidator } from "@hono/zod-validator";
import { CreateBookSchema, UpdateBookSchema } from "./schema.js";

export const bookRouter = new Hono()

  // CRUD endpoints
  .get("/", async (c) => {
    const books = await prisma.book.findMany();

    return c.json({ books });
  })

  .get("/:id", async (c) => {
    const id = c.req.param("id");

    const book = await prisma.book.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!book) {
      return c.json({ message: "Book Not Found" }, 404);
    }

    return c.json(book);
  })

  .post("/", zValidator("json", CreateBookSchema), async (c) => {
    const body = c.req.valid("json");
    const newBook = await prisma.book.create({
      data: {
        author: body.author,
        title: body.title,
      },
    });
    return c.json(newBook, 201);
  })

  .patch("/:id", zValidator("json", UpdateBookSchema), async (c) => {
    const id = c.req.param("id");
    const body = c.req.valid("json");

    try {
      const updatedBook = await prisma.book.update({
        where: {
          id: Number(id),
        },
        data: {
          author: body.author,
          title: body.title,
        },
      });

      return c.json(updatedBook);
    } catch (error) {
      return c.json({ message: "Book not found" }, 404);
    }
  })

  .delete("/:id", async (c) => {
    const id = c.req.param("id");

    try {
      await prisma.book.delete({
        where: {
          id: Number(id),
        },
      });
      return c.json({ message: "Book deleted successfully" });
    } catch (error) {
      return c.json({ message: "Book not found" }, 404);
    }
  })

  // Actions endpoints
  .post("/:id/borrow", async (c) => {
    const id = c.req.param("id");

    const updatedBook = await prisma.book.update({
      where: {
        id: Number(id),
      },
      data: {
        isBorrowed: true,
      },
    });

    return c.json(updatedBook);
  })

  .post("/:id/return", async (c) => {
    const id = c.req.param("id");

    const updatedBook = await prisma.book.update({
      where: {
        id: Number(id),
      },
      data: {
        isBorrowed: false,
      },
    });

    return c.json(updatedBook);
  });
