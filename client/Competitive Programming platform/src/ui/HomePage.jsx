import { useState, useEffect } from "react";
import axios from "axios";
import Layout from "./Layout";
import StatCards from "./StatCards";
import ContestSection from "./ContestSection";
import "./styles.css"; // Ensure styles are applied
import { API_BASE_URL } from "../config";

export default function HomePage() {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);

  // We could fetch user progress here to pass to StatCards, 
  // but for now we'll pass placeholders/calculated values
  const [solvedCount, setSolvedCount] = useState(0);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        // Fetch contests
        const contestRes = await axios.get(`${API_BASE_URL}/api/contests`);
        setContests(contestRes.data);

        // Fetch user progress for Solved Problems count if logged in
        const userid = localStorage.getItem("userid");
        if (userid) {
           const userRes = await axios.get(`${API_BASE_URL}/user/${userid}`);
           if (userRes.data?.progress) {
             const total = userRes.data.progress.reduce((acc, curr) => acc + (curr.questionsDone || 0), 0);
             setSolvedCount(total);
           }
        }

      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  return (
    <Layout>
      <h1 className="page-title">Dashboard</h1>
      
      <StatCards 
        contestCount={contests.length} 
        solvedCount={solvedCount} 
      />

      {loading ? (
        <div className="empty-state">Loading contests...</div>
      ) : (
        <ContestSection contests={contests} />
      )}
    </Layout>
  );
}
