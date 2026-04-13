import { useState } from "react";

import { Container } from "./components/Container";
import { Logo } from "./components/Logo";
import { Menu } from "./components/Menu";
import { CountDown } from "./components/CountDown";
import { DefaultInput } from "./components/DefaultInput";
import { Cycles } from "./components/Cycles";
import { DefaultButton } from "./components/DefaultButton";
import { Footer } from "./components/Footer";

import { PlayCircle } from "lucide-react";

import "./styles/theme.css";
import "./styles/global.css";

export function App() {
  // 🧠 Estado da tarefa
  const [task, setTask] = useState("");

  // ▶️ Estado do timer (ligado/desligado)
  const [isRunning, setIsRunning] = useState(false);

  // 📩 Submit do formulário
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("Tarefa:", task);
    setIsRunning(true); // inicia o timer
  }

  return (
    <Container>
      <Logo />
      <Menu />

      {/* ⏱️ Aqui depois você pode passar o estado pro CountDown */}
      <CountDown />

      <form className="form" onSubmit={handleSubmit}>
        <div className="formRow">
          <DefaultInput
            labelText="Tarefa"
            id="task"
            type="text"
            placeholder="Digite sua tarefa"
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />
        </div>

        <div className="formRow">
          <p>Status: {isRunning ? "Rodando..." : "Parado"}</p>
        </div>

        <div className="formRow">
          <Cycles />
        </div>

        <div className="formRow">
          <DefaultButton icon={<PlayCircle />} />
        </div>
      </form>

      <Footer />
    </Container>
  );
}