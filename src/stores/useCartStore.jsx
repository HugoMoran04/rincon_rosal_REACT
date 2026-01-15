import { create } from "zustand";

const useCartStore = create((set, get) => ({
  cart: [],

  addToCart: (product, quantity = 1) => {
    const cart = get().cart;
    const existingProduct = cart.find((item) => item.id_producto === product.id_producto);

    if (existingProduct) {
      // Actualizamos cantidad sumando quantity, puede ser negativa
      const newCart = cart
        .map((item) => {
          if (item.id_producto === product.id_producto) {
            const newQuantity = item.quantity + quantity;
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter((item) => item.quantity > 0); // eliminamos si llega a 0
      set({ cart: newCart });
    } else if (quantity > 0) {
      // Añadimos nuevo producto solo si quantity > 0
      set({ cart: [...cart, { ...product, quantity }] });
    }
  },

  removeFromCart: (id_producto) => {
    set({ cart: get().cart.filter((item) => item.id_producto !== id_producto) });
  },

  clearCart: () => set({ cart: [] }),

  totalItems: () => get().cart.reduce((total, item) => total + item.quantity, 0),
}));

export default useCartStore;
