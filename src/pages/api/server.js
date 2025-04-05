import express from "express";
import cors from "cors";
import initialTimeCapsules from "../../data/Capsules.js";

const app = express();
const PORT = 5000;


app.use(cors());
app.use(express.json());

let timeCapsules = [...initialTimeCapsules];

const validateCapsule = (req, res, next) => {
  const { title, date, status, description } = req.body;
  
  if (!title || !date || !status || !description) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (!["Locked", "Unlocked"].includes(status)) {
    return res.status(400).json({ error: "Invalid status. Must be 'Locked' or 'Unlocked'." });
  }

  if (status === "Unlocked" && new Date(date) > new Date()){
    return res.status(400).json({error: "Invalid status. Must be 'Locked' if date is in the future."})
  }

  if (status === "Locked" && new Date(date) <= new Date()){
    return res.status(400).json({error: "Invalid status. Must be 'Unlocked' if date is in the past."})
  }

  if (isNaN(Date.parse(date)) || (new Date(date)).toISOString().split("T")[0] !== date) {
    return res.status(400).json({ error: "Invalid date format." });
  }

  next();
};

app.get('/', (req, res) =>{
    res.redirect('/capsules');
})

//GET all capsules
app.get("/capsules", (req, res) => {
  let { search, sort, status } = req.query;
  let result = [...timeCapsules];

  if (search) {
    result = result.filter((capsule) =>
      capsule.title.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (status === "Locked" || status === "Unlocked"){
    result = result.filter((capsule) => capsule.status === status);
  }

  if (sort === "asc" || sort === "desc") {
    result.sort((a, b) =>
      sort === "asc"
        ? a.date.localeCompare(b.date)
        : b.date.localeCompare(a.date)
    );
  }

  res.json(result);
});

// GET a capsule by ID
app.get("/capsule/:id", (req, res) => {
  const capsule = timeCapsules.find((c) => c.id === parseInt(req.params.id));
  if (!capsule) return res.status(404).json({ error: "Capsule not found" });
  res.json(capsule);
});

// POST - Add a new capsule
app.post("/capsules", validateCapsule, (req, res) => {
  const { title, date, status, description } = req.body;
  if (!title || !date || !status || !description) {
    return res.status(400).json({ error: "All fields are required" });
  }
  const newCapsule = {
    id: Math.max(...timeCapsules.map((c) => c.id)) + 1,
    title,
    date,
    status,
    description,
  };

  timeCapsules.push(newCapsule);
  res.status(201).json(newCapsule);
});

// PUT - Update a capsule
app.put("/capsule/:id", (req, res) => {
  const { title, date, status, description } = req.body;
  const capsuleIndex = timeCapsules.findIndex(
    (c) => c.id === parseInt(req.params.id)
  );

  if (capsuleIndex === -1) {
    return res.status(404).json({ error: "Capsule not found" });
  }

  timeCapsules[capsuleIndex] = {
    ...timeCapsules[capsuleIndex],
    title,
    date,
    status,
    description,
  };
  res.json(timeCapsules[capsuleIndex]);
});

// DELETE - Remove a capsule
app.delete("/capsules/:id", (req, res) => {
  const capsuleIndex = timeCapsules.findIndex(
    (c) => c.id === parseInt(req.params.id)
  );
  if (capsuleIndex === -1)
    return res.status(404).json({ error: "Capsule not found" });

  timeCapsules.splice(capsuleIndex, 1);
  res.json({ message: "Capsule deleted successfully" });
});



export default app;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}