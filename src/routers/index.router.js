import { Router } from "express";

import passport from "passport";

const router = Router();
router.get("/", (req, res) => {
    res.render("index", { title: "home", style: "home.css"});
  });

  export default router;