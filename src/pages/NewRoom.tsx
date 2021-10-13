import { Button } from "../components/Button";
import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'

import { useContext } from 'react'
import { AppContext } from '../App'

// CSS
import '../css/auth.scss'
import { Link } from "react-router-dom";

export function NewRoom() {

  const {value, setValue} = useContext(AppContext);

  return (
    <div id="page-auth">
      <aside id="auth-aside" className="auth-main">
        <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
        <strong id='auth-aside-strong'>Crie salas de Q&A ao-vivo </strong>
        <p>Tire as dúvidas de sua audiência em tempo-real</p>
      </aside>

      <main className="auth-main">
        <div className='main-content'>
          <h1>{value}</h1>
          <img src={logoImg} alt="Letmeask" />

          <h2>Crie uma nova sala</h2>

          <form>
            <input
              type="text"
              name=""
              id=""
              placeholder="Nome da sala" />

            <Button type='submit'>Criar sala</Button>
          </form>

          <p>Quer entrar em uma sala existente? <Link to="/">Clique aqui</Link> </p>

        </div>
      </main>
    </div>
  );
}