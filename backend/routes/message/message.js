import {asyncHandler} from "../../middlewares/errorHandlers.js";
import Message from "../../models/Message.js";
import User from "../../models/User.js";
import mongoose from "mongoose";

let message = {};


//#region : messages CRUD operations.

//Read - fetch all messages for a given user.
message.syncMessages = asyncHandler(async (req, res, next) => {
  //console.log("sync request recieved");
  const messages = await Messages.find({
    $or: [{ user: req.params.userId }, { to: req.params.userId }]
  })
  .populate("user", "")
  .populate("to", "");

  res.send(messages);
});

//Create - send a message.
message.sendMessage =  asyncHandler(async (req, res, next) => {
  const dbMessage = req.body;
//   Messages.create(dbMessage, (err, data) => {
//     if (err) {
//       res.status(500).send(err);
//     } else {
//       res.status(201).send(data);
//     }
//   });

req.body.user = mongoose.Types.ObjectId(req.body.user);
  req.body.to = mongoose.Types.ObjectId(req.body.to);
  // Check if room already exits
  const roomExists = await Message.findOne({
    $or: [
      {
        $and: [{ user: req.body.user }, { to: req.body.to }],
      },
      {
        $and: [{ user: req.body.to }, { to: req.body.user }],
      },
    ],
  });

  // If room exits, then append the message to the room
  if (roomExists) {
    const pushedMessage = await Message.findOneAndUpdate(
      {
        $or: [{ user: req.body.user }, { to: req.body.user }],
      },
      {
        $addToSet: {
          chats: { user: req.body.user, message: req.body.message },
        },
      }
    ).populate("user", "name");

    res.send(pushedMessage);
  }
  // If not, create a room and append the message
  else {
    var data = {
      user: req.body.user,
      to: req.body.to,
      chats: [
        {
          user: req.body.user,
          message: req.body.message,
        },
      ],
    };
    const newRoom = new Message(data);
    const savedRoom = await newRoom.save();

    res.send(savedRoom);
  }

});


//Fetch messages from spedific chats.
message.fetchMessages = asyncHandler(async (req, res, next) => {
    req.body.user = mongoose.Types.ObjectId(req.body.user);
    // Check if room already exits
    const messages = await Message.find({
      $or: [
        {
          user: req.params.userId,
        },
        {
          to: req.params.userId,
        },
      ],
    }).populate("user to", "name online lastSeen");
  
    res.send(messages);
  });

//#endregion



export default message;

