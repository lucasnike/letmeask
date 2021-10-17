// Images
import logoImg from '../assets/images/logo.svg'
import { FiSend, FiLogOut } from 'react-icons/fi';

import { RoomCode } from '../components/RoomCode';
import { Button } from '../components/Button'
import { useHistory, useParams } from 'react-router-dom';

// CSS
import '../css/romm.scss'
import { FormEvent, useEffect, useState } from 'react';
import { getDatabase, ref, push, onChildAdded, get, onValue } from '@firebase/database';
import { signOut, getAuth } from 'firebase/auth';
import { useAuth } from '../hooks/useAuth';
import { Toaster, toast } from 'react-hot-toast';
import { child, onChildChanged, onChildRemoved } from 'firebase/database';

type RoomParams = {
  id: string;
}

type Question = {
  id: string | null,
  author: {
    name: string;
    avatar: string;
  }
  content: string;
  isHighlighted: boolean;
  isAnswered: boolean;
}

type FirebaseQuestions = Record<string, {
  author: {
    name: string;
    avatar: string;
  }
  content: string;
  isHighlighted: boolean;
  isAnswered: boolean;
}>
export function Room() {

  const { user, signInWithGoole, setUser } = useAuth()

  const params = useParams<RoomParams>()

  const [newQuestion, setNewQuestions] = useState('')
  const [questions, setQuestions] = useState<Question[]>([])
  const [title, setTitle] = useState('')

  const history = useHistory()
  const database = getDatabase()

  const roomId = params.id

  useEffect(() => {
    const roomRef = ref(database, `rooms/${roomId}`)

    onValue(roomRef, snapshot => {
      const data = snapshot.val()
      const databaseQuestions: FirebaseQuestions = data.questions ?? {};
      const parsedQuestions = Object.entries(databaseQuestions).map(([key, value]) => {
        return {
          id: key,
          content: value.content,
          author: value.author,
          isHighlighted: value.isHighlighted,
          isAnswered: value.isAnswered
        }
      })

      setTitle(data.title)
      setQuestions(parsedQuestions)
    })
  }, [roomId])


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

  function handleSignOut() {
    const auth = getAuth()
    signOut(auth)

    setUser(undefined)
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
          <RoomCode roomCode={roomId} />
        </div>
      </header>

      <main className='content'>
        <div className="room-title">
          <h1 >Sala {title} </h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea
            placeholder='O que você quer perguntar?'
            onChange={(event) => {
              setNewQuestions(event.target.value)
            }}
            value={newQuestion} />

          <div className='form-footer'>
            {!user ?
              <span>Para enviar uma pergunta faça seu login <button type='button' onClick={signInWithGoole} >faça seu login</button> </span> :
              <span id='user-info'> <img src={user.avatar} alt={user.name} /> {user.name} <FiLogOut onClick={handleSignOut} /> </span>}

            <Button type='submit' disabled={!user} > <FiSend color='#fff' /> Enviar pergunta </Button>
          </div>
        </form>

        {questions.map((values, index) => {
          return (
            <div key={index}> {values.content} </div>
          )
        })}
      </main>
    </div>
  )
}