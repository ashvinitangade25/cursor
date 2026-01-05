# cURL Examples for GitHub Summarizer API

## Endpoint

`POST /api/github-summarizer`

## Request Body

```json
{
  "key": "your-api-key-here",
  "githubUrl": "https://github.com/owner/repo"
}
```

## cURL Commands

### Check OpenAI API Key Configuration

```bash
curl http://localhost:3000/api/github-summarizer
```

**Expected Response (Configured):**

```json
{
  "configured": true,
  "message": "OpenAI API key is configured",
  "instructions": {
    "local": "Add OPENAI_API_KEY to your .env.local file",
    "production": "Add OPENAI_API_KEY to Vercel environment variables",
    "example": "OPENAI_API_KEY=sk-..."
  }
}
```

**Expected Response (Not Configured):**

```json
{
  "configured": false,
  "message": "OpenAI API key is not configured. Set OPENAI_API_KEY in environment variables.",
  "instructions": {
    "local": "Add OPENAI_API_KEY to your .env.local file",
    "production": "Add OPENAI_API_KEY to Vercel environment variables",
    "example": "OPENAI_API_KEY=sk-..."
  }
}
```

### Basic Request (Local Development)

```bash
curl -X POST http://localhost:3000/api/github-summarizer \
  -H "Content-Type: application/json" \
  -d '{
    "key": "your-api-key-here",
    "githubUrl": "https://github.com/vercel/next.js"
  }'
```

### Pretty Print Response (with jq)

```bash
curl -X POST http://localhost:3000/api/github-summarizer \
  -H "Content-Type: application/json" \
  -d '{
    "key": "your-api-key-here",
    "githubUrl": "https://github.com/vercel/next.js"
  }' | jq '.'
```

### Production/Vercel Deployment

```bash
curl -X POST https://your-app.vercel.app/api/github-summarizer \
  -H "Content-Type: application/json" \
  -d '{
    "key": "your-api-key-here",
    "githubUrl": "https://github.com/vercel/next.js"
  }'
```

### Windows PowerShell

```powershell
$body = @{
    key = "your-api-key-here"
    githubUrl = "https://github.com/vercel/next.js"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/github-summarizer" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```

## Expected Response

### Success Response

```json
{
  "valid": true,
  "message": "GitHub repository summarized successfully",
  "data": {
    "id": "api-key-id",
    "name": "API Key Name",
    "status": "active",
    "githubUrl": "https://github.com/vercel/next.js",
    "readme": "# README content here...",
    "summary": "A comprehensive summary of the repository...",
    "cool_facts": [
      "Fact 1 about the repository",
      "Fact 2 about the repository",
      "Fact 3 about the repository"
    ]
  }
}
```

### Error Responses

#### Invalid API Key

```json
{
  "valid": false,
  "message": "Invalid API key. Please check your key and try again."
}
```

#### Missing GitHub URL

```json
{
  "valid": false,
  "message": "GitHub repository URL is required"
}
```

#### README Not Found

```json
{
  "valid": false,
  "message": "Failed to fetch README.md from the GitHub repository"
}
```

## Testing Examples

### Example 1: Popular Repository

```bash
curl -X POST http://localhost:3000/api/github-summarizer \
  -H "Content-Type: application/json" \
  -d '{
    "key": "your-api-key-here",
    "githubUrl": "https://github.com/facebook/react"
  }'
```

### Example 2: Small Repository

```bash
curl -X POST http://localhost:3000/api/github-summarizer \
  -H "Content-Type: application/json" \
  -d '{
    "key": "your-api-key-here",
    "githubUrl": "https://github.com/microsoft/vscode"
  }'
```

## Notes

1. **API Key**: Replace `"your-api-key-here"` with an actual API key from your Supabase `api_keys` table
2. **OpenAI API Key**: Make sure `OPENAI_API_KEY` is set in your environment variables for LangChain summarization to work
3. **GitHub URL**: The URL should be in the format `https://github.com/owner/repo`
4. **README**: The API will try to fetch README.md from the `main` branch first, then `master` branch

## Troubleshooting

### Error: "API key is required"

- Make sure you're sending the `key` field in the request body
- Check that the key is a non-empty string

### Error: "Invalid API key"

- Verify the API key exists in your Supabase `api_keys` table
- Check that the key status is `"active"`

### Error: "Failed to fetch README.md"

- Verify the GitHub repository exists and is public
- Check that the repository has a README.md file
- Try a different repository URL

### Error: "OpenAI API key not configured"

- Add `OPENAI_API_KEY` to your `.env.local` file for local development
- For production, add it to your Vercel environment variables
