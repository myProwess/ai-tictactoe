/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCcw, Trophy, X, Circle } from 'lucide-react';

type Player = 'X' | 'O' | null;

export default function App() {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState<boolean>(true);
  const [winner, setWinner] = useState<Player | 'Draw'>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);

  const calculateWinner = (squares: Player[]) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: lines[i] };
      }
    }
    if (squares.every((square) => square !== null)) {
      return { winner: 'Draw' as const, line: null };
    }
    return null;
  };

  const handleClick = (i: number) => {
    if (winner || board[i]) return;

    const newBoard = [...board];
    newBoard[i] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);

    const result = calculateWinner(newBoard);
    if (result) {
      setWinner(result.winner);
      setWinningLine(result.line);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setWinningLine(null);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-5xl font-black tracking-tighter mb-2 bg-gradient-to-br from-indigo-400 to-emerald-400 bg-clip-text text-transparent">
          TIC TAC TOE
        </h1>
        <p className="text-neutral-500 font-mono text-sm uppercase tracking-widest">Royale Edition</p>
      </motion.div>

      <div className="relative">
        <div className="grid grid-cols-3 gap-3 bg-neutral-900 p-3 rounded-2xl shadow-2xl border border-white/5">
          {board.map((square, i) => (
            <motion.button
              key={i}
              id={`square-${i}`}
              whileHover={{ scale: 0.98, backgroundColor: 'rgba(255,255,255,0.05)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleClick(i)}
              className={`
                w-24 h-24 sm:w-28 sm:h-28 rounded-xl flex items-center justify-center text-4xl
                transition-colors duration-200
                ${winningLine?.includes(i) ? 'bg-emerald-500/20 border-2 border-emerald-500/50' : 'bg-neutral-800 border border-white/5'}
                ${!square && !winner ? 'cursor-pointer' : 'cursor-default'}
              `}
            >
              <AnimatePresence mode="wait">
                {square === 'X' && (
                  <motion.div
                    key="X"
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0 }}
                    className="text-indigo-400"
                  >
                    <X size={48} strokeWidth={3} />
                  </motion.div>
                )}
                {square === 'O' && (
                  <motion.div
                    key="O"
                    initial={{ scale: 0, rotate: 45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0 }}
                    className="text-emerald-400"
                  >
                    <Circle size={44} strokeWidth={3} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>

        {/* Status Overlay */}
        <AnimatePresence>
          {winner && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-neutral-950/80 backdrop-blur-sm rounded-2xl border border-white/10"
            >
              <div className="bg-neutral-900 p-8 rounded-3xl shadow-2xl border border-white/10 text-center">
                {winner === 'Draw' ? (
                  <h2 className="text-3xl font-bold mb-4">It's a Draw!</h2>
                ) : (
                  <>
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="flex justify-center mb-4 text-yellow-400"
                    >
                      <Trophy size={64} />
                    </motion.div>
                    <h2 className="text-4xl font-black mb-2">
                      {winner} WINS!
                    </h2>
                  </>
                )}
                <button
                  onClick={resetGame}
                  className="mt-6 flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-neutral-200 transition-colors"
                >
                  <RefreshCcw size={20} />
                  Play Again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!winner && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 flex items-center gap-4 bg-neutral-900 px-6 py-3 rounded-full border border-white/5 shadow-lg"
        >
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isXNext ? 'bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.5)]' : 'bg-neutral-700'}`} />
            <span className={`text-sm font-bold ${isXNext ? 'text-indigo-400' : 'text-neutral-500'}`}>Player X</span>
          </div>
          <div className="w-px h-4 bg-neutral-800" />
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${!isXNext ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]' : 'bg-neutral-700'}`} />
            <span className={`text-sm font-bold ${!isXNext ? 'text-emerald-400' : 'text-neutral-500'}`}>Player O</span>
          </div>
        </motion.div>
      )}

      <div className="mt-12 text-neutral-600 text-xs font-mono uppercase tracking-widest">
        Built with React & Motion
      </div>
    </div>
  );
}
