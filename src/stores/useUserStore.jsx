import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const SESSION_DURATION = 60 * 60 * 1000; // 1 hora = 3600000 ms

const useUserStore = create(
  persist(
    (set, get) => ({
      user: { role: "None" }, //estado inicial

      // Guardar usuario + registrar hora actual
      setUser: (userData) => set({ user: userData, lastActive: Date.now() }),
      lastActive: null, // Guardará cuándo fue la última actividad

      // Limpiar sesión manualmente o al expirar
      clearUser: () => set({ user: { role: "None" }, lastActive: null }),
      // Verificar si la sesión sigue activa
      //isLoggedIn: () => get().user?.role && get().user.role !== "None",
       isLoggedIn: () => {
        const { user, lastActive } = get();
        if (!user || user.role === "None" || !lastActive) return false;

        const now = Date.now();
        const inactiveTime = now - lastActive;

        // Si pasó más de 1 hora sin actividad
        if (inactiveTime > SESSION_DURATION) {
          // Limpiar automáticamente la sesión
          set({
            user: { role: "None" },
            lastActive: null,
          });
          sessionStorage.removeItem("user-storage");
          return false;
        }

        return true;
      },

      //  getUserId: () => {
      //   const { user } = get();
      //   return user?.id_usuario || null;
      // },
      
      userId: () => get().user?.id_usuario ?? null,

      // Actualizar timestamp de actividad
      updateActivity: () => {
        set({ lastActive: Date.now() });
      },

      isAdmin: () => get().user?.role === "admin",

      isUser: () => get().user?.role === "user",
    }),
    {
      name: "user-storage", // nombre del item en storage
      storage: createJSONStorage(() => sessionStorage), // cambiar a localStorge para que al reiniciar la pagina no se pierda la sesion
    }
  )
);

export default useUserStore;
