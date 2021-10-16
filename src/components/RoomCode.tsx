import { FiCopy } from "react-icons/fi";

// CSS
import '../css/roomCode.scss'

type RoomCodeProps = {
  roomCode: string;
}

export function RoomCode(props: RoomCodeProps) {

  function copyRoomCodeToClipboard() {
    navigator.clipboard.writeText(props.roomCode)
  }

  return (
    <div
      id='room-code'
      onClick={copyRoomCodeToClipboard}
    > <FiCopy color='#fff' size={39.16} /> <span>Sala #{props.roomCode}</span></div>
  )
}