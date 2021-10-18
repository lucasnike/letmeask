import { getDatabase, off, onValue } from "@firebase/database"
import { ref } from "firebase/database"
import { useEffect, useState } from "react"
import { useAuth } from "./useAuth"

type QuestionType = {
  id: string | null,
  author: {
    name: string;
    avatar: string;
  }
  content: string;
  isHighlighted: boolean;
  isAnswered: boolean;
  likeCount: number;
  likeId: string | undefined;
}


type FirebaseQuestions = Record<string, {
  author: {
    name: string;
    avatar: string;
  }
  content: string;
  isHighlighted: boolean;
  isAnswered: boolean;
  likes: Record<string, {
    authorId: string;
  }>
}>



export function useRoom(roomId: string) {
  const database = getDatabase()
  const [questions, setQuestions] = useState<QuestionType[]>([])
  const [title, setTitle] = useState('')

  const { user } = useAuth()

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
          isAnswered: value.isAnswered,
          likeCount: Object.values(value.likes ?? {}).length,
          likeId: Object.entries(value.likes ?? {}).find( ([ key, like ]) => like.authorId === user?.id)?.[0]
        }
      })

      setTitle(data.title)
      setQuestions(parsedQuestions)
    })

    return () => {
      off(roomRef, 'value')
    }
  }, [roomId, user?.id, database])


  return { questions, title }
}