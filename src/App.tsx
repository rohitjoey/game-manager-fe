import { useState } from "react";
import "./App.css";
import { DashboardTable } from "./component/DashboardTable";
import Modal from "react-modal";
import { X } from "lucide-react";
import api from "./config/axios";

Modal.setAppElement("#root");

interface Players {
  id: string;
  name: string;
}

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

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

function App() {
  const initialFormData = {
    player1Id: "",
    player2Id: "",
    score1: 0,
    score2: 0,
  };

  const [modalIsOpen, setIsOpen] = useState<boolean>(false);
  const [playersList, setPlayersList] = useState<Players[]>([]);
  const [selected1, setSelected1] = useState<string>("");
  const [selected2, setSelected2] = useState<string>("");
  const [disabled1, setDisabled1] = useState<boolean>(false);
  const [disabled2, setDisabled2] = useState<boolean>(false);
  const [formData, setFormData] = useState(initialFormData);
  const [createFlag, setCreateFlag] = useState<boolean>(false);
  const [playerModelOpen, setPlayerModelOpen] = useState<boolean>(false);
  const [playerNameFormData, setPlayerNameFormData] = useState("");

  const [tableRows, setTableRows] = useState<PlayerStats[]>([]);
  const [refetchFlag, setRefetchFlag] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTableData = async () => {
    const response = await api.get<PlayerStats[]>("/dashboard");
    setTableRows(response.data);
  };

  async function openModal() {
    setIsOpen(true);
    const response = await api.get<Players[]>("/players");
    setPlayersList(response.data);
  }

  function closeModal() {
    setIsOpen(false);
    setDisabled1(false);
    setDisabled2(false);
    setSelected1("");
    setSelected2("");
  }

  const handleSaveGame = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await api.post("/game", formData);
    console.log(response.data);
    setIsOpen(false);
    setDisabled1(false);
    setDisabled2(false);
    setSelected1("");
    setSelected1("");
    setSelected2("");
    setFormData(initialFormData);
    setRefetchFlag((prev) => !prev);
  };

  const handleAddPlayer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await api.post("/players", { name: playerNameFormData });
      console.log(response.data);
      setLoading(false);
      setPlayerModelOpen(false);
      setRefetchFlag((prev) => !prev);
      setPlayerNameFormData("")
    } catch (err) {
      setLoading(false);
      setPlayerNameFormData("")
      setError("An error occurred");
      setTimeout(() => {
        setError(null);
      }, 1000);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "score1" || name == "score2" ? Number(value) : value,
    }));
    if (name === "player1Id") {
      setSelected1(e.target.value);
      setDisabled1(true);
    }
    if (name === "player2Id") {
      setSelected2(e.target.value);
      setDisabled2(true);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayerNameFormData(e.target.value);
  };

  const creatGameHandler = () => {
    openModal();
    setCreateFlag(true);
  };

  return (
    <>
      <div className="flex flex-col min-h-screen grainy">
        <div className="flex h-fit justify-center p-8">
          <div className="w-1/4"></div>
          <h1 className="text-4xl text-center flex-1">
            Ultimate Football Game Manager
          </h1>
          <div className="flex gap-6 w-1/4 justify-end">
            <button
              onClick={openModal}
              className="px-4 py-2 bg-red-300 text-black rounded-md hover:bg-red-700 cursor-pointer "
            >
              Start game
            </button>
            <button
              onClick={creatGameHandler}
              className="px-4 py-2 bg-red-400 text-black rounded-md hover:bg-red-600 cursor-pointer "
            >
              Create game
            </button>
            <button
              onClick={() => setPlayerModelOpen(true)}
              className="px-4 py-2 bg-red-400 text-black rounded-md hover:bg-red-600 cursor-pointer "
            >
              Add player
            </button>
          </div>
        </div>
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md mt-16 mx-8">
          <DashboardTable
            data={tableRows}
            refetchFlag={refetchFlag}
            fetchTableData={fetchTableData}
          />
        </div>
      </div>

      {/* Create or save game modal */}
      <Modal
        isOpen={modalIsOpen}
        // onAfterOpen={afterOpenModal}
        // onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        {/* top content */}
        <div className="flex justify-between">
          <h2 className="text-3xl">
            {createFlag ? "Create Game" : "Start Game"}
          </h2>
          <button className="cursor-pointer" onClick={closeModal}>
            <X />
          </button>
        </div>
        {/* middle content */}
        <form onSubmit={handleSaveGame}>
          <div className="flex mt-6">
            <div className="flex flex-col">
              <h1 className="text-center text-2xl">Player1</h1>
              <div className="flex p-4 g-2">
                <select
                  name="player1Id"
                  onChange={handleChange}
                  value={formData.player1Id}
                  disabled={disabled1}
                  className="border-2 rounded-lg p-2 mr-4 focus:outline-none"
                >
                  <option value="">Select Player</option>
                  {playersList.map((player) => (
                    <option
                      key={player.id}
                      value={player.id}
                      disabled={player.id === selected2}
                    >
                      {player.name}
                    </option>
                  ))}
                </select>
                <input
                  min="0"
                  name="score1"
                  type="number"
                  onChange={handleChange}
                  value={formData.score1}
                  className="p-2 w-18 h-8 border-2 rounded-lg text-center focus:outline-none"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-center text-2xl">Player2</h1>
              <div className="flex p-4 g-2">
                <input
                  type="number"
                  min="0"
                  name="score2"
                  onChange={handleChange}
                  value={formData.score2}
                  className="p-2 w-18 h-8 border-2 rounded-lg text-center focus:outline-none"
                />
                <select
                  className="border-2 rounded-lg p-2 ml-4 focus:outline-none"
                  name="player2Id"
                  onChange={handleChange}
                  disabled={disabled2}
                  value={formData.player2Id}
                >
                  <option value="">Select Player</option>
                  {playersList.map((player) => (
                    <option
                      key={player.id}
                      value={player.id}
                      disabled={player.id === selected1}
                    >
                      {player.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="p-2 mt-2 bg-red-300 text-black rounded-md hover:bg-red-700 hover:text-white cursor-pointer "
          >
            Save Game
          </button>
        </form>
      </Modal>

      {/* addplayer modal */}
      <Modal
        isOpen={playerModelOpen}
        // onAfterOpen={afterOpenModal}
        // onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        {/* top content */}
        <div className="flex justify-between">
          <h2 className="text-3xl">Add Player</h2>
          <button className="cursor-pointer" onClick={()=>setPlayerModelOpen(false)}>
            <X />
          </button>
        </div>
        {/* middle content */}
        <form onSubmit={handleAddPlayer}>
          <div className="flex mt-6">
            <div className="flex flex-col">
              <h1 className="text-2xl">Name</h1>

              <input
                name="playername"
                onChange={handleNameChange}
                value={playerNameFormData}
                className="p-2 w-full h-8 border-2 rounded-lg  focus:outline-none my-4"
              />
            </div>
          </div>
          {error}
          <button
            type="submit"
            disabled={error ? true : false}
            className="p-2 mt-2 bg-red-300 text-black rounded-md hover:bg-red-700 hover:text-white cursor-pointer "
          >
            Add Player
          </button>
        </form>
      </Modal>
    </>
  );
}

export default App;
