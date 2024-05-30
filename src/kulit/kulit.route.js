const { getHomeData } = require("./kulit.controller");

const router = require("express").Router();

router.get("/home", getHomeData);

module.exports = router;