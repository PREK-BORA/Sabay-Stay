import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { collection, getDocs, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export function useUserData() {
  const { $auth, $db } = useNuxtApp();
  const totalBookings = ref(0);

  let unsubscribe = () => {};

  onMounted(() => {
    unsubscribe = onAuthStateChanged($auth, async (firebaseUser) => {
      if (!firebaseUser) {
        totalBookings.value = 0;
        return;
      }

      const snapshot = await getDocs(
        query(
          collection($db, "bookings"),
          where("userId", "==", firebaseUser.uid),
        ),
      );
      totalBookings.value = snapshot.size;
    });
  });

  onBeforeUnmount(() => unsubscribe());

  return {
    rewardPoints: computed(() => 0),
    totalBookings,
    totalFavorites: computed(() => 0),
  };
}
