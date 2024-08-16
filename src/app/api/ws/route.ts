import { NextResponse } from 'next/server';

export async function SOCKET(
  client: import('ws').WebSocket,
  request: import('http').IncomingMessage,
  server: import('ws').WebSocketServer,
) {
  console.log('A client connected');

  client.on('message', (message) => {
    for (const connectedClient of server.clients) {
      if (connectedClient.readyState === WebSocket.OPEN) {
        connectedClient.send(JSON.stringify(JSON.parse(message.toString())));
      }
    }
  });

  client.on('close', () => {
    console.log('A client disconnected!');
  });
}

export async function GET() {
  return new NextResponse('Websocket Route')
}