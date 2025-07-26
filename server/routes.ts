import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { processConversationMessage } from "./openai";
import { insertCampaignSchema, insertChatMessageSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Campaign routes
  app.get('/api/campaigns', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const campaigns = await storage.getCampaignsByUserId(userId);
      res.json(campaigns);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      res.status(500).json({ message: "Failed to fetch campaigns" });
    }
  });

  app.post('/api/campaigns', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const campaignData = insertCampaignSchema.parse({
        ...req.body,
        userId,
      });
      
      const campaign = await storage.createCampaign(campaignData);
      res.json(campaign);
    } catch (error) {
      console.error("Error creating campaign:", error);
      res.status(500).json({ message: "Failed to create campaign" });
    }
  });

  app.patch('/api/campaigns/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      
      const updated = await storage.updateCampaign(id, userId, req.body);
      if (!updated) {
        return res.status(404).json({ message: "Campaign not found" });
      }
      
      res.json(updated);
    } catch (error) {
      console.error("Error updating campaign:", error);
      res.status(500).json({ message: "Failed to update campaign" });
    }
  });

  // Lead routes
  app.get('/api/leads', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = (page - 1) * limit;
      
      const result = await storage.getLeadsByUserId(userId, limit, offset);
      res.json(result);
    } catch (error) {
      console.error("Error fetching leads:", error);
      res.status(500).json({ message: "Failed to fetch leads" });
    }
  });

  app.patch('/api/leads/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const updated = await storage.updateLead(id, req.body);
      
      if (!updated) {
        return res.status(404).json({ message: "Lead not found" });
      }
      
      res.json(updated);
    } catch (error) {
      console.error("Error updating lead:", error);
      res.status(500).json({ message: "Failed to update lead" });
    }
  });

  // Email alerts routes
  app.get('/api/email-alerts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const alerts = await storage.getEmailAlertsByUserId(userId);
      res.json(alerts);
    } catch (error) {
      console.error("Error fetching email alerts:", error);
      res.status(500).json({ message: "Failed to fetch email alerts" });
    }
  });

  app.patch('/api/email-alerts/:id/read', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      
      await storage.markEmailAlertAsRead(id, userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking alert as read:", error);
      res.status(500).json({ message: "Failed to mark alert as read" });
    }
  });

  // Chat routes
  app.post('/api/chat', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { message, campaignId } = req.body;

      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

      // Get conversation history
      const history = await storage.getChatMessagesByUserId(userId, campaignId);
      const conversationHistory = history.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      }));

      // Process with OpenAI
      const result = await processConversationMessage(message, conversationHistory);

      // Save user message
      await storage.createChatMessage({
        userId,
        campaignId: campaignId || null,
        role: 'user',
        content: message,
      });

      // Save AI response
      await storage.createChatMessage({
        userId,
        campaignId: campaignId || null,
        role: 'assistant',
        content: result.reply,
      });

      // Create campaign if ready
      let newCampaign = null;
      if (result.shouldCreateCampaign && result.campaignParameters && result.campaignName) {
        newCampaign = await storage.createCampaign({
          userId,
          name: result.campaignName,
          parameters: result.campaignParameters,
          status: 'created',
        });
      }

      res.json({
        reply: result.reply,
        shouldCreateCampaign: result.shouldCreateCampaign,
        campaign: newCampaign,
      });
    } catch (error) {
      console.error("Error processing chat:", error);
      res.status(500).json({ message: "Failed to process chat message" });
    }
  });

  app.get('/api/chat/:campaignId?', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { campaignId } = req.params;
      
      const messages = await storage.getChatMessagesByUserId(userId, campaignId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      res.status(500).json({ message: "Failed to fetch chat messages" });
    }
  });

  // Analytics routes
  app.get('/api/analytics/metrics', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const metrics = await storage.getUserMetrics(userId);
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching metrics:", error);
      res.status(500).json({ message: "Failed to fetch metrics" });
    }
  });

  // Webhook routes for n8n integration
  app.post('/api/webhooks/campaign-update', async (req, res) => {
    try {
      const { user_id, campaign_id, status, lead_count } = req.body;

      if (!user_id || !campaign_id) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Update campaign status
      const updates: any = {};
      if (status) updates.status = status;
      if (lead_count !== undefined) updates.leadCount = lead_count;

      // Calculate progress based on status
      if (status === 'scraped') updates.progress = 50;
      if (status === 'researched') updates.progress = 75;
      if (status === 'complete') updates.progress = 100;

      await storage.updateCampaign(campaign_id, user_id, updates);

      res.json({ success: true });
    } catch (error) {
      console.error("Error processing webhook:", error);
      res.status(500).json({ message: "Failed to process webhook" });
    }
  });

  // Webhook to receive new leads
  app.post('/api/webhooks/leads', async (req, res) => {
    try {
      const { campaign_id, leads: newLeads } = req.body;

      if (!campaign_id || !Array.isArray(newLeads)) {
        return res.status(400).json({ message: "Invalid webhook payload" });
      }

      // Insert new leads
      for (const leadData of newLeads) {
        await storage.createLead({
          campaignId: campaign_id,
          name: leadData.name,
          email: leadData.email,
          jobTitle: leadData.jobTitle,
          company: leadData.company,
          location: leadData.location,
          linkedinUrl: leadData.linkedinUrl,
        });
      }

      res.json({ success: true, processed: newLeads.length });
    } catch (error) {
      console.error("Error processing leads webhook:", error);
      res.status(500).json({ message: "Failed to process leads webhook" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
