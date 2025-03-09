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

export default function View() {
  const [elections, setElections] = useState<Election[]>([]);
  const [selectedElection, setSelectedElection] = useState<Election | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetchElections();
  }, []);

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

  const getVotePercentage = (count: number, total: number) => {
    return total === 0 ? 0 : ((count / total) * 100).toFixed(1);
  };

  const getTotalVotes = (election: Election) => {
    return election.options.reduce((sum, opt) => sum + opt.count, 0);
  };

  const getWinner = (election: Election) => {
    if (!election.options.length) return null;
    return election.options.reduce((prev, current) => (prev.count > current.count) ? prev : current);
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">Election Results</h1>
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
          {/* Left sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 mb-6">
              <h2 className="text-xl font-bold text-white mb-4">Results Dashboard</h2>
              
              {selectedElection && (
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <h3 className="text-lg font-semibold text-blue-300">Total Votes</h3>
                    <p className="text-3xl font-bold text-white mt-1">{getTotalVotes(selectedElection)}</p>
                  </div>
                  
                  {getWinner(selectedElection) && (
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <h3 className="text-lg font-semibold text-blue-300">Leading Candidate</h3>
                      <div className="flex items-center mt-2">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg mr-3">
                          {getWinner(selectedElection)?.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-lg font-bold text-white">{getWinner(selectedElection)?.name}</p>
                          <p className="text-sm text-blue-300">
                            {getWinner(selectedElection)?.count} votes 
                            ({getVotePercentage(getWinner(selectedElection)?.count || 0, getTotalVotes(selectedElection))}%)
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <div className="border-t border-white/10 pt-4 mt-4">
                <button 
                  onClick={() => router.push("/")} 
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-4 rounded-lg shadow-lg flex items-center justify-center transition-all duration-300 transform hover:scale-105 mb-3"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Voting
                </button>
                
                {user && (
                  <button 
                    onClick={handleLogout} 
                    className="w-full bg-red-500/80 hover:bg-red-600/80 text-white py-3 px-4 rounded-lg shadow-lg flex items-center justify-center transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* Main content area - election results */}
          <div className="md:col-span-2">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Election Results</h2>
              
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
                    <option key={e._id} value={e._id}>{e.title}</option>
                  ))}
                </select>
              </div>
              
              {!selectedElection && (
                <div className="text-center py-12 border-2 border-dashed border-blue-500/30 rounded-xl bg-blue-500/5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-blue-400 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p className="text-blue-200 mt-4">Please select an election to view results</p>
                </div>
              )}
              
              {selectedElection && (
                <div className="mt-6">
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-6">
                    <h3 className="text-xl font-bold text-white">{selectedElection.title}</h3>
                    <p className="text-blue-300 mt-2">Total votes: {getTotalVotes(selectedElection)}</p>
                  </div>
                  
                  <div className="space-y-6">
                    {selectedElection.options.map((candidate) => {
                      const totalVotes = getTotalVotes(selectedElection);
                      const percentage = getVotePercentage(candidate.count, totalVotes);
                      const isWinner = getWinner(selectedElection)?.name === candidate.name;
                      
                      return (
                        <div key={candidate.name} className={`bg-white/5 rounded-xl p-6 border ${isWinner ? 'border-blue-500/50' : 'border-white/10'} ${isWinner ? 'shadow-lg shadow-blue-500/20' : ''}`}>
                          <div className="flex items-center mb-3">
                            <div className={`h-12 w-12 rounded-full ${isWinner ? 'bg-gradient-to-r from-blue-400 to-purple-500' : 'bg-white/10'} flex items-center justify-center text-white font-bold text-lg mr-4`}>
                              {candidate.name.charAt(0)}
                            </div>
                            <div>
                              <h4 className="text-lg font-bold text-white flex items-center">
                                {candidate.name}
                                {isWinner && (
                                  <span className="ml-3 bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded-full flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Leading
                                  </span>
                                )}
                              </h4>
                              <p className="text-blue-300">{candidate.count} votes ({percentage}%)</p>
                            </div>
                          </div>
                          
                          <div className="w-full bg-white/5 rounded-full h-4 overflow-hidden">
                            <div 
                              className={`h-4 rounded-full ${isWinner ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-blue-500/50'}`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
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