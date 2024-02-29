import FormsList from "./FormList";
import logo from "./logo.svg";
// import './App.css';
import UserForm from "./UserForm";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<UserForm />}>
              {" "}
            </Route>
            <Route path="/forms/:id" element={<FormsList />}>
              {" "}
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;
