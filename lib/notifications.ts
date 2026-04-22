/**
 * Centralized Notification Service for ArchiTrade
 * Handles App Notifications, Email (Resend), and Manual WhatsApp Forwarding
 */

import { createClient } from "@/lib/supabase/client";

interface NotificationOptions {
  userId: string;
  title: string;
  message: string;
  type?: "info" | "success" | "warning" | "error";
  email?: string;
  phone?: string;
}

export const notificationService = {
  /**
   * Send internal notification to the database
   */
  async sendInternal(options: NotificationOptions) {
    const supabase = createClient();
    const { error } = await supabase.from("notifications").insert({
      user_id: options.userId,
      title: options.title,
      message: options.message,
      type: options.type || "info",
      created_at: new Date().toISOString(),
      is_read: false,
    });
    
    if (error) console.error("Error sending internal notification:", error);
    return !error;
  },

  /**
   * Send Email notification via Resend
   */
  async sendEmail(options: NotificationOptions) {
    if (!options.email) return false;

    try {
      const response = await fetch("/api/notifications/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: options.email,
          subject: options.title,
          text: options.message,
        }),
      });
      
      const result = await response.json();
      return result.success;
    } catch (err) {
      console.error("Error sending email:", err);
      return false;
    }
  },

  /**
   * Generate WhatsApp Link for manual forwarding
   * @returns string WhatsApp URL
   */
  getWALink(phone: string, message: string) {
    // Format phone number (remove +, spaces, etc)
    const cleanPhone = phone.replace(/\D/g, "");
    const encodedMsg = encodeURIComponent(message);
    return `https://wa.me/${cleanPhone}?text=${encodedMsg}`;
  },

  /**
   * Send all active channels (Utility)
   */
  async sendAll(options: NotificationOptions) {
    const internal = await this.sendInternal(options);
    const email = options.email ? await this.sendEmail(options) : true;
    
    return { internal, email };
  }
};
