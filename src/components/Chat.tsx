import React, { useState, useRef, useEffect } from 'react';
import { Send, Search, Phone, Video, MoreVertical, Paperclip, Smile, ArrowLeft, Archive } from 'lucide-react';
import { io, Socket } from 'socket.io-client';

interface Contact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
  status?: string;
}

interface Message {
  id: string;
  text: string;
  timestamp: string;
  sender: 'me' | 'other';
  status: 'sent' | 'delivered' | 'read';
}

const Chat: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);

  // Simulación de usuario actual (ajusta según tu auth)
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const currentUserId = currentUser?.id?.toString() || '1';

  // Cargar contactos desde backend
  useEffect(() => {
    // TEMPORAL: Comentado para evitar conexión a API
    /*
    fetch('/api/chat/contacts', {
      headers: {
        'Accept': 'application/json'
      }
    })
      .then(async res => {
        if (!res.ok) {
          const error = await res.text();
          throw new Error(error || 'Error al obtener contactos');
        }
        return res.json();
      })
      .then(data => {
        setContacts(
          (data.contacts || []).map((u: any) => ({
            id: u.id?.toString() || '',
            name: u.name || u.username || '',
            avatar: u.avatar || 'SD',
            lastMessage: '',
            timestamp: '',
            unread: 0,
            online: false,
          }))
        );
      })
      .catch(() => setContacts([]));
    */

    // TEMPORAL: Datos de contactos de prueba
    setContacts([
      {
        id: '2',
        name: 'María González',
        avatar: 'MG',
        lastMessage: 'Hola, ¿cómo estás?',
        timestamp: '10:30',
        unread: 2,
        online: true,
      },
      {
        id: '3',
        name: 'Carlos Mendoza',
        avatar: 'CM',
        lastMessage: 'Perfecto, gracias',
        timestamp: '09:15',
        unread: 0,
        online: false,
      }
    ]);
  }, []);

  // Cargar mensajes al seleccionar contacto
  useEffect(() => {
    if (selectedContact) {
      // TEMPORAL: Comentado para evitar conexión a API
      /*
      fetch(`/api/chat/messages?userId=${currentUserId}&contactId=${selectedContact.id}`)
        .then(res => res.json())
        .then(data => {
          setMessages(
            (data.messages || []).map((m: any) => ({
              id: m.id.toString(),
              text: m.text,
              timestamp: new Date(m.timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
              sender: m.sender_id == currentUserId ? 'me' : 'other',
              status: m.status,
            }))
          );
        });
      */

      // TEMPORAL: Mensajes de prueba
      setMessages([
        {
          id: '1',
          text: '¡Hola! ¿Cómo estás?',
          timestamp: '10:30',
          sender: 'other',
          status: 'read'
        },
        {
          id: '2',
          text: 'Todo bien, gracias por preguntar',
          timestamp: '10:32',
          sender: 'me',
          status: 'read'
        }
      ]);
    }
  }, [selectedContact, currentUserId]);

  // Mantener selectedContact y currentUserId en refs para acceso en callbacks
  const selectedContactRef = useRef<Contact | null>(null);
  const currentUserIdRef = useRef<string>(currentUserId);

  useEffect(() => {
    selectedContactRef.current = selectedContact;
    currentUserIdRef.current = currentUserId;
  }, [selectedContact, currentUserId]);

  // Socket.IO conexión y eventos
  useEffect(() => {
    // TEMPORAL: Comentado para evitar conexión Socket.IO
    /*
    const socket = io();
    socketRef.current = socket;
    socket.emit('join', currentUserId);

    // Recibir mensajes en tiempo real, sin importar el contacto seleccionado
    socket.on('receiveMessage', (msg: any) => {
      // Usar refs para obtener el valor más reciente de selectedContact y currentUserId
      const selected = selectedContactRef.current;
      const myId = currentUserIdRef.current;
      if (
        selected &&
        ((msg.sender_id == selected.id && msg.receiver_id == myId) ||
         (msg.sender_id == myId && msg.receiver_id == selected.id))
      ) {
        setMessages(prev => [
          ...prev,
          {
            id: msg.id?.toString() || Date.now().toString(),
            text: msg.text,
            timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
            sender: msg.sender_id == myId ? 'me' : 'other',
            status: msg.status || 'sent',
          }
        ]);
      }
    });

    return () => {
      socket.off('receiveMessage');
      socket.disconnect();
    };
    */
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (message.trim() && selectedContact) {
      // TEMPORAL: Comentado para evitar conexión a API
      /*
      // Guarda en backend
      const msgPayload = {
        text: message,
        sender_id: currentUserId,
        receiver_id: selectedContact.id,
        status: 'sent'
      };
      const res = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msgPayload)
      });
      const data = await res.json();
      // Envía por socket
      if (socketRef.current) {
        socketRef.current.emit('sendMessage', { ...msgPayload, id: data.id });
      }
      setMessages(prev => [
        ...prev,
        {
          id: data.id?.toString() || Date.now().toString(),
          text: message,
          timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
          sender: 'me',
          status: 'sent'
        }
      ]);
      */

      // TEMPORAL: Solo agregar mensaje localmente
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          text: message,
          timestamp: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
          sender: 'me',
          status: 'sent'
        }
      ]);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFilteredContacts = () => {
    switch (activeTab) {
      case 'active':
        return filteredContacts.filter(contact => contact.online);
      case 'done':
        return filteredContacts.filter(contact => !contact.online);
      case 'unread':
        return filteredContacts.filter(contact => contact.unread > 0);
      case 'archive':
        // TEMPORAL: Sin contactos archivados por ahora
        return [];
      default:
        return filteredContacts;
    }
  };

  return (
    <div className="h-[calc(100vh-5rem)] flex bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100">
      {/* Contacts Sidebar */}
      <div className={`${selectedContact ? 'hidden lg:flex' : 'flex'} flex-col w-full lg:w-96 border-r border-gray-100`}>
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Servicio al cliente</h2>
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                <Phone className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                <Video className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center space-x-1 mb-4">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                activeTab === 'all'
                  ? 'bg-emerald-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Todos
              <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                {contacts.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                activeTab === 'active'
                  ? 'bg-emerald-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Activos
            </button>
            <button
              onClick={() => setActiveTab('done')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                activeTab === 'done'
                  ? 'bg-emerald-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Completados
            </button>
          </div>
          
          {/* Second row for Unread and Archive - side by side */}
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('unread')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                activeTab === 'unread'
                  ? 'bg-emerald-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              No leídos
              <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                {contacts.filter(c => c.unread > 0).length}
              </span>
            </button>
            
            <button
              onClick={() => setActiveTab('archive')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 flex items-center space-x-2 ${
                activeTab === 'archive'
                  ? 'bg-emerald-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Archive className="w-4 h-4" />
              <span>Archivar</span>
            </button>
          </div>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto">
          {getFilteredContacts().map((contact) => (
            <div
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors duration-200 ${
                selectedContact?.id === contact.id ? 'bg-emerald-50 border-l-4 border-l-emerald-500' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="relative">
                  {contact.avatar.startsWith('http') ? (
                    <img 
                      src={contact.avatar} 
                      alt={contact.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white font-medium text-sm">
                      {contact.avatar}
                    </div>
                  )}
                  {contact.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-gray-900 truncate text-sm">{contact.name}</h3>
                    <span className="text-xs text-gray-500 ml-2 flex-shrink-0">{contact.timestamp}</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <div className="flex items-center">
                      {contact.status === 'call' && (
                        <Phone className="w-3 h-3 text-emerald-500 mr-1" />
                      )}
                      {contact.status === 'archived' && (
                        <Archive className="w-3 h-3 text-gray-500 mr-1" />
                      )}
                      <p className="text-xs text-gray-600 truncate">{contact.lastMessage}</p>
                    </div>
                    {contact.unread > 0 && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 flex-shrink-0"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      {selectedContact ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-100 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setSelectedContact(null)}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div className="relative">
                  {selectedContact.avatar.startsWith('http') ? (
                    <img 
                      src={selectedContact.avatar} 
                      alt={selectedContact.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white font-medium">
                      {selectedContact.avatar}
                    </div>
                  )}
                  {selectedContact.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{selectedContact.name}</h3>
                  <p className="text-sm text-gray-500">
                    +123 456 789
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                  <Phone className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                  <Video className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, index) => (
              <div key={msg.id}>
                {/* Time separator */}
                {index === 0 && (
                  <div className="text-center mb-4">
                    <span className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full">
                      Hoy
                    </span>
                  </div>
                )}
                
                <div className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className="flex items-end space-x-2 max-w-xs lg:max-w-md">
                    {msg.sender === 'other' && (
                      selectedContact.avatar.startsWith('http') ? (
                        <img 
                          src={selectedContact.avatar} 
                          alt={selectedContact.name}
                          className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                          {selectedContact.avatar}
                        </div>
                      )
                    )}
                    <div
                      className={`px-4 py-2 rounded-2xl ${
                        msg.sender === 'me'
                          ? 'bg-emerald-500 text-white rounded-br-md'
                          : 'bg-white text-gray-900 rounded-bl-md border border-gray-200'
                      }`}
                    >
                      {msg.text.includes('Llamada entrante') ? (
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-emerald-500" />
                          <span className="text-sm">{msg.text}</span>
                        </div>
                      ) : msg.text.includes('https://') ? (
                        <div className="bg-blue-600 text-white p-3 rounded-lg">
                          <div className="text-sm font-medium">Freeart Studio</div>
                          <div className="text-xs opacity-90 mt-1">Contacto</div>
                          <div className="text-xs opacity-75 mt-2 leading-relaxed">
                            Contáctanos para obtener una estimación del tiempo y costo de tu proyecto. ¡Nuestro equipo dedicado de más de 50 expertos de la industria convertirá tus ideas más audaces en productos de vanguardia!
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm">{msg.text}</p>
                      )}
                      <div className={`flex items-center justify-end mt-1 space-x-1 ${
                        msg.sender === 'me' ? 'text-blue-200' : 'text-gray-500'
                      }`}>
                        <span className="text-xs">{msg.timestamp}</span>
                        {msg.sender === 'me' && (
                          <div className="flex">
                            <div className={`w-1 h-1 rounded-full ${
                              msg.status === 'read' ? 'bg-emerald-300' : 'bg-gray-300'
                            }`}></div>
                            <div className={`w-1 h-1 rounded-full ml-0.5 ${
                              msg.status === 'delivered' || msg.status === 'read' ? 'bg-emerald-300' : 'bg-gray-300'
                            }`}></div>
                          </div>
                        )}
                      </div>
                    </div>
                    {msg.sender === 'me' && (
                      <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                        AN
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-100 bg-white">
            <div className="flex items-center space-x-3">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                <Paperclip className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Escribe un mensaje..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors duration-200">
                  <Smile className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="p-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full transition-colors duration-200"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden lg:flex flex-1 items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg border-2 border-emerald-200">
              <Send className="w-12 h-12 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold text-emerald-800 mb-2">
              Selecciona una conversación
            </h3>
            <p className="text-emerald-600">
              Elige un contacto para comenzar a chatear
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;