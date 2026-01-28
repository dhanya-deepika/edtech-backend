const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

/* ---------------- ADMIN LOGIN ---------------- */
app.post("/admin/login", async (req, res) => {
  const { username, password } = req.body;

  const admin = await prisma.admin.findFirst({
    where: { username, password },
  });

  if (!admin) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json({ message: "Login successful", admin });
});

/* ---------------- CREATE CLASS ---------------- */
app.post("/class", async (req, res) => {
  const { name, description, image } = req.body;

  const newClass = await prisma.class.create({
    data: {
      name,
      description,
      image,
    },
  });

  res.json(newClass);
});

/* ---------------- GET ALL CLASSES ---------------- */
app.get("/class", async (req, res) => {
  const classes = await prisma.class.findMany();
  res.json(classes);
});

/* ---------------- CREATE USER ---------------- */
app.post("/user", async (req, res) => {
  const { email, password, classId } = req.body;

  const user = await prisma.user.create({
    data: {
      email,
      password,
      classId: Number(classId),
    },
  });

  res.json(user);
});

/* ---------------- USER LOGIN ---------------- */
app.post("/user/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findFirst({
    where: { email, password },
    include: { class: true },
  });

  if (!user) {
    return res.status(401).json({ message: "Invalid login" });
  }

  res.json(user);
});

/* ---------------- GET USER CLASS INFO ---------------- */
app.get("/user/:id/class", async (req, res) => {
  const userId = Number(req.params.id);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { class: true },
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user.class);
});

/* ---------------- START SERVER ---------------- */
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});

