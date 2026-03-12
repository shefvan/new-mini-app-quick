"use client";    
    
import { useEffect } from "react";    
import { useRouter } from "next/navigation";    
import "./loading.css";    
export default function LoadingPage() {    
  const router = useRouter();    
    
  useEffect(() => {    
    const t = setTimeout(() => {    
      router.replace("/spin"); // 👈 direct spin page    
    }, 2500); // 3 seconds    
    
    return () => clearTimeout(t);    
  }, [router]);    
    
  return (    
    <div    
      style={{    
        minHeight: "100vh",    
        background: "#000",    
        display: "flex",    
        alignItems: "center",    
        justifyContent: "center",    
      }}    
    >    
      <img    
        src="/WhatsApp Image 2026-02-06 at 6.06.06 PM.jpeg"    
        alt="grow me"    
        style={{    
          width: 220,    
          maxWidth: "80%",    
        }}    
      />    
    </div>    
  );    
}