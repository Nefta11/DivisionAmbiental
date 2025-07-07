import { useEffect, useRef, useState, useCallback } from 'react';
import { authService } from '../services/authService';

// Tipos para WebSocket
interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: string;
}

interface UseWebSocketOptions {
  url?: string;
  protocols?: string | string[];
  onOpen?: (event: Event) => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (event: Event) => void;
  onMessage?: (message: WebSocketMessage) => void;
  reconnectAttempts?: number;
  reconnectInterval?: number;
  heartbeatInterval?: number;
}

// Estados de conexión
type ConnectionState = 'connecting' | 'connected' | 'disconnected' | 'error';

// Hook para manejar WebSocket
export const useWebSocket = (options: UseWebSocketOptions = {}) => {
  const {
    url = `${import.meta.env.VITE_WS_URL || 'ws://localhost:3000'}/ws`,
    protocols,
    onOpen,
    onClose,
    onError,
    onMessage,
    reconnectAttempts = 5,
    reconnectInterval = 3000,
    heartbeatInterval = 30000,
  } = options;

  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [messageHistory, setMessageHistory] = useState<WebSocketMessage[]>([]);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectCountRef = useRef(0);
  const messageListenersRef = useRef<Map<string, ((payload: any) => void)[]>>(new Map());

  // Función para enviar heartbeat
  const sendHeartbeat = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'heartbeat',
        payload: { timestamp: new Date().toISOString() },
        timestamp: new Date().toISOString(),
      }));
    }
  }, []);

  // Función para configurar heartbeat
  const setupHeartbeat = useCallback(() => {
    if (heartbeatTimeoutRef.current) {
      clearInterval(heartbeatTimeoutRef.current);
    }
    
    heartbeatTimeoutRef.current = setInterval(sendHeartbeat, heartbeatInterval);
  }, [sendHeartbeat, heartbeatInterval]);

  // Función para limpiar heartbeat
  const clearHeartbeat = useCallback(() => {
    if (heartbeatTimeoutRef.current) {
      clearInterval(heartbeatTimeoutRef.current);
      heartbeatTimeoutRef.current = null;
    }
  }, []);

  // Función para conectar WebSocket
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      setConnectionState('connecting');
      
      // Obtener token de autenticación
      const token = authService.getToken();
      const wsUrl = token ? `${url}?token=${token}` : url;
      
      wsRef.current = new WebSocket(wsUrl, protocols);

      wsRef.current.onopen = (event) => {
        setConnectionState('connected');
        reconnectCountRef.current = 0;
        setupHeartbeat();
        onOpen?.(event);
      };

      wsRef.current.onclose = (event) => {
        setConnectionState('disconnected');
        clearHeartbeat();
        onClose?.(event);

        // Intentar reconectar si no fue un cierre intencional
        if (!event.wasClean && reconnectCountRef.current < reconnectAttempts) {
          reconnectCountRef.current++;
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval * reconnectCountRef.current);
        }
      };

      wsRef.current.onerror = (event) => {
        setConnectionState('error');
        clearHeartbeat();
        onError?.(event);
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          setLastMessage(message);
          setMessageHistory(prev => [...prev.slice(-99), message]); // Mantener últimos 100 mensajes
          
          // Llamar callback general
          onMessage?.(message);
          
          // Llamar listeners específicos por tipo
          const listeners = messageListenersRef.current.get(message.type) || [];
          listeners.forEach(listener => listener(message.payload));
        } catch (error) {
          console.error('Error al parsear mensaje WebSocket:', error);
        }
      };
    } catch (error) {
      console.error('Error al conectar WebSocket:', error);
      setConnectionState('error');
    }
  }, [url, protocols, onOpen, onClose, onError, onMessage, reconnectAttempts, reconnectInterval, setupHeartbeat, clearHeartbeat]);

  // Función para desconectar WebSocket
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    clearHeartbeat();
    
    if (wsRef.current) {
      wsRef.current.close(1000, 'Desconexión intencional');
      wsRef.current = null;
    }
    
    setConnectionState('disconnected');
    reconnectCountRef.current = 0;
  }, [clearHeartbeat]);

  // Función para enviar mensaje
  const sendMessage = useCallback((type: string, payload: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage = {
        type,
        payload,
        timestamp: new Date().toISOString(),
      };
      
      wsRef.current.send(JSON.stringify(message));
      return true;
    }
    
    console.warn('WebSocket no está conectado');
    return false;
  }, []);

  // Función para suscribirse a mensajes de un tipo específico
  const subscribe = useCallback((messageType: string, callback: (payload: any) => void) => {
    const listeners = messageListenersRef.current.get(messageType) || [];
    listeners.push(callback);
    messageListenersRef.current.set(messageType, listeners);

    // Retornar función para desuscribirse
    return () => {
      const currentListeners = messageListenersRef.current.get(messageType) || [];
      const filteredListeners = currentListeners.filter(listener => listener !== callback);
      
      if (filteredListeners.length === 0) {
        messageListenersRef.current.delete(messageType);
      } else {
        messageListenersRef.current.set(messageType, filteredListeners);
      }
    };
  }, []);

  // Función para obtener mensajes por tipo
  const getMessagesByType = useCallback((messageType: string): WebSocketMessage[] => {
    return messageHistory.filter(message => message.type === messageType);
  }, [messageHistory]);

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    connectionState,
    lastMessage,
    messageHistory,
    connect,
    disconnect,
    sendMessage,
    subscribe,
    getMessagesByType,
    isConnected: connectionState === 'connected',
    isConnecting: connectionState === 'connecting',
    isDisconnected: connectionState === 'disconnected',
    hasError: connectionState === 'error',
  };
};

