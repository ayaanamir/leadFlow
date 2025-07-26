import {
  users,
  campaigns,
  leads,
  emailAlerts,
  chatMessages,
  type User,
  type UpsertUser,
  type Campaign,
  type InsertCampaign,
  type Lead,
  type InsertLead,
  type EmailAlert,
  type InsertEmailAlert,
  type ChatMessage,
  type InsertChatMessage,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, count } from "drizzle-orm";

export interface IStorage {
  // User operations - mandatory for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Campaign operations
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  getCampaignsByUserId(userId: string): Promise<Campaign[]>;
  getCampaign(id: string, userId: string): Promise<Campaign | undefined>;
  updateCampaign(id: string, userId: string, updates: Partial<Campaign>): Promise<Campaign | undefined>;
  
  // Lead operations
  createLead(lead: InsertLead): Promise<Lead>;
  getLeadsByCampaignId(campaignId: string): Promise<Lead[]>;
  getLeadsByUserId(userId: string, limit?: number, offset?: number): Promise<{ leads: Lead[], total: number }>;
  updateLead(id: string, updates: Partial<Lead>): Promise<Lead | undefined>;
  
  // Email alert operations
  createEmailAlert(alert: InsertEmailAlert): Promise<EmailAlert>;
  getEmailAlertsByUserId(userId: string, limit?: number): Promise<EmailAlert[]>;
  markEmailAlertAsRead(id: string, userId: string): Promise<void>;
  
  // Chat message operations
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatMessagesByUserId(userId: string, campaignId?: string): Promise<ChatMessage[]>;
  
  // Analytics
  getUserMetrics(userId: string): Promise<{
    totalLeads: number;
    activeCampaigns: number;
    qualifiedLeads: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async createCampaign(campaign: InsertCampaign): Promise<Campaign> {
    const [newCampaign] = await db.insert(campaigns).values(campaign).returning();
    return newCampaign;
  }

  async getCampaignsByUserId(userId: string): Promise<Campaign[]> {
    return await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.userId, userId))
      .orderBy(desc(campaigns.createdAt));
  }

  async getCampaign(id: string, userId: string): Promise<Campaign | undefined> {
    const [campaign] = await db
      .select()
      .from(campaigns)
      .where(and(eq(campaigns.id, id), eq(campaigns.userId, userId)));
    return campaign;
  }

  async updateCampaign(id: string, userId: string, updates: Partial<Campaign>): Promise<Campaign | undefined> {
    const [updated] = await db
      .update(campaigns)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(campaigns.id, id), eq(campaigns.userId, userId)))
      .returning();
    return updated;
  }

  async createLead(lead: InsertLead): Promise<Lead> {
    const [newLead] = await db.insert(leads).values(lead).returning();
    return newLead;
  }

  async getLeadsByCampaignId(campaignId: string): Promise<Lead[]> {
    return await db
      .select()
      .from(leads)
      .where(eq(leads.campaignId, campaignId))
      .orderBy(desc(leads.createdAt));
  }

  async getLeadsByUserId(userId: string, limit = 20, offset = 0): Promise<{ leads: Lead[], total: number }> {
    const userCampaigns = await db
      .select({ id: campaigns.id })
      .from(campaigns)
      .where(eq(campaigns.userId, userId));
    
    const campaignIds = userCampaigns.map(c => c.id);
    
    if (campaignIds.length === 0) {
      return { leads: [], total: 0 };
    }

    const leadsQuery = db
      .select()
      .from(leads)
      .where(eq(leads.campaignId, campaignIds[0])) // Start with first campaign
      .limit(limit)
      .offset(offset)
      .orderBy(desc(leads.createdAt));

    const totalQuery = db
      .select({ count: count() })
      .from(leads)
      .where(eq(leads.campaignId, campaignIds[0]));

    const [leadsResult, totalResult] = await Promise.all([
      leadsQuery,
      totalQuery
    ]);

    return {
      leads: leadsResult,
      total: totalResult[0]?.count || 0
    };
  }

  async updateLead(id: string, updates: Partial<Lead>): Promise<Lead | undefined> {
    const [updated] = await db
      .update(leads)
      .set(updates)
      .where(eq(leads.id, id))
      .returning();
    return updated;
  }

  async createEmailAlert(alert: InsertEmailAlert): Promise<EmailAlert> {
    const [newAlert] = await db.insert(emailAlerts).values(alert).returning();
    return newAlert;
  }

  async getEmailAlertsByUserId(userId: string, limit = 10): Promise<EmailAlert[]> {
    return await db
      .select()
      .from(emailAlerts)
      .where(eq(emailAlerts.userId, userId))
      .orderBy(desc(emailAlerts.createdAt))
      .limit(limit);
  }

  async markEmailAlertAsRead(id: string, userId: string): Promise<void> {
    await db
      .update(emailAlerts)
      .set({ isRead: true })
      .where(and(eq(emailAlerts.id, id), eq(emailAlerts.userId, userId)));
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [newMessage] = await db.insert(chatMessages).values(message).returning();
    return newMessage;
  }

  async getChatMessagesByUserId(userId: string, campaignId?: string): Promise<ChatMessage[]> {
    let query = db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.userId, userId));

    if (campaignId) {
      query = query.where(eq(chatMessages.campaignId, campaignId));
    }

    return await query.orderBy(chatMessages.createdAt);
  }

  async getUserMetrics(userId: string): Promise<{
    totalLeads: number;
    activeCampaigns: number;
    qualifiedLeads: number;
  }> {
    const userCampaigns = await db
      .select({ id: campaigns.id })
      .from(campaigns)
      .where(eq(campaigns.userId, userId));
    
    const campaignIds = userCampaigns.map(c => c.id);
    
    if (campaignIds.length === 0) {
      return { totalLeads: 0, activeCampaigns: 0, qualifiedLeads: 0 };
    }

    const [totalLeadsResult] = await db
      .select({ count: count() })
      .from(leads)
      .where(eq(leads.campaignId, campaignIds[0]));

    const [activeCampaignsResult] = await db
      .select({ count: count() })
      .from(campaigns)
      .where(and(
        eq(campaigns.userId, userId),
        eq(campaigns.status, "created")
      ));

    const [qualifiedLeadsResult] = await db
      .select({ count: count() })
      .from(leads)
      .where(and(
        eq(leads.campaignId, campaignIds[0]),
        eq(leads.qualified, true)
      ));

    return {
      totalLeads: totalLeadsResult?.count || 0,
      activeCampaigns: activeCampaignsResult?.count || 0,
      qualifiedLeads: qualifiedLeadsResult?.count || 0,
    };
  }
}

export const storage = new DatabaseStorage();
