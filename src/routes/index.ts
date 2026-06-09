import { Router } from "express";
import { IRoute } from "../interfaces";
import { ConversationRoutes } from "../module/conversation/conversation.route";
import { MessageRoutes } from "../module/message/message.route";

const router = Router();

const routes: IRoute[] = [
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
