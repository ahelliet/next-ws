'use client'

import { type FormEvent, useEffect, useState } from "react";

type Message = {
  author: string;
  content: string;
};

export default function Home() {

  const [author, setAuthor] = useState('')
  const [content, setContent] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    // Établir une connexion WebSocket lors du montage du composant
    const socket = new WebSocket('ws://localhost:3000/api/ws');

    socket.onopen = () => {
      console.log('WebSocket connection opened');
    };

    socket.onmessage = (message) => {
      setMessages((prevState) => [...prevState, JSON.parse(message.data.toString())]);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    // Stocker la connexion WebSocket dans l'état
    setWs(socket);

    // Fermer la connexion WebSocket lorsque le composant est démonté
    return () => {
      socket.close();
    };
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (ws && ws.readyState === WebSocket.OPEN) {
      const message: Message = {
        author,
        content,
      };
      ws.send(JSON.stringify(message));
      setContent(''); // Réinitialiser le champ "content" après l'envoi du message
    } else {
      console.error('WebSocket is not connected');
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <form className="flex gap-4" onSubmit={handleSubmit}>
        <input type="text" name="author" id="" className="text-black rounded-md px-4" placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <input type="text" name="content" id="" className="text-black rounded-md px-4" placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <input type="submit" value="Envoyer" className="bg-white text-black px-4 rounded-md" />
      </form>
      <div>
        {messages.map((message, index) => (
          <div key={index}>
            <strong>{message.author}:</strong> {message.content}
          </div>
        ))}
      </div>
    </main>
  );
}
