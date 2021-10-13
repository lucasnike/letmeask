import { ButtonHTMLAttributes } from 'react'

// CSS
import '../css/button.scss'

export function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className='button' {...props} >
    </button>
  );
}