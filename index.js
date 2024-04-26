const express = require("express");
const app = express();

let persons = [
  {
    id: "1",
    name: "Sam",
    age: "26",
    hobbies: [],
  },
];

app.get("/person/:personId?", (req, res) => {
  const { personId } = req.params;
  if (personId) {
    const person = persons.find((person) => person.id === personId);
    if (person) {
      res.json(person);
    } else {
      res.status(404).json({ error: "Person not found" });
    }
  } else {
    res.json(persons);
  }
});

app.post("/person", (req, res) => {
  const { name, age, hobbies } = req.body;
  if (!name || !age) {
    res.status(400).json({ error: "Name and age are required" });
  } else {
    const newPerson = { id: uuidv4(), name, age, hobbies: hobbies || [] };
    persons.push(newPerson);
    res.status(201).json(newPerson);
  }
});

app.put("/person/:personId", (req, res) => {
  const { personId } = req.params;
  const { name, age, hobbies } = req.body;
  const personIndex = persons.findIndex((person) => person.id === personId);
  if (personIndex !== -1) {
    if (name) persons[personIndex].name = name;
    if (age) persons[personIndex].age = age;
    if (hobbies) persons[personIndex].hobbies = hobbies;
    res.json(persons[personIndex]);
  } else {
    res.status(404).json({ error: "Person not found" });
  }
});

app.delete("/person/:personId", (req, res) => {
  const { personId } = req.params;
  const personIndex = persons.findIndex((person) => person.id === personId);
  if (personIndex !== -1) {
    persons.splice(personIndex, 1);
    res.status(204).end();
  } else {
    res.status(404).json({ error: "Person not found" });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
