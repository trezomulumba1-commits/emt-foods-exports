import React, { useMemo, useState } from 'react';

export default function WordCounter() {
  const [text, setText] = useState('');
  const words = useMemo(() => {
    const w = (text || '').trim().split(/\s+/).filter(Boolean);
    return w;
  }, [text]);

  return (
    <div className="word-counter fixed left-6 bottom-6 z-50 w-64 bg-surf border bt rounded-xl p-3 shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="mono text-[10px] uppercase">Word Counter</div>
        <div className="chip">{words.length}</div>
      </div>
      <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Paste text here..." className="w-full h-20 p-2 text-sm border rounded resize-none bg-transparent" />
      <div className="mt-2 grid grid-cols-3 gap-2">
        <button className="btn-ghost text-xs py-1">Copy</button>
        <button onClick={() => setText('')} className="btn-ghost text-xs py-1">Clear</button>
        <button onClick={() => navigator.clipboard?.writeText(text)} className="btn-primary text-xs py-1">Save</button>
      </div>
    </div>
  );
}
