// importing
import cors from "cors";
import express from "express";
import rateLimiter from "express-rate-limit";
import mongoose from "mongoose";
import Pusher from "pusher";
import Messages from "./models/Message.js";
import helmet from "helmet";
import hpp from "hpp";
import xss from "xss";
import mongoSanitize  from "express-mongo-sanitize";
import routes from "./routes/route.js";

//app config
const app = express();
const port = process.env.PORT || 9000;

const pusher = new Pusher({
    appId: "1524312",
    key: "fc2a2aeac06bd3041897",
    secret: "52a897c2c500d170ef23",
    cluster: "ap2",
    useTLS: true
  });

// Rate Limiter  -
const limiter = rateLimiter ({
  windowMs: 15 * 60 * 1000,
  max: 100,
});  

// middleware
app.use(express.json());
app.use(cors());
app.use(limiter); // limiting as we are using free service to host this. 
//app.use(xss()); // santize body, params, url
app.use(hpp()); // To prevent HTTP parameter pollution attack
app.use(helmet()); // To secure from setting various HTTP headers
app.use(mongoSanitize());

// DB config
const connection_url =  "mongodb+srv://admin:KOiVeT28CYD5pdvO@atlascluster.8bnisep.mongodb.net/testdb?retryWrites=true&w=majority";

//MongoDb connection
try {
  mongoose.connect(connection_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
  //,() => console.log("Mongoose is connected")
  );
} catch (error) {
  console.log("could not connect");
}

// pusher
const db = mongoose.connection;

db.once("open", () => {
  console.log("DB connected");

  const chatsCollection = db.collection("message");
  const changeStream = chatsCollection.watch();

  changeStream.on("change", (change) => {
    console.log("A change occured", change);

    if (change.operationType === "insert") {
      const messageDetails = change.fullDocument;
      pusher.trigger("message", "inserted", messageDetails);
    } else {
      console.log("Error triggering Pusher");
    }

    // Update chats
    if (change.operationType === "update") {
      const messageDetails = change;
      pusher.trigger("messages", "updated", {
        _id: messageDetails.documentKey._id,
        messages: messageDetails.updateDescription.updatedFields.chats
      });
    } else {
      console.log("error triggering pusher");
    }

  });
});

// api routes
app.use("/", routes)

// listen
app.listen(port, () => console.log(`Listening on localhost:${port}`));
