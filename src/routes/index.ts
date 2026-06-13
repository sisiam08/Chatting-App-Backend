import { Router } from "express";
import { IRoute } from "../interfaces";
import { ConversationRoutes } from "../modules/conversation/conversation.route";
import { MessageRoutes } from "../modules/message/message.route";
import { UserRoutes } from "../modules/user/user.router";

const router = Router();

const routes: IRoute[] = [
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/conversations",
    route: ConversationRoutes,
  },
  {
    path: "/messages",
    route: MessageRoutes,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
