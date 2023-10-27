import { Router } from "express";
import productManager from "../dao/productManager.js";

const router = Router();

router.get("/products", async (req, res) => {
  const { query = {} } = req;
  const product = await productManager.get(query);
  res.status(200).json(product);
});

router.get("/products/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productManager.getById({ _id: pid });
    if (!product) {
      return res.status(404).json({ message: "No user found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

router.post("/products", async (req, res) => {
  try {
    const { body } = req;
    const result = await productManager.createProduct(body);
    res.status(201).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

router.put("/products/pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const { body } = req;
    const result = await productManager.updateById(pid, body);
    res.status(201).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

router.delete("/products/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const result = await productManager.deleteById(pid);
    res.status(200).json(result);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
});

export default router;
