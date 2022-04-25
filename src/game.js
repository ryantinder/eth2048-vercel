import React from 'react'
import { useEffect, useState } from 'react/cjs/react.development'
import Box from './Box'

export default function Game(props) {
    let val = props.val;
    val = val.substring(49, val.length - 49)

    const val1 = val.substring(0, 7);
    const val2 = val.substring(7, 14);
    const val3 = val.substring(14, 21);
    const val4 = val.substring(21, 28);

    const val5 = val.substring(42, 49);
    const val6 = val.substring(49, 56);
    const val7 = val.substring(56, 63);
    const val8 = val.substring(63, 70);

    const val9 = val.substring(84, 91);
    const val10 = val.substring(91, 98);
    const val11 = val.substring(98, 105);
    const val12 = val.substring(105, 112);

    const val13 = val.substring(126, 133);
    const val14 = val.substring(133, 140);
    const val15 = val.substring(140, 147);
    const val16 = val.substring(147, 154);
    
  return (
        <div className="grid">
            <Box val={val1} />
            <Box val={val2} />
            <Box val={val3} />
            <Box val={val4} />

            <Box val={val5} />
            <Box val={val6} />
            <Box val={val7} />
            <Box val={val8} />

            <Box val={val9} />
            <Box val={val10} />
            <Box val={val11} />
            <Box val={val12} />

            <Box val={val13} />
            <Box val={val14} />
            <Box val={val15} />
            <Box val={val16} />

        <style jsx>{`

      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}
