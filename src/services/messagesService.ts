import { apiService } from './api';
import { API_ENDPOINTS } from '../config/api';
import { 
  Message, 
  Contact, 
  MessageFilters, 
  ApiResponse, 
  PaginatedResponse 
} from '../types';

export class MessagesService {
  // Obtener lista de mensajes
  async getMessages(filters?: MessageFilters): Promise<PaginatedResponse<Message>> {
    try {
      const response = await apiService.get<PaginatedResponse<Message>>(
        API_ENDPOINTS.MESSAGES.LIST,
        filters
      );
      return response;
    } catch (error) {
      console.error('Error al obtener mensajes:', error);
      throw error;
    }
  }

  // Obtener mensajes de un contacto específico
  async getMessagesByContact(contactId: string, filters?: Omit<MessageFilters, 'contactId'>): Promise<PaginatedResponse<Message>> {
    try {
      const response = await apiService.get<PaginatedResponse<Message>>(
        API_ENDPOINTS.MESSAGES.LIST,
        { ...filters, contactId }
      );
      return response;
    } catch (error) {
      console.error(`Error al obtener mensajes del contacto ${contactId}:`, error);
      throw error;
    }
  }

  // Enviar un nuevo mensaje
  async sendMessage(messageData: {
    text: string;
    contactId: string;
    attachments?: File[];
  }): Promise<Message> {
    try {
      let response;
      
      if (messageData.attachments && messageData.attachments.length > 0) {
        // Si hay archivos adjuntos, usar FormData
        const formData = new FormData();
        formData.append('text', messageData.text);
        formData.append('contactId', messageData.contactId);
        
        messageData.attachments.forEach((file, index) => {
          formData.append(`attachment_${index}`, file);
        });

        response = await apiService.post<ApiResponse<Message>>(
          API_ENDPOINTS.MESSAGES.CREATE,
          formData
        );
      } else {
        // Mensaje de texto simple
        response = await apiService.post<ApiResponse<Message>>(
          API_ENDPOINTS.MESSAGES.CREATE,
          {
            text: messageData.text,
            contactId: messageData.contactId,
          }
        );
      }

      return response.data;
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      throw error;
    }
  }

  // Marcar mensaje como leído
  async markAsRead(messageId: string): Promise<void> {
    try {
      await apiService.patch<ApiResponse<void>>(
        API_ENDPOINTS.MESSAGES.MARK_READ(messageId)
      );
    } catch (error) {
      console.error(`Error al marcar mensaje ${messageId} como leído:`, error);
      throw error;
    }
  }

  // Marcar múltiples mensajes como leídos
  async markMultipleAsRead(messageIds: string[]): Promise<void> {
    try {
      await apiService.patch<ApiResponse<void>>(
        `${API_ENDPOINTS.MESSAGES.LIST}/mark-read`,
        { messageIds }
      );
    } catch (error) {
      console.error('Error al marcar múltiples mensajes como leídos:', error);
      throw error;
    }
  }

  // Eliminar un mensaje
  async deleteMessage(messageId: string): Promise<void> {
    try {
      await apiService.delete<ApiResponse<void>>(
        API_ENDPOINTS.MESSAGES.DELETE(messageId)
      );
    } catch (error) {
      console.error(`Error al eliminar mensaje ${messageId}:`, error);
      throw error;
    }
  }

  // Obtener lista de contactos
  async getContacts(): Promise<Contact[]> {
    try {
      const response = await apiService.get<ApiResponse<Contact[]>>(
        API_ENDPOINTS.CONTACTS.LIST
      );
      return response.data;
    } catch (error) {
      console.error('Error al obtener contactos:', error);
      throw error;
    }
  }

  // Crear un nuevo contacto
  async createContact(contactData: {
    name: string;
    avatar?: string;
    phone?: string;
    email?: string;
  }): Promise<Contact> {
    try {
      const response = await apiService.post<ApiResponse<Contact>>(
        API_ENDPOINTS.CONTACTS.CREATE,
        contactData
      );
      return response.data;
    } catch (error) {
      console.error('Error al crear contacto:', error);
      throw error;
    }
  }

  // Actualizar un contacto
  async updateContact(contactId: string, updateData: {
    name?: string;
    avatar?: string;
    phone?: string;
    email?: string;
  }): Promise<Contact> {
    try {
      const response = await apiService.put<ApiResponse<Contact>>(
        API_ENDPOINTS.CONTACTS.UPDATE(contactId),
        updateData
      );
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar contacto ${contactId}:`, error);
      throw error;
    }
  }

  // Archivar un contacto
  async archiveContact(contactId: string): Promise<void> {
    try {
      await apiService.patch<ApiResponse<void>>(
        API_ENDPOINTS.CONTACTS.ARCHIVE(contactId)
      );
    } catch (error) {
      console.error(`Error al archivar contacto ${contactId}:`, error);
      throw error;
    }
  }

  // Eliminar un contacto
  async deleteContact(contactId: string): Promise<void> {
    try {
      await apiService.delete<ApiResponse<void>>(
        API_ENDPOINTS.CONTACTS.DELETE(contactId)
      );
    } catch (error) {
      console.error(`Error al eliminar contacto ${contactId}:`, error);
      throw error;
    }
  }

  // Buscar mensajes
  async searchMessages(query: string, contactId?: string): Promise<Message[]> {
    try {
      const params: any = { search: query };
      if (contactId) {
        params.contactId = contactId;
      }

      const response = await apiService.get<ApiResponse<Message[]>>(
        `${API_ENDPOINTS.MESSAGES.LIST}/search`,
        params
      );
      return response.data;
    } catch (error) {
      console.error('Error al buscar mensajes:', error);
      throw error;
    }
  }

  // Obtener estadísticas de mensajes
  async getMessagesStats(): Promise<{
    totalMessages: number;
    unreadMessages: number;
    activeContacts: number;
    archivedContacts: number;
    messagesThisWeek: number;
    responseTime: number;
  }> {
    try {
      const response = await apiService.get<ApiResponse<any>>(
        `${API_ENDPOINTS.MESSAGES.LIST}/stats`
      );
      return response.data;
    } catch (error) {
      console.error('Error al obtener estadísticas de mensajes:', error);
      throw error;
    }
  }

  // Exportar conversación
  async exportConversation(contactId: string, format: 'pdf' | 'txt'): Promise<Blob> {
    try {
      const blob = await apiService.downloadFile(
        `${API_ENDPOINTS.CONTACTS.GET(contactId)}/export?format=${format}`
      );
      return blob;
    } catch (error) {
      console.error(`Error al exportar conversación del contacto ${contactId}:`, error);
      throw error;
    }
  }
}

// Instancia singleton del servicio de mensajes
export const messagesService = new MessagesService();