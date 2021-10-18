import { getDatabase, onValue } from "@firebase/database"
import { ref } from "firebase/database"
import { useEffect, useState } from "react"

type QuestionType = {
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



export function useRoom(roomId: string) {
  const database = getDatabase()
  const [questions, setQuestions] = useState<QuestionType[]>([])
  const [title, setTitle] = useState('')

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

  return { questions, title }
}