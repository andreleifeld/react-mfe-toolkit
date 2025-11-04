import React from 'react';
export function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} className={`px-3 py-2 rounded bg-slate-600 text-white ${props.className ?? ''}`} />;
}
