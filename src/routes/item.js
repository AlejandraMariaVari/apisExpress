const { Router } = require("express");
const router = Router();
const ItemController = require("../controllers/ItemController");

router.get("/", async (req, res) => {
  const resp = await ItemController.find(req.query);
  return res.status(resp.code).send(resp.data);
});

router.get("/:id", async (req, res) => {
  const resp = await ItemController.findOne(req.params);
  return res.status(resp.code).send(resp.data);
});

module.exports = router;
