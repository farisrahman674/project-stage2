import express from "express";
import postRoute from "./routes/post-route";
import commentRoute from "./routes/comment-route";
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/v1", postRoute);
app.use("/api/v2", commentRoute);

app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});
