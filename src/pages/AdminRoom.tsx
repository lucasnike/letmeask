// Images

import { RoomCode } from '../components/RoomCode';
import { Button } from '../components/Button'
import { useHistory, useParams } from 'react-router-dom';
import { FormEvent, useState } from 'react';
import { ref, push, getDatabase } from '@firebase/database';
import { useAuth } from '../hooks/useAuth';
import { Toaster, toast } from 'react-hot-toast';
import { Question } from '../components/Question';
import { useRoom } from '../hooks/useRoom';

// CSS
import logoImg from '../assets/images/logo.svg'
import '../css/romm.scss'

type RoomParams = {
  id: string;
}

export function AdminRoom() {
  const params = useParams<RoomParams>()
  const roomId = params.id
  const database = getDatabase()
  const { user, signInWithGoole, setUser } = useAuth()
  const [newQuestion, setNewQuestions] = useState('')
  const history = useHistory()

  const { questions, title } = useRoom(roomId)

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault()
    if (newQuestion.trim() === '') {
      toast.error('Pergunta está vazia !!!')
      return;
    }

    if (!user) {
      toast.error('Usuário não autenticado !!!')
      return;
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar
      },
      isHighlighted: false,
      isAnswered: false
    }

    const databaseRef = ref(database, `rooms/${roomId}/questions`)
    async function pushToDatabase() {
      await push(databaseRef, question).catch(error => {
        throw new Error('Erro');
      })
      setNewQuestions('')
    }

    toast.promise(
      pushToDatabase(),
      {
        loading: 'Enviando pergunta...',
        success: <b>Pergunta enviada !</b>,
        error: <b>Não foi possível enviar a pergunta</b>,
      }
    );
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
            <Button isOutlined >Encerrar sala</Button>
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
            <Question content={question.content} author={question.author} key={question.id} />
          )
        })}
      </main>
    </div>
  )
}