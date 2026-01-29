const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("EdTech Backend API is running 🚀");
});


app.post("/admin/login", async (req, res) => {    /*  ADMIN LOGIN  */
  const { username, password } = req.body;

  const admin = await prisma.admin.findFirst({
    where: { username, password },
  });

  if (!admin) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json({ message: "Login successful", admin });
});


app.post("/class", async (req, res) => {    /* CREATE CLASS  */
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


app.get("/class", async (req, res) => {   /*  GET ALL CLASSES  */
  const classes = await prisma.class.findMany();
  res.json(classes);
});


app.post("/user", async (req, res) => {   /*  CREATE USER */
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


app.post("/user/login", async (req, res) => { /*  USER LOGIN  */
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


app.get("/user/:id/class", async (req, res) => { /*  GET USER CLASS INFO  */
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


const PORT = process.env.PORT || 5000; /*  START SERVER  */

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



app.get("/user", async (req, res) => {  /*  GET ALL USERS  */
  const users = await prisma.user.findMany({
    include: { class: true },
  });
  res.json(users);
});



app.delete("/class/:id", async (req, res) => {  /* DELETE CLASS */
  const id = Number(req.params.id);
  await prisma.class.delete({ where: { id } });
  res.json({ message: "Class deleted" });
});


app.delete("/user/:id", async (req, res) => {   /* DELETE USER */
  const id = Number(req.params.id);
  await prisma.user.delete({ where: { id } });
  res.json({ message: "User deleted" });
});
