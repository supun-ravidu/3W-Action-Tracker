# Quick Test Guide - Firebase Team Members Integration

## Test the New Feature

### 1. Add Team Members to Firebase

**Quick Method (Recommended for Testing):**

```bash
# Run the script to add sample team members
npx tsx src/scripts/addTeamMembers.ts
```

**Alternative - Firebase Console:**
1. Go to Firebase Console → Firestore Database
2. Create collection: `teamMembers`
3. Add a test document:
   ```json
   {
     "name": "Test User",
     "email": "test@example.com",
     "role": "Developer",
     "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Test"
   }
   ```

### 2. Update Firestore Rules

1. Go to Firebase Console → Firestore Database → Rules
2. Replace with the content from `firestore.rules` file
3. Or use this temporary rule for testing:
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```
   ⚠️ **Warning**: The above rule allows public access. Only use for testing!

### 3. Test the Form

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to: `http://localhost:3000/actions/new`

3. Test WHO Section:

   **Primary Assignee:**
   - ✅ Type a custom name (e.g., "Alice Cooper")
   - ✅ OR select from dropdown if team members are loaded
   
   **Supporting Members:**
   - ✅ Type a name and click + to add
   - ✅ Click on team member cards to select from Firebase
   - ✅ Remove by clicking X on badges
   
   **Stakeholders:**
   - ✅ Same functionality as Supporting Members

### 4. Verify Behavior

**Expected Results:**

- [ ] Page loads without errors
- [ ] "Loading team members..." appears briefly
- [ ] If team members exist in Firebase:
  - [ ] Dropdown shows team members for Primary Assignee
  - [ ] Team member cards appear for Supporting Members
  - [ ] Team member cards appear for Stakeholders
- [ ] If no team members:
  - [ ] Shows message: "No team members found..."
  - [ ] Can still type custom names
- [ ] Can mix typed names and Firebase selections
- [ ] Form submits successfully to Firebase

### 5. Check Firebase

After submitting a test action plan:

1. Go to Firebase Console → Firestore Database
2. Check `actionPlans` collection
3. Open the created document
4. Verify `who` field contains:
   ```json
   {
     "primaryAssignee": {
       "id": "...",
       "name": "...",
       "email": "..."
     },
     "supportingMembers": [...],
     "stakeholders": [...]
   }
   ```

### 6. Test Edit Mode

1. Go to `/actions` page
2. Click edit on an action plan
3. Verify:
   - [ ] Existing team members are pre-filled
   - [ ] Can modify team member selections
   - [ ] Changes save correctly

## Troubleshooting

### Console Errors?
- Check `.env.local` has correct Firebase credentials
- Verify Firestore rules allow read/write access
- Check browser console for specific error messages

### Team Members Not Loading?
```bash
# Verify Firebase connection
# Open browser console and check for errors
# Ensure teamMembers collection exists in Firebase
```

### Script Won't Run?
```bash
# Install tsx if needed
npm install -D tsx

# Or use ts-node
npm install -D ts-node

# Then run script again
npx tsx src/scripts/addTeamMembers.ts
```

## Success Checklist

- [x] Mock data removed from imports
- [x] Team members loaded from Firebase
- [x] Can type custom names
- [x] Can select from Firebase team members
- [x] Loading state shows properly
- [x] Form submits to Firebase successfully
- [x] No console errors
- [x] Edit mode works correctly

## Next Steps

After testing:
1. ✅ Update Firestore rules for production security
2. ✅ Add your real team members to Firebase
3. ✅ Remove or update the test script
4. ✅ Consider adding a Team Management page
