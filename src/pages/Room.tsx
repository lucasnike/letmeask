// Images
import logoImg from '../assets/images/logo.svg'
import { FiSend } from 'react-icons/fi';

import { RoomCode } from '../components/RoomCode';
import { Button } from '../components/Button'
import { useParams } from 'react-router-dom';

// CSS
import '../css/romm.scss'

type RoomParams = {
  id: string;
}

export function Room() {

  const params = useParams<RoomParams>()
  

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <RoomCode roomCode={params.id} />
        </div>
      </header>

      <main className='content'>
        <div className="room-title">
          <h1>Sala React</h1>
          <span>4 perguntas</span>
        </div>

        <form>
          <textarea 
          placeholder='O que você quer perguntar?' />

          <div className='form-footer'>
            <span>Para enviar uma pergunta faça seu login <button>faça seu login</button> </span>

            <Button type='submit'> <FiSend color='#fff' /> Enviar pergunta </Button>
          </div>
        </form>
      </main>
    </div>
  )
}