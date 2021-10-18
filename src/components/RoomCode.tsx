import toast from "react-hot-toast";
import { FiCopy } from "react-icons/fi";

// CSS
import '../css/roomCode.scss'

type RoomCodeProps = {
  roomCode: string;
}

export function RoomCode(props: RoomCodeProps) {

  function copyRoomCodeToClipboard() {
    navigator.clipboard.writeText(props.roomCode)
    toast('Código copiado !!!',
      {
        icon: '👏',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      }
    );
  }

  return (
    <div
      id='room-code'
      onClick={copyRoomCodeToClipboard}
    > <FiCopy color='#fff' size={39.16} /> <span>Sala #{props.roomCode}</span></div>
  )
}