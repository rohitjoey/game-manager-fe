import { useEffect, useState } from "react";
import api from "../config/axios";
import { Crown } from "lucide-react";

interface PlayerStats {
  id: string;
  name: string;
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  ratio: string;
  goalsScored: number;
  goalsConceeded: number;
  gd: number;
}

export const DashboardTable = () => {
  const [rows, setRows] = useState<PlayerStats[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get<PlayerStats[]>("/dashboard");
        setRows(response.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>{error}</p>
      </div>
    );
  }
  return (
    <>
      <table className="min-w-full divide-y divide-gray-300">
        <thead>
          <tr>
            <th className="px-6 py-3 text-center text-sm font-semibold bg-red-300">
              Player name
            </th>
            <th className="px-6 py-3 text-center text-sm font-semibold bg-red-200">
              Games played
            </th>
            <th className="px-6 py-3 text-center text-sm font-semibold bg-red-300">
              Wins
            </th>
            <th className="px-6 py-3text-center text-sm font-semibold bg-red-200">
              Losses
            </th>
            <th className="px-6 py-3 text-center text-sm font-semibold bg-red-300">
              Ratio (Games Played/Win)
            </th>
            <th className="px-6 py-3 text-center text-sm font-semibold bg-red-200">
              Goals For
            </th>
            <th className="px-6 py-3 text-center text-sm font-semibold bg-red-300">
              Goals Against
            </th>
            <th className="px-6 py-3 text-center text-sm font-semibold bg-red-200">
              Goals Difference
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-black bg-white">
          {rows.map((row, index) => (
            <tr key={row.name} className="hover:bg-gray-50">
              <td className="whitespace-nowrap text-center px-6 py-4 text-sm ">
                {index == 0 ? <Crown  className="h-4 w-4 rotate-315"/> : null} {row.name}
              </td>
              <td className="whitespace-nowrap text-center px-6 py-4 text-sm ">
                {row.gamesPlayed}
              </td>
              <td className="whitespace-nowrap text-center px-6 py-4 text-sm ">
                {row.gamesWon}
              </td>
              <td className="whitespace-nowrap text-center px-6 py-4 text-sm ">
                {row.gamesLost}
              </td>
              <td className="whitespace-nowrap text-center px-6 py-4 text-sm ">
                {row.ratio}
              </td>
              <td className="whitespace-nowrap text-center px-6 py-4 text-sm ">
                {row.goalsScored}
              </td>
              <td className="whitespace-nowrap text-center px-6 py-4 text-sm ">
                {row.goalsConceeded}
              </td>
              <td className="whitespace-nowrap text-center px-6 py-4 text-sm ">
                {row.gd}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
