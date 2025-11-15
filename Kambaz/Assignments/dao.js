import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const DB_PATH = path.join(process.cwd(), "Kambaz", "Database", "db.json");

function loadDb() {
  return JSON.parse(fs.readFileSync(DB_PATH));
}

function saveDb(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

export default function AssignmentsDao() {

  function findAssignments(courseId) {
    const db = loadDb();
    return db.assignments.filter(a => a.course === courseId);
  }

  function createAssignment(assignment) {
    const db = loadDb();
    const newAssignment = { ...assignment, _id: uuidv4() };
    db.assignments.push(newAssignment);
    saveDb(db);
    return newAssignment;
  }

  function deleteAssignment(id) {
    const db = loadDb();
    db.assignments = db.assignments.filter(a => a._id !== id);
    saveDb(db);
  }

  function updateAssignment(id, updates) {
    const db = loadDb();
    const a = db.assignments.find(a => a._id === id);
    Object.assign(a, updates);
    saveDb(db);
    return a;
  }

  return {
    findAssignments,
    createAssignment,
    deleteAssignment,
    updateAssignment
  };
}

