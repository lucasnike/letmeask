// Images
import logoImg from '../assets/images/logo.svg'
import { FiSend, FiLogOut, FiThumbsUp } from 'react-icons/fi';

import { RoomCode } from '../components/RoomCode';
import { Button } from '../components/Button'
import { useHistory, useParams } from 'react-router-dom';

// CSS
import '../css/romm.scss'
import { FormEvent, useState } from 'react';
import { ref, push, getDatabase, remove } from '@firebase/database';
import { signOut, getAuth } from 'firebase/auth';
import { useAuth } from '../hooks/useAuth';
import { Toaster, toast } from 'react-hot-toast';
import { Question } from '../components/Question';
import { useRoom } from '../hooks/useRoom';

type RoomParams = {
  id: string;
}

export function Room() {
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

  function handleSignOut() {
    const auth = getAuth()
    signOut(auth)

    setUser(undefined)
  }

  async function handleSignInWithGoogle() {
    await signInWithGoole()
    toast.success('Usuário autenticado com sucesso !!!')
  }

  async function handleLikeQuestion(questionId: string | null, likeId: string | undefined) {

    const newLike = ref(database, `rooms/${roomId}/questions/${questionId}/likes`)

    if (user) {
      if (!likeId) {
        await push(newLike, {
          authorId: user?.id
        })
        toast('Liked !!!',
          {
            icon: '👍',
            style: {
              borderRadius: '10px',
              background: '#333',
              color: '#fff',
            },
          }
        );
      } else {
        const likeToBeRemovedRef = ref(database, `rooms/${roomId}/questions/${questionId}/likes/${likeId}`)
        await remove(likeToBeRemovedRef)
        toast.success('Like removido', {
          icon: '👍',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          }
        })
      }
    } else {
      toast.error('Você precisa fazer login para dar o like !!')
    }

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
              <span>Para enviar uma pergunta faça seu login <button type='button' onClick={handleSignInWithGoogle} >faça seu login</button> </span> :
              <span id='user-info'> <img src={user.avatar} alt={user.name} /> {user.name} <FiLogOut onClick={handleSignOut} /> </span>}

            <Button type='submit' disabled={!user} > <FiSend color='#fff' /> Enviar pergunta </Button>
          </div>
        </form>

        {questions.map((question) => {
          return (
            <Question
              content={question.content}
              author={question.author}
              key={question.id}
              isAnswered={question.isAnswered}
              isHighlighted={question.isHighlighted} >

              {!question.isAnswered && (
                <button type='button' className={`like-button ${question.likeId && 'liked'}`} aria-label='Marcar como gostei' onClick={() => {

                  handleLikeQuestion(question.id, question.likeId)

                }} >

                  {question.likeCount > 0 && <span>{question.likeCount}</span>}
                  <FiThumbsUp color='#737380' size={20} />

                </button>
              )}

            </Question>
          )
        })}
      </main>
    </div>
  )
}