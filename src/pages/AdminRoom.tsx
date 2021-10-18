// Images

import { RoomCode } from '../components/RoomCode';
import { Button } from '../components/Button'
import { useHistory, useParams } from 'react-router-dom';
import { ref, getDatabase, remove, update } from '@firebase/database';
import toast, { Toaster } from 'react-hot-toast';
import { Question } from '../components/Question';
import { useRoom } from '../hooks/useRoom';

// CSS
import logoImg from '../assets/images/logo.svg'
import '../css/romm.scss'
import { FiTrash } from 'react-icons/fi'

type RoomParams = {
  id: string;
}

export function AdminRoom() {
  const params = useParams<RoomParams>()
  const roomId = params.id
  const database = getDatabase()
  const history = useHistory()

  const { questions, title } = useRoom(roomId)

  async function handleDeleteQuestion(questionId: string | null) {
    
    const confirmed = window.confirm('Tem certeza que deseja excluir esta pergunta ?')

    if (confirmed) {
      const questionRef = ref(database, `rooms/${roomId}/questions/${questionId}`)
      await remove(questionRef)
      toast.success('Pergunta removida !!!')
    }
  }

  async function handleEndRoom() {
    const roomRef = ref(database ,`rooms/${roomId}`)

    await update(roomRef, {
      endedAt: new Date(),
    })

    history.push('/')
  }

  return (
    <div id="page-room">
      <div><Toaster /></div>
      <header>
        <div className="content">
          <img
            onClick={() => {
              history.push('/')
            }}
            src={logoImg}
            alt="Letmeask"
            style={{
              cursor: 'pointer'
            }} />

          <div>
            <RoomCode roomCode={roomId} />
            <Button onClick={handleEndRoom} isOutlined >Encerrar sala</Button>
          </div>

        </div>
      </header>

      <main className='content'>
        <div className="room-title">
          <h1 >Sala {title} </h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        {questions.map((question) => {
          return (
            <Question content={question.content} author={question.author} key={question.id} >

              <button aria-label='Remover pergunta' type='button' onClick={() => handleDeleteQuestion(question.id)} >
                <FiTrash color='#737380' size={18} />
              </button>

            </Question>
          )
        })}
      </main>
    </div>
  )
}