import React from 'react'
import { useEffect, useState } from 'react/cjs/react.development';

export default function Box(props) {
  const [display, setDisplay] = useState(0);
  const [color, setColor] = useState("");
  const changeColor = () => {
    
  }
  useEffect(() => {
    if (props.val == "0000000") {
      setDisplay("");
      setColor("rgb(40, 255, 162, 0.1)")
    } else {
      setDisplay(2 ** parseInt(props.val, 2));
      const colorDelta = parseInt(props.val, 2) / 11;
      setColor(`rgb(40,${255 - (colorDelta * 255)}, 162, ${colorDelta + 0.2})`)
    }
  }, [props.val])
  return (
    <div style={{backgroundColor: color}} className='Box'>
        <h1>{Number.isNaN(display) ? "" : display}</h1>
    </div>
  )
}
