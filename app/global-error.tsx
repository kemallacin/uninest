'use client'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  return (
    <html>
      <body>
        <div style={{ padding: 32, textAlign: 'center', color: 'red' }}>
          <h2>Kritik Hata!</h2>
          <p>{error.message}</p>
          <button onClick={reset} style={{ marginTop: 16 }}>Uygulamayı Yeniden Başlat</button>
        </div>
      </body>
    </html>
  )
}