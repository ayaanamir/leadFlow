import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key" 
});

export interface CampaignParameters {
  location: string[];
  business: string[];
  job_title: string[];
}

export async function processConversationMessage(
  message: string,
  conversationHistory: Array<{ role: 'user' | 'assistant', content: string }>
): Promise<{
  reply: string;
  shouldCreateCampaign: boolean;
  campaignParameters?: CampaignParameters;
  campaignName?: string;
}> {
  const systemPrompt = `# Overview 
You are Lead Generation Joe, a friendly AI assistant that helps users create lead generation campaigns. Your goal is to collect enough information to build targeted search parameters.

# Your Personality
- Friendly, professional, and helpful
- Expert in lead generation and B2B prospecting
- Ask clarifying questions when needed
- Guide users step-by-step through campaign creation

# Information to Collect
You need to gather:
1. Business type/industry (e.g., "tech startups", "marketing agencies", "SaaS companies")
2. Job titles/roles (e.g., "CEO", "founder", "marketing director")
3. Geographic locations (e.g., "Sydney Australia", "New York USA")

# Response Format
Always respond with JSON in this exact format:
{
  "reply": "Your conversational response to the user",
  "shouldCreateCampaign": false,
  "campaignParameters": null,
  "campaignName": null
}

When you have collected ALL required information, set shouldCreateCampaign to true and include:
{
  "reply": "Perfect! I'll create your campaign now...",
  "shouldCreateCampaign": true,
  "campaignParameters": {
    "location": ["sydney+australia", "melbourne+australia"],
    "business": ["tech+startup", "saas+company"],
    "job_title": ["ceo", "founder", "cto"]
  },
  "campaignName": "Tech Startup Leaders - Australia"
}

# Important Rules
- Always replace spaces with '+' in parameters (e.g., "Los Angeles" becomes "los+angeles")
- Convert everything to lowercase for parameters
- Don't create campaign until you have all three categories of information
- Ask follow-up questions if information is unclear or missing
- Generate a descriptive campaign name when creating campaign

# Introduction
If this is the first message, introduce yourself as Lead Generation Joe and ask what type of leads they want to target.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        ...conversationHistory,
        { role: "user", content: message }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      reply: result.reply || "I'm sorry, I didn't understand that. Could you please rephrase?",
      shouldCreateCampaign: result.shouldCreateCampaign || false,
      campaignParameters: result.campaignParameters || undefined,
      campaignName: result.campaignName || undefined,
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to process message with AI: " + (error as Error).message);
  }
}

export async function generateCampaignName(parameters: CampaignParameters): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Generate a concise, professional campaign name (max 50 characters) based on the given parameters. Respond with only the campaign name, no extra text."
        },
        {
          role: "user",
          content: `Business: ${parameters.business.join(', ')}\nJob Titles: ${parameters.job_title.join(', ')}\nLocations: ${parameters.location.join(', ')}`
        }
      ],
      temperature: 0.5,
    });

    return response.choices[0].message.content?.trim() || "New Campaign";
  } catch (error) {
    console.error("Failed to generate campaign name:", error);
    return "New Campaign";
  }
}
