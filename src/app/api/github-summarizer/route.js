import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";
import https from "https";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";

// Disable SSL certificate verification
// WARNING: This should only be used in development, never in production!
if (typeof process !== "undefined") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

  // Configure HTTPS agent to reject unauthorized certificates
  const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
  });

  // Set as default agent
  https.globalAgent = httpsAgent;
}

/**
 * GET /api/github-summarizer
 * Checks if OpenAI API key is configured
 *
 * Response: { configured: boolean, message: string }
 */
export async function GET() {
  const isConfigured = isOpenAIConfigured();

  return NextResponse.json({
    configured: isConfigured,
    message: isConfigured
      ? "OpenAI API key is configured"
      : "OpenAI API key is not configured. Set OPENAI_API_KEY in environment variables.",
    instructions: {
      local: "Add OPENAI_API_KEY to your .env.local file",
      production: "Add OPENAI_API_KEY to Vercel environment variables",
      example: "OPENAI_API_KEY=sk-...",
    },
  });
}

/**
 * POST /api/github-summarizer
 * Validates an API key and processes GitHub summarizer requests
 *
 * Request body: { key: string, ...otherParams }
 * Response: { valid: boolean, message: string, data?: object }
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { key } = body;

    // Validate API key input
    if (!key || typeof key !== "string" || key.trim() === "") {
      return NextResponse.json(
        {
          valid: false,
          message: "API key is required",
        },
        { status: 400 }
      );
    }

    // Query Supabase to check if the API key exists and is active
    const { data, error } = await supabase
      .from("api_keys")
      .select("id, name, status, key, usage")
      .eq("key", key.trim())
      .eq("status", "active")
      .maybeSingle();

    // Handle Supabase errors
    if (error && error.code !== "PGRST116") {
      // PGRST116 is "no rows returned" - which is expected for invalid keys
      console.error("Error validating API key:", error);
      return NextResponse.json(
        {
          valid: false,
          message: "Error validating API key. Please try again.",
        },
        { status: 500 }
      );
    }

    // Check if key is valid
    if (data && data.status === "active") {
      // Valid API key - increment usage counter
      await supabase
        .from("api_keys")
        .update({ usage: (data.usage || 0) + 1 })
        .eq("id", data.id);

      // API key is valid - process the GitHub summarizer request
      const { githubUrl } = body;

      // Validate GitHub URL
      if (!githubUrl || typeof githubUrl !== "string") {
        return NextResponse.json(
          {
            valid: false,
            message: "GitHub repository URL is required",
          },
          { status: 400 }
        );
      }

      // Fetch README.md from GitHub repository
      const readmeContent = await fetchGitHubReadme(githubUrl);

      if (!readmeContent) {
        return NextResponse.json(
          {
            valid: false,
            message: "Failed to fetch README.md from the GitHub repository",
            details:
              "The repository might not have a README file, or it may be in a non-standard location. Please ensure the repository is public and has a README.md file in the root directory.",
            githubUrl: githubUrl,
          },
          { status: 404 }
        );
      }

      // Generate summary using LangChain
      let summary = null;
      let coolFacts = [];
      let langchainError = null;
      let langchainSuccess = false;

      try {
        console.log("Starting LangChain summarization...");
        const summaryResult = await generateSummaryWithLangChain(readmeContent);
        console.log("LangChain summarization completed:", {
          hasSummary: !!summaryResult.summary,
          hasCoolFacts: !!summaryResult.cool_facts,
        });

        summary = summaryResult.summary || summaryResult.Summary || null;
        coolFacts = summaryResult.cool_facts || summaryResult.coolFacts || [];
        langchainSuccess = !!(summary && coolFacts.length > 0);

        if (!langchainSuccess) {
          console.warn("LangChain returned empty results:", summaryResult);
        }
      } catch (error) {
        console.error("Error generating summary with LangChain:", {
          message: error.message,
          stack: error.stack,
          name: error.name,
        });
        langchainError = {
          message: error.message || "Unknown error occurred",
          type: error.name || "Error",
        };

        // If it's a missing API key error, include it in the response
        if (error.message?.includes("OpenAI API key not configured")) {
          return NextResponse.json(
            {
              valid: true,
              message: "GitHub repository fetched, but summarization failed",
              warning:
                "OpenAI API key not configured. Set OPENAI_API_KEY in environment variables to enable AI summarization.",
              data: {
                id: data.id,
                name: data.name,
                status: data.status,
                githubUrl: githubUrl,
                readme: readmeContent,
                summary: null,
                cool_facts: [],
                langchain_error: langchainError,
              },
            },
            { status: 200 }
          );
        }
        // Continue without summary if LangChain fails for other reasons
      }

      return NextResponse.json({
        valid: true,
        message: langchainSuccess
          ? "GitHub repository summarized successfully"
          : "GitHub repository fetched, but summarization may have failed",
        data: {
          id: data.id,
          name: data.name,
          status: data.status,
          githubUrl: githubUrl,
          readme: readmeContent,
          summary: summary,
          cool_facts: coolFacts,
          langchain_success: langchainSuccess,
          ...(langchainError && { langchain_error: langchainError }),
        },
      });
    } else {
      // Invalid API key
      return NextResponse.json({
        valid: false,
        message: "Invalid API key. Please check your key and try again.",
      });
    }
  } catch (error) {
    console.error("Error in github-summarizer API:", error);

    // Handle JSON parsing errors
    if (error instanceof SyntaxError || error.message?.includes("JSON")) {
      return NextResponse.json(
        {
          valid: false,
          message: "Invalid request body",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        valid: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}

/**
 * Generates a summary and cool facts from README content using LangChain
 * @param {string} readmeContent - The README.md content
 * @returns {Promise<{summary: string, cool_facts: string[]}>} Summary and cool facts
 */
