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
  const [modalIsOpen, setIsOpen] = useState<boolean>(false);
  const [playersList, setPlayersList] = useState<Players[]>([]);
  const [selected1, setSelected1] = useState<string>("");
  const [selected2, setSelected2] = useState<string>("");
  const [disabled1, setDisabled1] = useState<boolean>(false);
  const [disabled2, setDisabled2] = useState<boolean>(false);

  async function openModal() {
    setIsOpen(true);
    const response = await api.get<Players[]>("/players");
    setPlayersList(response.data);
  }

  console.log(playersList);

  function closeModal() {
    setIsOpen(false);
    setDisabled1(false);
    setDisabled2(false);
    setSelected1("");
    setSelected2("");
  }

  const handleSaveGame = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log("asdfd")
    setIsOpen(false);
    setDisabled1(false);
    setDisabled2(false);
    setSelected1("");
    setSelected1("");
    setSelected2("");
    //callAPI
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
            <button className="px-4 py-2 bg-red-400 text-black rounded-md hover:bg-red-600 cursor-pointer ">
              Create game
            </button>
          </div>
        </div>
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md mt-16 mx-8">
          <DashboardTable />
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        // onAfterOpen={afterOpenModal}
        // onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        {/* top content */}
        <div className="flex justify-between">
          <h2 className="text-3xl">Start Game</h2>
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
                  onChange={(e) => {
                    setSelected1(e.target.value);
                    setDisabled1(true);
                  }}
                  disabled={disabled1}
                  className="border-2 rounded-lg p-2 mr-4 focus:outline-none"
                  name="cars"
                  id="cars"
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
                  defaultValue={0}
                  type="number"
                  className="p-2 w-18 h-8 border-2 rounded-lg text-center focus:outline-none"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-center text-2xl">Player2</h1>
              <div className="flex p-4 g-2">
                <input
                  defaultValue={0}
                  type="number"
                  className="p-2 w-18 h-8 border-2 rounded-lg text-center focus:outline-none"
                />
                <select
                  className="border-2 rounded-lg p-2 ml-4 focus:outline-none"
                  name="cars"
                  id="cars"
                  onChange={(e) => {
                    setSelected2(e.target.value);
                    setDisabled2(true);
                  }}
                  disabled={disabled2}
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
    </>
  );
}

export default App;
