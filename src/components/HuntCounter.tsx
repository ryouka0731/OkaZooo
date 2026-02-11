// src/components/HuntCounter.tsx
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const COUNTER_KEY = "zooo_hunt_counter";
const CONTENT_ID_KEY = "zooo_content_id";

function getCounter() {
  return Number(localStorage.getItem(COUNTER_KEY) || "0");
}
function setCounter(val: number) {
  localStorage.setItem(COUNTER_KEY, String(val));
}
function resetCounter() {
  localStorage.setItem(COUNTER_KEY, "0");
}
function getContentId() {
  let id = localStorage.getItem(CONTENT_ID_KEY);
  if (!id) {
    id = Math.random().toString(36).substring(2);
    localStorage.setItem(CONTENT_ID_KEY, id);
  }
  return id;
}

export default function HuntCounter() {
  const [count, setCount] = useState(getCounter());
  const [purified, setPurified] = useState(false);
  const [worldCount, setWorldCount] = useState<number | null>(null);

  useEffect(() => {
    setCount(getCounter());
    const interval = setInterval(() => {
      setCount(getCounter());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (count >= 1000 && !purified) {
      setPurified(true);
      setTimeout(() => {
        resetCounter();
        setCount(0);
        setPurified(false);
      }, 3000);
    }
  }, [count, purified]);

  useEffect(() => {
    async function fetchWorldCount() {
      const now = new Date();
      const fiveMinAgo = new Date(now.getTime() - 5 * 60 * 1000);
      const { data, error } = await supabase
        .from("hunt_logs")
        .select("content_id, hunted_at")
        .gte("hunted_at", fiveMinAgo.toISOString());
      if (error || !data) return;
      const unique = new Set(data.map((row: any) => row.content_id));
      setWorldCount(unique.size);
    }
    fetchWorldCount();
    const interval = setInterval(fetchWorldCount, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleHunt = async () => {
    if (purified) return;
    const newCount = count + 1;
    setCounter(newCount);
    setCount(newCount);
    await supabase.from("hunt_logs").insert([
      {
        content_id: getContentId(),
        hunted_at: new Date().toISOString(),
      },
    ]);
  };

  if (purified) {
    return (
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "#fff",
        color: "#000",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "2rem",
      }}>
        <div>徳を積みました。全ての業（データ）を解放します。</div>
      </div>
    );
  }

  return (
    <div style={{ position: "fixed", bottom: 16, right: 16, zIndex: 1000 }}>
      <div style={{ marginBottom: 8 }}>
        <button
          style={{
            padding: "8px 16px",
            fontSize: "1.2rem",
            background: "#222",
            color: "#fff",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
          }}
          onClick={handleHunt}
        >
          ハントする（ズリ）
        </button>
      </div>
      <div>ズリ・カウンター: {count}</div>
      {worldCount !== null && (
        <div style={{ fontSize: "0.9rem", marginTop: 4 }}>
          今、世界中で {worldCount} 人がズー(Zooo)っています
        </div>
      )}
    </div>
  );
}
