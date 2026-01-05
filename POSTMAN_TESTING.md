# Postman Testing Guide for GitHub Summarizer API

## Prerequisites

1. **Postman installed** - Download from [postman.com](https://www.postman.com/downloads/)
2. **API Key** - Get a valid API key from your `/Dashbords` page
3. **OpenAI API Key** - Should be configured in `.env.local` (optional, for summarization)

## API Endpoints

### 1. Check OpenAI Configuration
**GET** `http://localhost:3000/api/github-summarizer`

### 2. Summarize GitHub Repository
**POST** `http://localhost:3000/api/github-summarizer`

---

## Setup Instructions

### Step 1: Create a New Request

1. Open Postman
2. Click **"New"** → **"HTTP Request"**
3. Name it: `GitHub Summarizer - Check Config`

### Step 2: Configure GET Request (Check Configuration)

1. **Method**: Select `GET`
2. **URL**: `http://localhost:3000/api/github-summarizer`
3. Click **"Send"**

**Expected Response:**
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

---

## Step 3: Configure POST Request (Summarize Repository)

### Create New Request

1. Click **"New"** → **"HTTP Request"**
2. Name it: `GitHub Summarizer - Summarize Repo`

### Configure the Request

1. **Method**: Select `POST`
2. **URL**: `http://localhost:3000/api/github-summarizer`

### Set Headers

1. Go to **"Headers"** tab
2. Add header:
   - **Key**: `Content-Type`
   - **Value**: `application/json`

### Set Request Body

1. Go to **"Body"** tab
2. Select **"raw"**
3. Select **"JSON"** from the dropdown
4. Paste this JSON:

```json
{
  "key": "your-api-key-here",
  "githubUrl": "https://github.com/vercel/next.js"
}
```

**Replace:**
- `your-api-key-here` with your actual API key from `/Dashbords`
- `https://github.com/vercel/next.js` with any GitHub repository URL

### Send Request

Click **"Send"** button

---

## Expected Responses

### Success Response (200 OK)

```json
{
  "valid": true,
  "message": "GitHub repository summarized successfully",
  "data": {
    "id": "api-key-id",
    "name": "API Key Name",
    "status": "active",
    "githubUrl": "https://github.com/vercel/next.js",
    "readme": "# Next.js\n\n...",
    "summary": "Next.js is a React framework for production...",
    "cool_facts": [
      "Built by Vercel",
      "Uses React Server Components",
      "Supports TypeScript out of the box"
    ]
  }
}
```

### Error: Invalid API Key (200 OK)

```json
{
  "valid": false,
  "message": "Invalid API key. Please check your key and try again."
}
```

### Error: Missing API Key (400 Bad Request)

```json
{
  "valid": false,
  "message": "API key is required"
}
```

### Error: Missing GitHub URL (400 Bad Request)

```json
{
  "valid": false,
  "message": "GitHub repository URL is required"
}
```

### Error: README Not Found (404 Not Found)

```json
{
  "valid": false,
  "message": "Failed to fetch README.md from the GitHub repository"
}
```

### Error: OpenAI Not Configured (200 OK with Warning)

```json
{
  "valid": true,
  "message": "GitHub repository fetched, but summarization failed",
  "warning": "OpenAI API key not configured. Set OPENAI_API_KEY in environment variables to enable AI summarization.",
  "data": {
    "id": "api-key-id",
    "name": "API Key Name",
    "status": "active",
    "githubUrl": "https://github.com/vercel/next.js",
    "readme": "# Next.js\n\n...",
    "summary": null,
    "cool_facts": [],
    "error": "OpenAI API key not configured..."
  }
}
```

---

## Test Cases

### Test Case 1: Valid Request with Popular Repository

**Request:**
```json
{
  "key": "your-valid-api-key",
  "githubUrl": "https://github.com/facebook/react"
}
```

**Expected**: Success with summary and cool_facts

---

### Test Case 2: Invalid API Key

**Request:**
```json
{
  "key": "invalid-key-12345",
  "githubUrl": "https://github.com/vercel/next.js"
}
```

**Expected**: `"valid": false` with error message

---

### Test Case 3: Missing API Key

**Request:**
```json
{
  "githubUrl": "https://github.com/vercel/next.js"
}
```

**Expected**: 400 Bad Request - "API key is required"

---

### Test Case 4: Missing GitHub URL

**Request:**
```json
{
  "key": "your-valid-api-key"
}
```

**Expected**: 400 Bad Request - "GitHub repository URL is required"

---

### Test Case 5: Invalid GitHub URL Format

**Request:**
```json
{
  "key": "your-valid-api-key",
  "githubUrl": "not-a-valid-url"
}
```

**Expected**: 404 Not Found - "Failed to fetch README.md"

---

### Test Case 6: Repository Without README

**Request:**
```json
{
  "key": "your-valid-api-key",
  "githubUrl": "https://github.com/some-user/repo-without-readme"
}
```

**Expected**: 404 Not Found - "Failed to fetch README.md"

---

## Postman Collection Setup

### Create a Collection

1. Click **"New"** → **"Collection"**
2. Name it: `GitHub Summarizer API`
3. Add both requests to this collection

### Add Environment Variables

1. Click **"Environments"** → **"Create Environment"**
2. Name it: `Local Development`
3. Add variables:

| Variable | Initial Value | Current Value |
|----------|---------------|---------------|
| `base_url` | `http://localhost:3000` | `http://localhost:3000` |
| `api_key` | `your-api-key-here` | `your-api-key-here` |

4. Update your requests to use variables:
   - URL: `{{base_url}}/api/github-summarizer`
   - Body: `{ "key": "{{api_key}}", "githubUrl": "..." }`

---

## Quick Test Scripts

### Pre-request Script (Optional)

Add this to automatically set timestamp:

```javascript
pm.environment.set("timestamp", new Date().toISOString());
```

### Test Script (Optional)

Add this to validate response:

```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has valid field", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('valid');
});

pm.test("Valid API key returns data", function () {
    var jsonData = pm.response.json();
    if (jsonData.valid === true) {
        pm.expect(jsonData).to.have.property('data');
        pm.expect(jsonData.data).to.have.property('readme');
    }
});
```

---

## Troubleshooting

### Error: "Could not get any response"

**Solution:**
- Make sure your Next.js dev server is running (`yarn dev`)
- Check the URL is correct: `http://localhost:3000`
- Verify the port (default is 3000)

### Error: "Network Error"

**Solution:**
- Check your internet connection
- Verify the dev server is running
- Check firewall settings

### Error: "Invalid JSON"

**Solution:**
- Make sure `Content-Type: application/json` header is set
- Verify the JSON body is valid (no trailing commas, proper quotes)
- Use Postman's JSON validator

### Response is Empty or Malformed

**Solution:**
- Check server console for errors
- Verify API key is valid in Supabase
- Check OpenAI API key is configured (for summarization)
- Review server logs for detailed error messages

---

## Production Testing

For production/Vercel deployment:

1. Change `base_url` to your Vercel URL:
   ```
   https://your-app.vercel.app
   ```

2. Update the environment variable in Postman

3. Test the same endpoints with the production URL

---

## Tips

1. **Save Requests**: Save your requests in a collection for easy reuse
2. **Use Variables**: Use environment variables for API keys and URLs
3. **Test Scripts**: Add test scripts to automatically validate responses
4. **Examples**: Create example requests for different scenarios
5. **Documentation**: Add descriptions to your requests explaining what they do

---

## Example Repository URLs to Test

- `https://github.com/vercel/next.js` - Popular framework
- `https://github.com/facebook/react` - React library
- `https://github.com/microsoft/vscode` - VS Code editor
- `https://github.com/nodejs/node` - Node.js runtime
- `https://github.com/torvalds/linux` - Linux kernel

---

## Next Steps

1. Create the Postman collection
2. Test all scenarios
3. Save successful requests as examples
4. Share the collection with your team
5. Set up automated tests using Postman's test runner
