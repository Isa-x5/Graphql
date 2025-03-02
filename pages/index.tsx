import { useEffect } from "react";
import { useRouter } from "next/router";
import '../style/global.css';  

const IndexPage = () => { 
  const router = useRouter(); // Initialize Next.js router instance

  useEffect(() => {
    router.push("/login");
  }, [router]);  // The effect runs once when the component mounts (dependency: router)

  return null; // Prevents flashing unwanted content by rendering nothing
};

export default IndexPage; // Exporting the component for use in Next.js
