import { useEffect, useState } from "react";
import { getVans } from "../api";

export function useVans() {
  const [vans, setVans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cachedData = localStorage.getItem("vans");

    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        if (Array.isArray(parsed)) {
          setVans(parsed);
          setLoading(false); // Use cache immediately
        } else {
          throw new Error("Invalid cache format");
        }
      } catch (e) {
        console.warn("Failed to parse cached vans:", e);
        localStorage.removeItem("vans");
      }
    }

    async function loadVans() {
      try {
        const data = await getVans();
        console.log("Vans from API:", data);
        setVans(data);
        localStorage.setItem("vans", JSON.stringify(data));
      } catch (err) {
        if (!cachedData) {
          setError(err.message || "An error occurred");
        }
      } finally {
        if (!cachedData) {
          setLoading(false); // If no cache, loading ends here
        }
      }
    }

    loadVans();
  }, []);

  return { vans, loading, error };
}
