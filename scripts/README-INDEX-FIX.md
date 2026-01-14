# Conversation Index Fix

## Problem
The MongoDB collection `conversations` had a unique index on the `participants` field that was causing duplicate key errors when creating new conversations. The error was:

```
E11000 duplicate key error collection: devlopement.conversations index: participants_1
```

## Root Cause
The unique index on an array field (`participants`) doesn't work as expected for ensuring unique pairs of users. MongoDB was treating single participant IDs as duplicates.

## Solution
1. **Dropped the problematic index** using `scripts/fix-conversation-index.js`
2. **Updated the Conversation model** to remove the unique index declaration
3. **Added participant sorting** in the pre-save hook to ensure consistent ordering
4. **Updated chatController** to sort participants when creating new conversations

## How to Run the Fix
If you encounter this issue again:

```bash
node scripts/fix-conversation-index.js
```

## Changes Made
- `src/models/Conversation.js`: Removed unique index, added sorting in pre-save hook
- `src/controllers/chatController.js`: Added participant sorting in `sendMessage` and `sendMediaMessage`
- `scripts/fix-conversation-index.js`: Script to drop the problematic index

## Testing
After applying the fix, test by:
1. Sending a message to a new user (creates conversation)
2. Sending another message to the same user (reuses conversation)
3. Verify no duplicate key errors occur
