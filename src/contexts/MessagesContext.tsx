import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { messagesService } from '../services/messagesService';
import { 
  Message, 
  Contact, 
  MessageFilters, 
  MessagesState 
} from '../types';
import { getErrorMessage } from '../services/api';

// Tipos para las acciones del reducer
type MessagesAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_MESSAGES'; payload: Message[] }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'UPDATE_MESSAGE'; payload: Message }
  | { type: 'DELETE_MESSAGE'; payload: string }
  | { type: 'SET_CONTACTS'; payload: Contact[] }
  | { type: 'ADD_CONTACT'; payload: Contact }
  | { type: 'UPDATE_CONTACT'; payload: Contact }
  | { type: 'DELETE_CONTACT'; payload: string }
  | { type: 'SET_CURRENT_CONTACT'; payload: Contact | null }
  | { type: 'SET_FILTERS'; payload: MessageFilters }
  | { type: 'MARK_MESSAGES_READ'; payload: string[] }
  | { type: 'CLEAR_MESSAGES' }
  | { type: 'CLEAR_ERROR' };

// Estado inicial
const initialState: MessagesState = {
  messages: [],
  contacts: [],
  currentContact: null,
  filters: {
    page: 1,
    limit: 50,
  },
  isLoading: false,
  error: null,
};

