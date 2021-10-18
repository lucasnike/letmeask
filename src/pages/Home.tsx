import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import googleIconImg from '../assets/images/google-icon.svg'
import { FiLogIn } from 'react-icons/fi'
import { useHistory } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Button } from '../components/Button';
import { useState, FormEvent } from 'react'

// CSS
import '../css/auth.scss'
import { ref, getDatabase, get, child } from '@firebase/database'
import { app } from '../services/firebase'

export function Home() {

  const [roomCode, setRoomCode] = useState('')
  const { signInWithGoole, user } = useAuth()

  const database = getDatabase(app)
  const history = useHistory();

  async function handleCreateRoom() {

    if (!user) {
      await signInWithGoole()
    }
    history.push('/rooms/new')
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault()

    if (roomCode.trim() === '') {
      return;
    }

    const roomRef = ref(database)
    const snapshot = await get(child(roomRef, `rooms/${roomCode}`))

    console.log(snapshot.exists());

    if (snapshot.val().endedAt) {
      alert('Sala já encerrada !!!')
      return;
    }

    if (snapshot.exists()) {
      history.push(`/rooms/${roomCode}`)
    } else {
      alert('Room does not exists !!!')
      return;
    }

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

          <button className='create-room' onClick={handleCreateRoom} >
            <img src={googleIconImg} alt="" />
            Crie sua sala com o google
          </button>

          <div className='separator'>ou entre em uma sala </div>

          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              name=""
              id=""
              placeholder="Digite o código da sala"
              onChange={(event) => {
                setRoomCode(event.target.value)
              }}
              value={roomCode} />

            <Button type='submit'> <FiLogIn color='white' /> Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  );
}
