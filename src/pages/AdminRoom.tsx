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
import { FiTrash, FiCheckCircle, FiMessageSquare } from 'react-icons/fi'

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
    const roomRef = ref(database, `rooms/${roomId}`)

    await update(roomRef, {
      endedAt: new Date(),
    })

    history.push('/')
  }

  async function handleCheckQuestionAsAnswered(questionId: string | null) {
    const questionRef = ref(database, `rooms/${roomId}/questions/${questionId}`)

    await update(questionRef, {
      isAnswered: true
    })

    toast('Pergunta respondida !!!', {
      icon: '👏',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      }
    })
  }

  async function handleHighlightQuestion(questionId: string | null) {
    const questionRef = ref(database, `rooms/${roomId}/questions/${questionId}`)

    await update(questionRef, {
      isHighlighted: true
    })

    toast('Pergunta destacada !!!', {
      icon: '👏',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      }
    })
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
            <Question
              content={question.content}
              author={question.author}
              key={question.id}
              isAnswered={question.isAnswered}
              isHighlighted={question.isHighlighted} >

              {!question.isAnswered && (
              <>
                {/* Marca pergunta como respondida */}
                <button type='button' onClick={() => handleCheckQuestionAsAnswered(question.id)} >
                  <FiCheckCircle color='#737380' size={18} />
                </button>

                {/* Dá highlight na pergunta */}
                <button type='button' onClick={() => handleHighlightQuestion(question.id)} >
                  <FiMessageSquare color='#737380' size={18} />
                </button>
              </>
              )}

              {/* Deleta pergunta */}
              <button type='button' onClick={() => handleDeleteQuestion(question.id)} >
                <FiTrash color='#737380' size={18} />
              </button>

            </Question>
          )
        })}
      </main>
    </div>
  )
}