// Hook específico para notificaciones en tiempo real
export const useRealtimeNotifications = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  
  const { subscribe, isConnected } = useWebSocket({
    onMessage: (message) => {
      if (message.type === 'notification') {
        setNotifications(prev => [message.payload, ...prev.slice(0, 49)]); // Mantener últimas 50
      }
    },
  });

  useEffect(() => {
    const unsubscribe = subscribe('notification', (payload) => {
      // Mostrar notificación del navegador si está permitido
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(payload.title, {
          body: payload.message,
          icon: '/favicon.ico',
        });
      }
    });

    return unsubscribe;
  }, [subscribe]);

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    unreadCount: notifications.filter(n => !n.read).length,
    markAsRead,
    clearAll,
    isConnected,
  };
};

// Hook para actualizaciones en tiempo real de reportes
export const useRealtimeReports = () => {
  const { subscribe, sendMessage, isConnected } = useWebSocket();

  const subscribeToReportUpdates = useCallback((callback: (report: any) => void) => {
    return subscribe('report_updated', callback);
  }, [subscribe]);

  const subscribeToNewReports = useCallback((callback: (report: any) => void) => {
    return subscribe('report_created', callback);
  }, [subscribe]);

  const subscribeToReportDeleted = useCallback((callback: (reportId: string) => void) => {
    return subscribe('report_deleted', callback);
  }, [subscribe]);

  const joinReportRoom = useCallback((reportId: string) => {
    sendMessage('join_report_room', { reportId });
  }, [sendMessage]);

  const leaveReportRoom = useCallback((reportId: string) => {
    sendMessage('leave_report_room', { reportId });
  }, [sendMessage]);

  return {
    subscribeToReportUpdates,
    subscribeToNewReports,
    subscribeToReportDeleted,
    joinReportRoom,
    leaveReportRoom,
    isConnected,
  };
};

// Hook para chat en tiempo real
export const useRealtimeChat = () => {
  const { subscribe, sendMessage, isConnected } = useWebSocket();

  const subscribeToMessages = useCallback((callback: (message: any) => void) => {
    return subscribe('new_message', callback);
  }, [subscribe]);

  const subscribeToTyping = useCallback((callback: (data: { contactId: string; isTyping: boolean }) => void) => {
    return subscribe('typing', callback);
  }, [subscribe]);

  const subscribeToOnlineStatus = useCallback((callback: (data: { contactId: string; online: boolean }) => void) => {
    return subscribe('online_status', callback);
  }, [subscribe]);

  const sendTypingIndicator = useCallback((contactId: string, isTyping: boolean) => {
    sendMessage('typing', { contactId, isTyping });
  }, [sendMessage]);

  const joinChatRoom = useCallback((contactId: string) => {
    sendMessage('join_chat_room', { contactId });
  }, [sendMessage]);

  const leaveChatRoom = useCallback((contactId: string) => {
    sendMessage('leave_chat_room', { contactId });
  }, [sendMessage]);

  return {
    subscribeToMessages,
    subscribeToTyping,
    subscribeToOnlineStatus,
    sendTypingIndicator,
    joinChatRoom,
    leaveChatRoom,
    isConnected,
  };
};