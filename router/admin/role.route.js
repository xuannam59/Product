const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/role.controller.js");

router.get("/", controller.index);

router.get("/create", controller.create);

router.post("/create", controller.createPost);

router.get("/edit/:id", controller.edit);

router.patch("/edit/:id", controller.editPatch);

router.delete("/delete/:id", controller.delete);

router.get("/premissions", controller.premission);

router.patch("/premissions", controller.premissionPatch)

module.exports = router;