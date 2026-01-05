# LangChain Debugging Guide

## Issue: Not Receiving LangChain Results

If you're not receiving LangChain summarization results, follow these debugging steps:

## Step 1: Check Server Console Logs

When you call the API, check your terminal/console where `yarn dev` is running. You should see logs like:

```
Starting LangChain summarization...
generateSummaryWithLangChain called, readme length: 1234
OpenAI API key is configured, length: 51
Schema defined, creating prompt template...
Prompt template created, initializing LLM...
LLM initialized, setting up structured output...
Structured output configured, creating chain...
Chain created, invoking with readme content...
Chain invocation completed, result: { hasSummary: true, summaryLength: 234, coolFactsCount: 3 }
LangChain summarization completed: { hasSummary: true, hasCoolFacts: true }
```

## Step 2: Verify OpenAI API Key

### Check if API key is set:

```bash
# In your terminal
node -e "console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'SET (' + process.env.OPENAI_API_KEY.length + ' chars)' : 'NOT SET')"
```

### Or use the GET endpoint:

```bash
curl http://localhost:3000/api/github-summarizer
```

**Expected Response:**
```json
{
  "configured": true,
  "message": "OpenAI API key is configured"
}
```

### If not configured:

1. Open `.env.local` in your project root
2. Add: `OPENAI_API_KEY=sk-your-actual-key-here`
3. Restart your dev server: `yarn dev`

## Step 3: Test the API with Detailed Logging

Make a POST request and check:

1. **Server console** - Look for error messages
2. **Response body** - Check for `langchain_error` field
3. **Response status** - Should be 200 even if LangChain fails

### Example Request:

```bash
curl -X POST http://localhost:3000/api/github-summarizer \
  -H "Content-Type: application/json" \
  -d '{
    "key": "your-api-key",
    "githubUrl": "https://github.com/vercel/next.js"
  }'
```

## Step 4: Check Response Structure

### Success Response (with LangChain):

```json
{
  "valid": true,
  "message": "GitHub repository summarized successfully",
  "data": {
    "summary": "A comprehensive summary...",
    "cool_facts": ["Fact 1", "Fact 2", "Fact 3"],
    "langchain_success": true
  }
}
```

### Partial Success (LangChain failed):

```json
{
  "valid": true,
  "message": "GitHub repository fetched, but summarization may have failed",
  "data": {
    "summary": null,
    "cool_facts": [],
    "langchain_success": false,
    "langchain_error": {
      "message": "Error message here",
      "type": "Error"
    }
  }
}
```

## Common Issues and Solutions

### Issue 1: "OpenAI API key not configured"

**Solution:**
- Add `OPENAI_API_KEY` to `.env.local`
- Restart dev server
- Verify with GET endpoint

### Issue 2: "withStructuredOutput method not available"

**Solution:**
```bash
yarn add @langchain/openai@latest
```

### Issue 3: Empty summary or cool_facts

**Possible causes:**
- README content is too short or empty
- OpenAI API rate limit reached
- Invalid API key
- Network issues

**Check:**
- Look at server console for detailed error
- Verify API key is valid at https://platform.openai.com/api-keys
- Check OpenAI account has credits

### Issue 4: Timeout or No Response

**Possible causes:**
- README is too large (currently limited to 50,000 characters)
- Network timeout
- OpenAI API is slow

**Solution:**
- Check server console for timeout errors
- Try with a smaller repository
- Check OpenAI API status

### Issue 5: Schema Validation Error

**Error message:**
```
"Summary must not be empty" or "At least one cool fact is required"
```

**Solution:**
- This means LangChain returned invalid data
- Check server console for the actual response
- The schema is strict and requires both Summary and cool_facts

## Debugging Checklist

- [ ] OpenAI API key is set in `.env.local`
- [ ] Dev server restarted after adding API key
- [ ] GET endpoint shows `"configured": true`
- [ ] Server console shows "Starting LangChain summarization..."
- [ ] Server console shows "Chain invocation completed"
- [ ] Response includes `langchain_success` field
- [ ] No errors in server console
- [ ] API key is valid (check at OpenAI dashboard)
- [ ] OpenAI account has credits/usage available

## Testing with Console Logs

The updated code now includes detailed logging at each step:

1. **Function entry**: `generateSummaryWithLangChain called`
2. **API key check**: `OpenAI API key is configured`
3. **Schema creation**: `Schema defined`
4. **Prompt creation**: `Prompt template created`
5. **LLM initialization**: `LLM initialized`
6. **Structured output**: `Structured output configured`
7. **Chain creation**: `Chain created`
8. **Invocation**: `Chain invocation completed`
9. **Result validation**: Shows summary length and facts count

## Manual Testing

### Test 1: Check Configuration

```bash
curl http://localhost:3000/api/github-summarizer
```

### Test 2: Test with Small Repository

```bash
curl -X POST http://localhost:3000/api/github-summarizer \
  -H "Content-Type: application/json" \
  -d '{
    "key": "your-valid-api-key",
    "githubUrl": "https://github.com/octocat/Hello-World"
  }'
```

### Test 3: Check Response

Look for:
- `langchain_success: true/false`
- `summary: "..."` (should not be null)
- `cool_facts: [...]` (should have at least 1 item)
- `langchain_error: {...}` (only if there was an error)

## Getting Help

If issues persist, check:

1. **Server Console**: Full error stack traces
2. **Response Body**: `langchain_error` field for details
3. **OpenAI Dashboard**: API key status and usage
4. **Network Tab**: Check if requests are being made

## Next Steps

1. Make a test API call
2. Check server console for logs
3. Review the response structure
4. Share the error message if still not working
