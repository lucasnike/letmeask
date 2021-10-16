import { Button } from "../components/Button";
import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { FormEvent, useState } from 'react'
import { push, ref, getDatabase } from 'firebase/database'

// CSS
import '../css/auth.scss'

export function NewRoom() {

  const database = getDatabase()
  const history = useHistory()
  const { user } = useAuth()

  const [newRoom, setNewRoom] = useState('')

  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault()

    if (newRoom.trim() === '') {
      return;
    }

    const roomRef = ref(database, 'rooms')

    const firebaseRomm = push(roomRef, {
      title: newRoom,
      authorId: user?.id
    })

    history.push(`/rooms/${firebaseRomm.key}`)
  }

  return (
    <div id="page-auth">
      <aside id="auth-aside" className="auth-main">
        <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
        <strong id='auth-aside-strong'>Crie salas de Q&A ao-vivo </strong>
        <p>Tire as dúvidas de sua audiência em tempo-real</p>
      </aside>

      <main className="auth-main">
        <div className='main-content'>

          <img src={logoImg} alt="Letmeask" />

          <h2>Crie uma nova sala</h2>

          <form onSubmit={handleCreateRoom} >
            <input
              type="text"
              name=""
              id=""
              placeholder="Nome da sala"
              onChange={(event) => {
                setNewRoom(event.target.value)
                console.log(newRoom);
              }} 
              value={newRoom} />

            <Button type='submit'>Criar sala</Button>
          </form>

          <p>Quer entrar em uma sala existente? <Link to="/">Clique aqui</Link> </p>

        </div>
      </main>
    </div>
  );
}