/**
 * Checks if OpenAI API key is configured
 * @returns {boolean} True if API key is configured
 */
export function isOpenAIConfigured() {
  const openAIApiKey = process.env.OPENAI_API_KEY;
  return !!openAIApiKey && openAIApiKey.trim() !== "";
}

async function generateSummaryWithLangChain(readmeContent) {
  console.log(
    "generateSummaryWithLangChain called, readme length:",
    readmeContent?.length
  );

  // Check if OpenAI API key is configured
  const openAIApiKey = process.env.OPENAI_API_KEY;

  if (!openAIApiKey || openAIApiKey.trim() === "") {
    console.error("OpenAI API key is not configured");
    throw new Error(
      "OpenAI API key not configured. Set OPENAI_API_KEY in environment variables. " +
        "For local development, add it to .env.local. " +
        "For production, add it to Vercel environment variables."
    );
  }

  console.log("OpenAI API key is configured, length:", openAIApiKey.length);

  // Define strict schema for structured output using Zod
  const summarySchema = z.object({
    Summary: z
      .string()
      .min(1, "Summary must not be empty")
      .describe("A comprehensive summary of the GitHub repository"),
    cool_facts: z
      .array(z.string().min(1, "Each fact must not be empty"))
      .min(1, "At least one cool fact is required")
      .describe("An array of interesting facts about the repository"),
  });

  console.log("Schema defined, creating prompt template...");

  // Create the prompt template
  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "You are a helpful assistant that summarizes GitHub repositories. Always respond with valid JSON matching the required schema exactly.",
    ],
    [
      "human",
      `Summarize this github repository from this readme file content: {readmeContent}

Respond as a JSON object with keys: "Summary" (string), "cool_facts" (list of strings).`,
    ],
  ]);

  console.log("Prompt template created, initializing LLM...");

  try {
    // Initialize the LLM with structured output using strict Zod schema
    const llm = new ChatOpenAI({
      model: "gpt-4o-mini",
      temperature: 0.7,
      openAIApiKey: openAIApiKey,
    });

    console.log("LLM initialized, setting up structured output...");

    // Check if withStructuredOutput method exists
    if (typeof llm.withStructuredOutput !== "function") {
      console.error("withStructuredOutput method not available on LLM");
      throw new Error(
        "Structured output not supported. Please update @langchain/openai to the latest version."
      );
    }

    const structuredLLM = llm.withStructuredOutput(summarySchema, {
      name: "github_repository_summary",
      strict: true, // Enforce strict schema adherence
    });

    console.log("Structured output configured, creating chain...");

    // Create the chain: prompt -> LLM (with structured output)
    const chain = prompt.pipe(structuredLLM);

    console.log("Chain created, invoking with readme content...");

    // Invoke the chain with the readme content
    const result = await chain.invoke({
      readmeContent: readmeContent.substring(0, 50000), // Limit readme size to avoid token limits
    });

    console.log("Chain invocation completed, result:", {
      hasSummary: !!result.Summary,
      summaryLength: result.Summary?.length,
      coolFactsCount: result.cool_facts?.length,
    });

    // Validate the result
    if (!result || !result.Summary || !result.cool_facts) {
      console.warn("Invalid result structure:", result);
      throw new Error("LangChain returned invalid result structure");
    }

    // The result is already validated by the schema (strict mode ensures this)
    // Return the structured result
    return {
      summary: result.Summary,
      cool_facts: result.cool_facts,
    };
  } catch (error) {
    console.error("Error in generateSummaryWithLangChain:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    throw error;
  }
}

