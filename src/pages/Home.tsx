import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import googleIconImg from '../assets/images/google-icon.svg'
import { FiLogIn } from 'react-icons/fi'
import { useHistory } from 'react-router-dom'

// CSS
import '../css/auth.scss'
import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth'

export function Home() {

  const { signInWithGoole, user } = useAuth()
  const history = useHistory();

  async function handleCreateRoom() {

    if (!user) {
      await signInWithGoole()
    }
    history.push('/rooms/new')
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

          <form>
            <input
              type="text"
              name=""
              id=""
              placeholder="Digite o código da sala" />

            <Button type='submit'> <FiLogIn color='white' /> Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  );
}
