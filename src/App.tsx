import "./App.css";
import { DashboardTable } from "./component/DashboardTable";

function App() {
  return (
    <>
      <div className="flex flex-col min-h-screen grainy">
        <div className="flex mt-6 h-fit justify-center">
          <h1 className="text-4xl">Ultimate Football Game Manager</h1>
        </div>
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md mt-16 mx-8">
          <DashboardTable />
        </div>
      </div>
    </>
  );
}

export default App;
