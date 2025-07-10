'use client'

export default function Error({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  return (
    <div style={{ padding: 32, textAlign: 'center', color: 'red' }}>
      <h2>Bir hata oluştu!</h2>
      <p>{error.message}</p>
      <button onClick={reset} style={{ marginTop: 16 }}>Tekrar Dene</button>
    </div>
  )
}