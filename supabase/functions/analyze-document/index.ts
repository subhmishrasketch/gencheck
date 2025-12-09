import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { textContent, fileName, fileType, metadata, contentStats, useProModel } = await req.json();
    
    if (!textContent) {
      return new Response(
        JSON.stringify({ error: "No content provided for analysis" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Analyzing document: ${fileName} (${fileType})`);
    console.log(`Content length: ${textContent.length} characters`);
    console.log(`Content stats:`, contentStats);
    console.log(`Metadata:`, metadata);

    const systemPrompt = `You are an expert AI content detector specialized in analyzing presentations and documents. Your task is to determine whether the content was created by AI or by humans, and identify which AI tool was likely used.

CRITICAL: Analyze the ACTUAL EXTRACTED TEXT content provided. Perform a thorough analysis covering:

1. **Writing Style Analysis:**
   - Sentence structure patterns (AI tends to use consistent, formal structures)
   - Vocabulary diversity and complexity
   - Use of transitional phrases (AI often overuses "Furthermore," "Moreover," "In conclusion")
   - Presence of filler phrases common in AI text
   - Natural vs mechanical flow

2. **Content Depth Analysis:**
   - Specificity vs generic statements
   - Presence of unique insights, personal experiences, or domain expertise
   - Depth of examples and case studies
   - Factual accuracy indicators

3. **Structural Patterns:**
   - Slide/page organization patterns
   - Bullet point consistency
   - Heading hierarchy patterns
   - Visual element descriptions

4. **AI Tool Detection Signatures:**
   - ChatGPT: Tends to use "delve," "leverage," "tapestry," structured lists, hedging language
   - Claude: More nuanced, uses "I think," balanced viewpoints, natural disclaimers
   - Gemini: Concise, factual, sometimes bullet-heavy
   - Gamma.app: Template-based layouts, stock photo descriptions, consistent formatting
   - Beautiful.ai: Design-focused, minimal text, visual flow emphasis
   - Tome: Storytelling format, narrative arc, visual metaphors
   - Canva AI: Template text patterns, marketing-style language
   - Microsoft Copilot: Integration with MS Office patterns, formal business language

5. **Phrase Detection:**
   - Identify specific AI-typical phrases found in the text
   - Quote exact phrases that indicate AI generation

You MUST respond with a JSON object in this EXACT format:
{
  "aiProbability": <number 0-100>,
  "humanProbability": <number 0-100>,
  "detectedAITool": "<specific tool name or 'Unknown' or 'None'>",
  "aiToolConfidence": <number 0-100>,
  "summary": "<2-3 sentences explaining the conclusion based on specific evidence found>",
  "keyFindings": [
    "<key finding 1 - most important discovery>",
    "<key finding 2>",
    "<key finding 3>",
    "<key finding 4>",
    "<key finding 5>"
  ],
  "detectedPhrases": [
    {"phrase": "<exact phrase from text>", "type": "ai" | "human", "reason": "<why this indicates AI or human>"},
    {"phrase": "<exact phrase from text>", "type": "ai" | "human", "reason": "<why this indicates AI or human>"}
  ],
  "patternAnalysis": {
    "repetitiveStructures": "<description of any repetitive patterns found>",
    "transitionUsage": "<how transitions are used - AI typically overuses certain ones>",
    "sentenceVariety": "<low/medium/high - AI tends to have low variety>",
    "formality": "<formal/informal/mixed - AI tends to be consistently formal>",
    "personalTouches": "<present/absent - human content usually has personal elements>"
  },
  "metadataNotes": [
    "<observation about metadata or document properties>",
    "<observation about creation patterns>"
  ],
  "indicators": {
    "aiIndicators": ["<specific quotes or patterns found that suggest AI>"],
    "humanIndicators": ["<specific evidence suggesting human authorship>"]
  },
  "detailedScores": {
    "writingStyle": <0-100, higher = more AI-like>,
    "contentDepth": <0-100, higher = more superficial/AI-like>,
    "structuralPatterns": <0-100, higher = more templated/AI-like>,
    "vocabularyAnalysis": <0-100, higher = more formulaic/AI-like>,
    "originalityScore": <0-100, higher = more original/human-like>,
    "naturalLanguage": <0-100, higher = more natural/human-like>,
    "consistencyScore": <0-100, higher = more consistent/AI-like>
  }
}

The aiProbability and humanProbability MUST add up to 100. Be extremely specific - quote actual phrases from the content. Provide accurate scores based on your analysis.`;

    // Use Pro model for more accurate analysis when requested, Flash for faster results
    const selectedModel = useProModel ? "google/gemini-2.5-pro" : "google/gemini-2.5-flash";
    const maxContentLength = useProModel ? 50000 : 30000;
    
    console.log(`Using model: ${selectedModel}`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Analyze this ${fileType} document named "${fileName}" for AI-generated content detection. Here is the full extracted content:\n\n${textContent.substring(0, maxContentLength)}` }
        ],
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits depleted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "AI analysis failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    console.log("AI Response:", content);

    // Parse the JSON response from AI
    let analysisResult;
    try {
      // Extract JSON from the response (handle markdown code blocks)
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
      analysisResult = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      // Fallback response
      analysisResult = {
        aiProbability: 50,
        humanProbability: 50,
        summary: "Analysis completed but results were inconclusive. The content shows mixed characteristics.",
        indicators: {
          aiIndicators: ["Unable to determine specific indicators"],
          humanIndicators: ["Unable to determine specific indicators"]
        }
      };
    }

    return new Response(
      JSON.stringify(analysisResult),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Analysis error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
