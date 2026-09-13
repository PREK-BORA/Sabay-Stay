import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { collection, getDocs, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useFavorites } from "~/composables/useFavorites";

export function useUserData() {
  const { $auth, $db } = useNuxtApp() as any;
  const { favorites } = useFavorites();
  const totalBookings = ref(0);

  let unsubscribe = () => {};

  onMounted(() => {
    if (!$auth || !$db) return;

    try {
      unsubscribe = onAuthStateChanged($auth, async (firebaseUser) => {
        if (!firebaseUser) {
          totalBookings.value = 0;
          return;
        }

        try {
          const snapshot = await getDocs(
            query(
              collection($db, "bookings"),
              where("userId", "==", firebaseUser.uid),
            ),
          );
          totalBookings.value = snapshot.size;
        } catch (error) {
          console.error("Failed to load user bookings count:", error);
        }
      });
    } catch (error) {
      console.error("Auth listener failed:", error);
    }
  });

  onBeforeUnmount(() => unsubscribe());

  return {
    rewardPoints: computed(() => 0),
    totalBookings,
    totalFavorites: computed(() => favorites.value.length),
  };
}
