import express from "express";
import messages from "./message/message.js";
import user from "./user/user.js";
const router = express.Router();


//TEST default get when you start server - just to show if server is up
router.get("", (req, res) => res.status(200).send("hello world! this is ChatApp backend"));

//message operations
router
  .post("/message/send", messages.sendMessage)
  .get("/message/sync/:userId", messages.syncMessages)
  .get("/message/fetchMessages/:userId", messages.fetchMessages);

//User Operations.
  router
  .post("/user/create", user.create)
  .post("/user/updateOnlineStatus", user.updateOnlineStatus)
  .post("/user/updateOfflineStatus", user.updateOfflineStatus);
export default router;