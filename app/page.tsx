"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface VoteOption {
  name: string;
  count: number;
}

interface Election {
  _id: string;
  title: string;
  options: VoteOption[];
}

interface User {
  name: string;
  email: string;
  votedElections: string[];
}

export default function Home() {
  const [elections, setElections] = useState<Election[]>([]);
  const [selectedElection, setSelectedElection] = useState<Election | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isVoting, setIsVoting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      fetchUser(parsedUser.email);
    } else {
      router.push("/login");
    }
  }, []);

  const fetchUser = async (email: string) => {
    try {
      const res = await fetch(`/api/users?email=${email}`);
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        console.error("Failed to fetch user");
        toast.error("Could not load user data. Please try logging in again.");
        router.push("/login");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      toast.error("Network error. Please check your connection.");
    }
  };

  useEffect(() => {
    if (user) {
      fetchElections();
    }
  }, [user]);

  const fetchElections = async () => {
    try {
      const res = await fetch("/api/elections");
      if (res.ok) {
        const data: Election[] = await res.json();
        setElections(data);
      } else {
        console.error("Failed to fetch elections");
        toast.error("Could not load elections. Please try again later.");
      }
    } catch (error) {
      console.error("Error fetching elections:", error);
      toast.error("Network error. Please check your connection.");
    }
  };

  const vote = async (option: string) => {
    if (!user || !selectedElection) {
      toast.error("Please select an election before voting.");
      return;
    }

    setIsVoting(true);
    try {
      const payload = { email: user.email, electionId: selectedElection._id, option };
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Your vote has been successfully recorded!");

        const updatedUser = { ...user, votedElections: [...user.votedElections, selectedElection._id] };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));

        // Refresh elections to get updated counts
        fetchElections();
        setSelectedElection(null);
      } else {
        const errorData = await res.json();
        toast.error(`Error: ${errorData.error}`);
        console.error("Vote failed:", errorData);
      }
    } catch (error) {
      console.error("Error submitting vote:", error);
      toast.error("Network error. Please check your connection.");
    } finally {
      setIsVoting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    toast.info("Logged out successfully");
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900">
      {/* Header */}
      <header className="w-full bg-black/20 backdrop-blur-lg border-b border-white/10 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">Election Portal</h1>
          </div>
          
          {user && (
            <div className="flex items-center">
              <div className="mr-4">
                <p className="text-blue-200">Hello, <span className="text-white font-semibold">{user.name}</span></p>
                <p className="text-xs text-blue-300">{user.email}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg border border-white/20 transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow py-12 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {/* Left sidebar - user status */}
          <div className="md:col-span-1">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
              <h2 className="text-xl font-bold text-white mb-4">Your Status</h2>
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                  {user?.name.charAt(0) || "?"}
                </div>
                <div>
                  <p className="text-lg font-semibold text-white">{user?.name}</p>
                  <p className="text-sm text-blue-300">{user?.email}</p>
                </div>
              </div>
              <div className="border-t border-white/10 pt-4 mt-4">
                <p className="text-blue-200 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  Elections Voted: <span className="text-white font-medium ml-1">{user?.votedElections.length || 0}</span>
                </p>
                <p className="text-blue-200 flex items-center mt-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                  Available Elections: <span className="text-white font-medium ml-1">{elections.length}</span>
                </p>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Actions</h2>
              <button 
                onClick={() => router.push("/view")} 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-4 rounded-lg shadow-lg mb-3 flex items-center justify-center transition-all duration-300 transform hover:scale-105"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                View Results
              </button>
              
              <button 
                onClick={handleLogout} 
                className="w-full bg-red-500/80 hover:bg-red-600/80 text-white py-3 px-4 rounded-lg shadow-lg flex items-center justify-center transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
          
          {/* Main content area - elections */}
          <div className="md:col-span-2">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Available Elections</h2>
              
              {elections.length === 0 ? (
                <div className="text-center py-12">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-blue-400 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-blue-200 mt-4">No elections are currently available.</p>
                </div>
              ) : (
                <div>
                  <div className="mb-6">
                    <label htmlFor="election-select" className="block text-sm font-medium text-blue-300 mb-2">Select an Election</label>
                    <select 
                      id="election-select"
                      value={selectedElection?._id || ""}
                      onChange={(e) => {
                        const election = elections.find(el => el._id === e.target.value);
                        setSelectedElection(election || null);
                      }}
                      className="w-full px-4 py-3 bg-white/10 border border-blue-300/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black appearance-none"
                    >
                      <option value="">-- Select an Election --</option>
                      {elections.map((e) => (
                        <option 
                          key={e._id} 
                          value={e._id} 
                          disabled={user?.votedElections.includes(e._id)}
                        >
                          {e.title} {user?.votedElections.includes(e._id) ? "(Already Voted)" : ""}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  
                  {!selectedElection && (
                    <div className="text-center py-6 border-2 border-dashed border-blue-500/30 rounded-xl bg-blue-500/5">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                      </svg>
                      <p className="text-blue-200 mt-4">Please select an election to continue</p>
                    </div>
                  )}
                  
                  {selectedElection && (
                    <div className="mt-6 bg-white/5 rounded-xl p-6 border border-white/10">
                      <div className="mb-6">
                        <h3 className="text-xl font-bold text-white">{selectedElection.title}</h3>
                        <p className="text-blue-300 mt-2">
                          {user?.votedElections.includes(selectedElection._id) 
                            ? "You have already voted in this election." 
                            : "Please select a candidate to cast your vote."}
                        </p>
                      </div>
                      
                      {user?.votedElections.includes(selectedElection._id) ? (
                        <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 text-blue-200">
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Your vote has been recorded for this election. Thank you for participating!
                          </div>
                        </div>
                      ) : (
                        <div className="grid gap-3">
                          {selectedElection.options.map((candidate) => (
                            <button 
                              key={candidate.name}
                              onClick={() => vote(candidate.name)} 
                              disabled={isVoting}
                              className="flex items-center justify-between bg-white/10 hover:bg-white/20 border border-white/20 text-white py-4 px-6 rounded-lg transition-colors"
                            >
                              <div className="flex items-center">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg mr-4">
                                  {candidate.name.charAt(0)}
                                </div>
                                <span className="text-lg">{candidate.name}</span>
                              </div>
                              <div className="bg-white/10 rounded-lg py-1 px-4">
                                Vote
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="w-full bg-black/30 backdrop-blur-sm border-t border-white/10 py-4 px-6">
        <div className="max-w-6xl mx-auto text-center text-blue-300 text-sm">
          &copy; {new Date().getFullYear()} Election Portal. All rights reserved.
        </div>
      </footer>
    </div>
  );
}