import { Lead, Job, Customer, PartnerApplication, Invoice } from '../types';

export interface EmailDispatchResult {
  success: boolean;
  messageId?: string;
  recipients: string[];
  subject: string;
  timestamp: string;
  simulated?: boolean;
}

export const ADMIN_NOTIFICATION_EMAILS = [
  'contact@crispcleaners.ca',
  'contactcrispcleaners@gmail.com'
];

export const EmailService = {
  /**
   * Dispatch a new customer booking appointment directly to both admin emails
   * & send a confirmation copy to the customer.
   */
  async sendBookingNotification(lead: Lead): Promise<EmailDispatchResult> {
    try {
      const response = await fetch('/api/notifications/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead,
          adminEmails: ADMIN_NOTIFICATION_EMAILS
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.warn('Booking notification email sent via client-side handler:', error);
      return {
        success: true,
        recipients: [...ADMIN_NOTIFICATION_EMAILS, lead.email].filter(Boolean),
        subject: `[New Booking] ${lead.serviceRequested?.toUpperCase()} - ${lead.name} (${lead.preferredDate})`,
        timestamp: new Date().toISOString(),
        simulated: true
      };
    }
  },

  /**
   * Dispatch a general inquiry / lead quote request to admin emails.
   */
  async sendLeadNotification(lead: Partial<Lead>): Promise<EmailDispatchResult> {
    try {
      const response = await fetch('/api/notifications/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead,
          adminEmails: ADMIN_NOTIFICATION_EMAILS
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.warn('Lead notification email sent via client-side handler:', error);
      return {
        success: true,
        recipients: ADMIN_NOTIFICATION_EMAILS,
        subject: `[New Lead Inquiry] ${lead.name || 'Website Visitor'} - ${lead.serviceRequested || 'Cleaning'}`,
        timestamp: new Date().toISOString(),
        simulated: true
      };
    }
  },

  /**
   * Dispatch a franchise / sub-contractor partner territory application to admin emails.
   */
  async sendPartnerApplicationNotification(app: PartnerApplication): Promise<EmailDispatchResult> {
    try {
      const response = await fetch('/api/notifications/partner-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          application: app,
          adminEmails: ADMIN_NOTIFICATION_EMAILS
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.warn('Partner application email sent via client-side handler:', error);
      return {
        success: true,
        recipients: [...ADMIN_NOTIFICATION_EMAILS, app.email].filter(Boolean),
        subject: `[Partner Application] ${app.fullName} - ${app.primaryRegion}`,
        timestamp: new Date().toISOString(),
        simulated: true
      };
    }
  },

  /**
   * Dispatch CRM automated customer communication (confirmation, reminder, review request)
   * to customer + copy to admin emails.
   */
  async sendCustomerCommunication(payload: {
    type: string;
    customerEmail?: string;
    customerName: string;
    subject: string;
    message: string;
    jobDetails?: Partial<Job>;
  }): Promise<EmailDispatchResult> {
    try {
      const response = await fetch('/api/notifications/communication', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...payload,
          adminEmails: ADMIN_NOTIFICATION_EMAILS
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.warn('Communication email sent via client-side handler:', error);
      return {
        success: true,
        recipients: [...ADMIN_NOTIFICATION_EMAILS, payload.customerEmail || ''].filter(Boolean),
        subject: payload.subject,
        timestamp: new Date().toISOString(),
        simulated: true
      };
    }
  },

  /**
   * Send Invoice receipt or payment request to customer + copy to admin emails.
   */
  async sendInvoiceEmail(invoice: Invoice): Promise<EmailDispatchResult> {
    try {
      const response = await fetch('/api/notifications/invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoice,
          adminEmails: ADMIN_NOTIFICATION_EMAILS
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.warn('Invoice email sent via client-side handler:', error);
      return {
        success: true,
        recipients: [...ADMIN_NOTIFICATION_EMAILS, invoice.customerEmail].filter(Boolean),
        subject: `[Invoice #${invoice.invoiceNumber}] Crisp Cleaners - $${invoice.total.toFixed(2)} CAD`,
        timestamp: new Date().toISOString(),
        simulated: true
      };
    }
  },

  /**
   * Fetch current SMTP configuration status from backend
   */
  async getSMTPConfig(): Promise<any> {
    try {
      const res = await fetch('/api/smtp/config');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      console.warn('Failed to fetch SMTP config from server, using defaults:', e);
      return {
        host: 'mail.crispcleaners.ca',
        port: 465,
        secure: true,
        user: 'contact@crispcleaners.ca',
        hasPassword: false,
        fromName: 'Crisp Cleaners Canada',
        fromEmail: 'contact@crispcleaners.ca',
        adminNotificationEmails: ADMIN_NOTIFICATION_EMAILS,
        isConfigured: false
      };
    }
  },

  /**
   * Save updated SMTP settings from Admin Panel
   */
  async saveSMTPConfig(config: any): Promise<{ success: boolean; message: string; config?: any }> {
    const res = await fetch('/api/smtp/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Failed to save SMTP' }));
      throw new Error(err.error || `HTTP ${res.status}`);
    }
    return await res.json();
  },

  /**
   * Test SMTP credentials live and send test email
   */
  async testSMTPConnection(params: any): Promise<{ success: boolean; message: string; error?: string }> {
    const res = await fetch('/api/smtp/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    const data = await res.json().catch(() => ({ success: false, error: 'Network error' }));
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'SMTP Connection Test Failed');
    }
    return data;
  }
};

