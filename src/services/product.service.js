// services/product.service.js
import productManager from "../dao/productManager.js";
import Exception from "../utils.js";

export default class productService {
  static async getProducts(query = {}) {
    try {
      const { filter, options } = query;
      return await productManager.get(filter, options);
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }

  static async getProductById(pid) {
    try {
      const product = await productManager.getById(pid);
      if (!product) {
        throw new Exception("No existe el producto", 404);
      }
      return product;
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }

  static async createProduct(product) {
    try {
      if(product.stock < 0) throw new Exception("Debe agregar stock del producto", 404);
      if(product.price < 0) throw new Exception("Debe agregar el precio del producto", 404);

      return await productManager.createProduct(product);
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }

  static async updateProductById(pid, data) {
    try {
      const product = await productManager.getById(pid);
      if (!product) throw new Exception("El producto no existe", 404);

      if(data.stock < 0) throw new Exception("Debe agregar stock del producto", 404);
      if(data.price < 0) throw new Exception("Debe agregar el precio del producto", 404);

      const criterio = { _id: pid };
      const operation = { $set: data };

      const response = await productManager.updateOne(criterio, operation);
      console.log("Producto actualizado");
      return { message: response.message };
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }

  static async deleteProductById(pid) {
    try {
      const product = await productManager.getById(pid);
      if (!product) throw new Exception("El producto no existe", 404);

      const response = await productManager.deleteById(pid);
      console.log("Producto eliminado");
      return { message: response.message };
    } catch (error) {
      throw new Exception(error.message, error.status);
    }
  }
}
