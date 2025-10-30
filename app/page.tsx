"use client";
import { useState, useEffect } from "react";
import { sdk } from '@farcaster/miniapp-sdk'
import { useRouter } from "next/navigation";
import { minikitConfig } from "../minikit.config";
import styles from "./page.module.css";

export default function Home() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // Initialize the Farcaster miniapp
  useEffect(() => {
    sdk.actions.ready();
  }, []);

  // If you need to verify the user's identity, you can use the useQuickAuth hook.
  // This hook will verify the user's signature and return the user's FID. You can update
  // this to meet your needs. See the /app/api/auth/route.ts file for more details.
  // Note: If you don't need to verify the user's identity, you can get their FID and other user data
  // via `useMiniKit().context?.user`.
  // const { data, isLoading, error } = useQuickAuth<{
  //   userFid: string;
  // }>("/api/auth");


  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    // TODO: Save email to database/API
    console.log("Valid email submitted:", email);
    
    // Navigate to success page
    router.push("/success");
  };


  const handleAddMiniApp= async () =>{
    try {
      const result = await sdk.actions.addMiniApp();
      console.log("Mini app added:", result);
    } catch (error) {
      console.error("Error adding mini app:", error);
    }
  }
  
  
  return (
    <div className={styles.container}>
      <div className={styles.topButtons}>
        <button 
          className={styles.contextButton} 
          type="button"
          onClick={() => router.push("/context")}
        >
          Context
        </button>
        <button className={styles.closeButton} type="button">
          ✕
        </button>
      </div>
      
      <div className={styles.content}>
        <div className={styles.waitlistForm}>
          <h1 className={styles.title}>Join {minikitConfig.frame.name.toUpperCase()}</h1>
          
          <p className={styles.subtitle}>
            Get early access and be the first to experience the future of<br />
            crypto marketing strategy.
          </p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              type="email"
              placeholder="Your amazing email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.emailInput}
            />
            
            {error && <p className={styles.error}>{error}</p>}
            
            <button type="submit" className={styles.joinButton}>
              JOIN WAITLIST
            </button>
            <button onClick={handleAddMiniApp} type="submit" className={styles.joinButton}>
              NOTIFICATIONS
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
