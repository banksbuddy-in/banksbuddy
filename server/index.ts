import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, push, set, remove, update } from "firebase/database";

// Load environment variables
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID,
  databaseURL: process.env.VITE_FIREBASE_DATABASE_URL
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const server = express();
server.use(cors());
server.use(express.json());

server.get("/", (req: express.Request, res: express.Response) => {
  res.send("BanksBuddy API Server is running");
});

// Generic GET endpoint (e.g., /api/data/reviews or /api/data/users/123)
server.get("/api/data/*path", async (req: express.Request, res: express.Response) => {
  const path = req.params[0];
  try {
    const snapshot = await get(ref(db, path));
    if (snapshot.exists()) {
      res.json(snapshot.val());
    } else {
      res.json(null);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Generic POST (push) endpoint for creating new items in a list (generates ID)
server.post("/api/data/*path", async (req: express.Request, res: express.Response) => {
  const path = req.params[0];
  try {
    const newRef = push(ref(db, path));
    await set(newRef, req.body);
    res.json({ id: newRef.key, ...req.body });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Generic PUT (set) endpoint for updating/overwriting at a specific path
server.put("/api/data/*path", async (req: express.Request, res: express.Response) => {
  const path = req.params[0];
  try {
    await set(ref(db, path), req.body);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Generic PATCH (update) endpoint for specific fields
server.patch("/api/data/*path", async (req: express.Request, res: express.Response) => {
  const path = req.params[0];
  try {
    await update(ref(db, path), req.body);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Generic DELETE endpoint
server.delete("/api/data/*path", async (req: express.Request, res: express.Response) => {
  const path = req.params[0];
  try {
    await remove(ref(db, path));
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});