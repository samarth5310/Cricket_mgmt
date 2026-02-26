import { useEffect, useState } from 'react';
import API from '../utils/api';

const PointsTable = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPointsTable();
  }, []);

  const fetchPointsTable = async () => {
    try {
      const { data } = await API.get('/teams/table/points');
      setTeams(data.data);
    } catch (error) {
      console.error('Error fetching points table:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-bold text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 md:py-20">
      <div className="container mx-auto px-3 sm:px-4">
        <h1 className="text-3xl sm:text-4xl md:text-7xl font-display text-center mb-6 md:mb-12 gradient-text">
          POINTS TABLE
        </h1>

        <div className="brutalist-border bg-[#24184a] overflow-hidden">
          <div className="px-4 py-3 text-center bg-[#3a2671] border-b-4 border-primary">
            <div className="text-xs sm:text-sm uppercase tracking-[0.3em] text-white/80">Standings</div>
            <div className="text-xl sm:text-2xl md:text-3xl font-display text-white">Tournament Table</div>
          </div>

          <table className="w-full table-fixed">
            <thead className="bg-primary text-dark">
              <tr>
                <th className="p-2 sm:p-3 text-center text-[10px] sm:text-xs font-bold uppercase w-10">#</th>
                <th className="p-2 sm:p-3 text-left text-[10px] sm:text-xs font-bold uppercase">Team</th>
                <th className="p-2 sm:p-3 text-center text-[10px] sm:text-xs font-bold uppercase w-10">P</th>
                <th className="p-2 sm:p-3 text-center text-[10px] sm:text-xs font-bold uppercase w-10">W</th>
                <th className="p-2 sm:p-3 text-center text-[10px] sm:text-xs font-bold uppercase w-10">T</th>
                <th className="p-2 sm:p-3 text-center text-[10px] sm:text-xs font-bold uppercase w-10">L</th>
                <th className="p-2 sm:p-3 text-center text-[10px] sm:text-xs font-bold uppercase w-12">Pts</th>
                <th className="p-2 sm:p-3 text-center text-[10px] sm:text-xs font-bold uppercase w-16">NRR</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team, index) => (
                <tr key={team._id} className="border-b border-white/10 odd:bg-[#2c1f5a] even:bg-[#24184a]">
                  <td className="p-2 sm:p-3 text-center font-bold text-primary text-xs sm:text-sm">{index + 1}</td>
                  <td className="p-2 sm:p-3">
                    <div className="font-bold text-xs sm:text-sm leading-tight break-words text-white uppercase">{team.shortName}</div>
                  </td>
                  <td className="p-2 sm:p-3 text-center text-xs sm:text-sm text-white">{team.matchesPlayed}</td>
                  <td className="p-2 sm:p-3 text-center text-xs sm:text-sm text-green-400 font-bold">{team.wins}</td>
                  <td className="p-2 sm:p-3 text-center text-xs sm:text-sm text-yellow-300 font-bold">{team.ties}</td>
                  <td className="p-2 sm:p-3 text-center text-xs sm:text-sm text-red-400 font-bold">{team.losses}</td>
                  <td className="p-2 sm:p-3 text-center text-xs sm:text-sm text-primary font-bold">{team.points}</td>
                  <td className={`p-2 sm:p-3 text-center text-xs sm:text-sm font-bold ${team.nrr >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {team.nrr > 0 ? '+' : ''}{team.nrr}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {teams.length === 0 && (
            <div className="p-6 md:p-12 text-center text-gray-300">
              <p className="text-base md:text-xl">No matches played yet</p>
            </div>
          )}
        </div>

        <div className="mt-6 md:mt-8 brutalist-card">
          <h3 className="font-bold text-base md:text-xl mb-3 md:mb-4 text-primary uppercase">Legend</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 text-xs md:text-sm">
            <div><span className="font-bold">P</span> - Played</div>
            <div><span className="font-bold">W</span> - Wins</div>
            <div><span className="font-bold">T</span> - Ties</div>
            <div><span className="font-bold">L</span> - Losses</div>
            <div><span className="font-bold">Pts</span> - Points (Win: 2, Tie: 1, Loss: 0)</div>
            <div><span className="font-bold">NRR</span> - Net Run Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PointsTable;