// Reducer para manejar el estado de mensajes
const messagesReducer = (state: MessagesState, action: MessagesAction): MessagesState => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case 'SET_MESSAGES':
      return {
        ...state,
        messages: action.payload,
        isLoading: false,
        error: null,
      };

    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };

    case 'UPDATE_MESSAGE':
      return {
        ...state,
        messages: state.messages.map(message =>
          message.id === action.payload.id ? action.payload : message
        ),
      };

    case 'DELETE_MESSAGE':
      return {
        ...state,
        messages: state.messages.filter(message => message.id !== action.payload),
      };

    case 'SET_CONTACTS':
      return {
        ...state,
        contacts: action.payload,
        isLoading: false,
        error: null,
      };

    case 'ADD_CONTACT':
      return {
        ...state,
        contacts: [action.payload, ...state.contacts],
      };

    case 'UPDATE_CONTACT':
      return {
        ...state,
        contacts: state.contacts.map(contact =>
          contact.id === action.payload.id ? action.payload : contact
        ),
        currentContact: state.currentContact?.id === action.payload.id 
          ? action.payload 
          : state.currentContact,
      };

    case 'DELETE_CONTACT':
      return {
        ...state,
        contacts: state.contacts.filter(contact => contact.id !== action.payload),
        currentContact: state.currentContact?.id === action.payload 
          ? null 
          : state.currentContact,
      };

    case 'SET_CURRENT_CONTACT':
      return {
        ...state,
        currentContact: action.payload,
      };

    case 'SET_FILTERS':
      return {
        ...state,
        filters: action.payload,
      };

    case 'MARK_MESSAGES_READ':
      return {
        ...state,
        messages: state.messages.map(message =>
          action.payload.includes(message.id) 
            ? { ...message, status: 'read' as const }
            : message
        ),
      };

    case 'CLEAR_MESSAGES':
      return {
        ...state,
        messages: [],
        currentContact: null,
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

// Interfaz del contexto
interface MessagesContextType extends MessagesState {
  // Operaciones de mensajes
  fetchMessages: (filters?: MessageFilters) => Promise<void>;
  fetchMessagesByContact: (contactId: string, filters?: Omit<MessageFilters, 'contactId'>) => Promise<void>;
  sendMessage: (messageData: { text: string; contactId: string; attachments?: File[] }) => Promise<Message>;
  markAsRead: (messageId: string) => Promise<void>;
  markMultipleAsRead: (messageIds: string[]) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  searchMessages: (query: string, contactId?: string) => Promise<Message[]>;
  
  // Operaciones de contactos
  fetchContacts: () => Promise<void>;
  createContact: (contactData: { name: string; avatar?: string; phone?: string; email?: string }) => Promise<Contact>;
  updateContact: (contactId: string, updateData: { name?: string; avatar?: string; phone?: string; email?: string }) => Promise<void>;
  archiveContact: (contactId: string) => Promise<void>;
  deleteContact: (contactId: string) => Promise<void>;
  
  // Utilidades
  setCurrentContact: (contact: Contact | null) => void;
  setFilters: (filters: MessageFilters) => void;
  clearError: () => void;
  clearMessages: () => void;
  exportConversation: (contactId: string, format: 'pdf' | 'txt') => Promise<void>;
}

// Crear el contexto
const MessagesContext = createContext<MessagesContextType | undefined>(undefined);

// Props del proveedor
interface MessagesProviderProps {
  children: ReactNode;
}

// Proveedor del contexto de mensajes
export const MessagesProvider: React.FC<MessagesProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(messagesReducer, initialState);

  // Obtener mensajes
  const fetchMessages = async (filters?: MessageFilters): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const finalFilters = { ...state.filters, ...filters };
      dispatch({ type: 'SET_FILTERS', payload: finalFilters });
      
      const response = await messagesService.getMessages(finalFilters);
      dispatch({ type: 'SET_MESSAGES', payload: response.data });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Obtener mensajes por contacto
  const fetchMessagesByContact = async (
    contactId: string, 
    filters?: Omit<MessageFilters, 'contactId'>
  ): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const finalFilters = { ...state.filters, ...filters, contactId };
      dispatch({ type: 'SET_FILTERS', payload: finalFilters });
      
      const response = await messagesService.getMessagesByContact(contactId, filters);
      dispatch({ type: 'SET_MESSAGES', payload: response.data });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Enviar mensaje
  const sendMessage = async (messageData: {
    text: string;
    contactId: string;
    attachments?: File[];
  }): Promise<Message> => {
    try {
      const newMessage = await messagesService.sendMessage(messageData);
      dispatch({ type: 'ADD_MESSAGE', payload: newMessage });
      
      // Actualizar el último mensaje del contacto
      const contact = state.contacts.find(c => c.id === messageData.contactId);
      if (contact) {
        const updatedContact = {
          ...contact,
          lastMessage: messageData.text,
          timestamp: newMessage.timestamp,
        };
        dispatch({ type: 'UPDATE_CONTACT', payload: updatedContact });
      }
      
      return newMessage;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Marcar mensaje como leído
  const markAsRead = async (messageId: string): Promise<void> => {
    try {
      await messagesService.markAsRead(messageId);
      dispatch({ type: 'MARK_MESSAGES_READ', payload: [messageId] });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Marcar múltiples mensajes como leídos
  const markMultipleAsRead = async (messageIds: string[]): Promise<void> => {
    try {
      await messagesService.markMultipleAsRead(messageIds);
      dispatch({ type: 'MARK_MESSAGES_READ', payload: messageIds });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Eliminar mensaje
  const deleteMessage = async (messageId: string): Promise<void> => {
    try {
      await messagesService.deleteMessage(messageId);
      dispatch({ type: 'DELETE_MESSAGE', payload: messageId });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Buscar mensajes
  const searchMessages = async (query: string, contactId?: string): Promise<Message[]> => {
    try {
      const messages = await messagesService.searchMessages(query, contactId);
      return messages;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Obtener contactos
  const fetchContacts = async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const contacts = await messagesService.getContacts();
      dispatch({ type: 'SET_CONTACTS', payload: contacts });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Crear contacto
  const createContact = async (contactData: {
    name: string;
    avatar?: string;
    phone?: string;
    email?: string;
  }): Promise<Contact> => {
    try {
      const newContact = await messagesService.createContact(contactData);
      dispatch({ type: 'ADD_CONTACT', payload: newContact });
      return newContact;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Actualizar contacto
  const updateContact = async (contactId: string, updateData: {
    name?: string;
    avatar?: string;
    phone?: string;
    email?: string;
  }): Promise<void> => {
    try {
      const updatedContact = await messagesService.updateContact(contactId, updateData);
      dispatch({ type: 'UPDATE_CONTACT', payload: updatedContact });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Archivar contacto
  const archiveContact = async (contactId: string): Promise<void> => {
    try {
      await messagesService.archiveContact(contactId);
      // Actualizar el contacto para marcarlo como archivado
      const contact = state.contacts.find(c => c.id === contactId);
      if (contact) {
        const updatedContact = { ...contact, status: 'archived' };
        dispatch({ type: 'UPDATE_CONTACT', payload: updatedContact });
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Eliminar contacto
  const deleteContact = async (contactId: string): Promise<void> => {
    try {
      await messagesService.deleteContact(contactId);
      dispatch({ type: 'DELETE_CONTACT', payload: contactId });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Exportar conversación
  const exportConversation = async (contactId: string, format: 'pdf' | 'txt'): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const blob = await messagesService.exportConversation(contactId, format);
      
      // Crear URL temporal y descargar
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `conversacion_${contactId}_${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Establecer contacto actual
  const setCurrentContact = (contact: Contact | null): void => {
    dispatch({ type: 'SET_CURRENT_CONTACT', payload: contact });
  };

  // Establecer filtros
  const setFilters = (filters: MessageFilters): void => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  // Limpiar errores
  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Limpiar mensajes
  const clearMessages = (): void => {
    dispatch({ type: 'CLEAR_MESSAGES' });
  };

  // Valor del contexto
  const contextValue: MessagesContextType = {
    ...state,
    fetchMessages,
    fetchMessagesByContact,
    sendMessage,
    markAsRead,
    markMultipleAsRead,
    deleteMessage,
    searchMessages,
    fetchContacts,
    createContact,
    updateContact,
    archiveContact,
    deleteContact,
    setCurrentContact,
    setFilters,
    clearError,
    clearMessages,
    exportConversation,
  };

  return (
    <MessagesContext.Provider value={contextValue}>
      {children}
    </MessagesContext.Provider>
  );
};

// Hook para usar el contexto de mensajes
export const useMessages = (): MessagesContextType => {
  const context = useContext(MessagesContext);
  if (context === undefined) {
    throw new Error('useMessages debe ser usado dentro de un MessagesProvider');
  }
  return context;
};