/**
 * Fetches the README.md content from a public GitHub repository URL.
 * @param {string} githubUrl - GitHub repository URL (e.g., https://github.com/owner/repo)
 * @returns {Promise<string|null>} README content or null if not found
 */
async function fetchGitHubReadme(githubUrl) {
  try {
    // Clean the URL (remove trailing slashes, query params, fragments)
    const cleanUrl = githubUrl
      .trim()
      .replace(/\/$/, "")
      .split("?")[0]
      .split("#")[0];

    // Parse GitHub URL to extract owner and repo
    const urlPattern = /github\.com\/([^\/]+)\/([^\/]+)/;
    const match = cleanUrl.match(urlPattern);

    if (!match) {
      console.error("Invalid GitHub URL format:", githubUrl);
      throw new Error(
        "Invalid GitHub URL format. Expected: https://github.com/owner/repo"
      );
    }

    const [, owner, repo] = match;
    const repoName = repo.replace(/\.git$/, ""); // Remove .git suffix if present

    // Try to get default branch from GitHub API
    let defaultBranch = "main";
    try {
      const repoInfoResponse = await fetch(
        `https://api.github.com/repos/${owner}/${repoName}`,
        {
          headers: {
            Accept: "application/vnd.github.v3+json",
            "User-Agent": "GitHub-Summarizer",
          },
        }
      );

      if (repoInfoResponse.ok) {
        const repoInfo = await repoInfoResponse.json();
        defaultBranch = repoInfo.default_branch || "main";
      }
    } catch (apiError) {
      console.warn(
        "Could not fetch default branch, using fallback:",
        apiError.message
      );
      // Continue with fallback branches
    }

    // List of README file names to try (case variations)
    const readmeFiles = [
      "README.md",
      "README.MD",
      "readme.md",
      "README",
      "readme",
    ];

    // List of branches to try (default branch first, then common ones)
    const branches = [defaultBranch, "main", "master", "develop", "dev"].filter(
      (branch, index, self) => self.indexOf(branch) === index
    ); // Remove duplicates

    // Try each branch and README file combination
    for (const branch of branches) {
      for (const readmeFile of readmeFiles) {
        const readmeUrl = `https://raw.githubusercontent.com/${owner}/${repoName}/${branch}/${readmeFile}`;

        try {
          const response = await fetch(readmeUrl, {
            headers: {
              Accept: "text/plain, text/markdown, */*",
              "User-Agent": "GitHub-Summarizer",
            },
          });

          if (response.ok) {
            const content = await response.text();
            if (content && content.trim().length > 0) {
              console.log(`Successfully fetched README from: ${readmeUrl}`);
              return content;
            }
          }
        } catch (fetchError) {
          // Continue to next combination
          continue;
        }
      }
    }

    // If we get here, no README was found
    console.error(
      `README not found for repository: ${owner}/${repoName}. Tried branches: ${branches.join(
        ", "
      )}, files: ${readmeFiles.join(", ")}`
    );
    return null;
  } catch (error) {
    console.error("Error fetching GitHub README:", error.message || error);
    return null;
  }
}
