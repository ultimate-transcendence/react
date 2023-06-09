import express from "express";
import cors from "cors";
import { AppDataSource } from "./data-source";
import bodyParser from "body-parser";
import { User } from "./entity/User";
import bcrypt from "bcrypt";

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.listen(8080, () => {
  console.log("Server is listening 8080 port\n localhost:8080");
});

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected");
  })
  .catch((error) => console.log(error));

app.get("/", (req, res) => {

  res.send("Hello World!");
});


app.post("/signup", async (req, res) => {
  const { userId, password } = req.body;

  const user = new User();

  const userRepository = AppDataSource.getRepository(User);
  const hashed = await bcrypt.hash(password, 10);
  user.userID = userId;
  user.password = hashed;
  userRepository.save(user);

  return res.send("signup success");
});

app.post("/login", async (req, res) => {
  const { userId, password } = req.body;

  const userRepository: any = AppDataSource.getRepository(User);
  const user = await userRepository.findOne({ where: { userID: userId } });

  console.log(user);
  if (!user) {
    return res.status(401).send("user not found");
  }
  const isMatch = await bcrypt.compare(password, user.password);

  console.log(password + '\n', user.password);

  if (!isMatch) {
    return res.status(401).send("password not match");
  }

  return res.status(200).send("login success");
}
);
