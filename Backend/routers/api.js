const express = require('express');

const apiRouter = express.Router();

const profileRouter = require("./api/profile");
apiRouter.use("/profile", profileRouter);

const conversationRouter = require("./api/conversation");
apiRouter.use("/conversation", conversationRouter);

const userRouter = require("./api/user");
apiRouter.use("/user", userRouter);

const postRouter = require("./api/post");
apiRouter.use("/post", postRouter);

const imageRouter = require("./api/image");
apiRouter.use("/image", imageRouter);

module.exports = apiRouter;
