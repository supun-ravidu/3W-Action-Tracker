# Firebase Integration Guide

## Overview
This application is now integrated with Firebase Firestore for persistent storage of action plans.

## Features

### 1. **Firebase Services**
- **Firestore Database**: Stores action plans
- **Authentication**: Ready for user authentication (configured)
- **Analytics**: Tracks user interactions (configured)

### 2. **WHO Section - Custom Names**
You can now type custom names directly in the WHO section instead of only selecting from a predefined list:

- **Primary Assignee**: Type a name or select from team members
- **Supporting Members**: Add custom names or select from team members
- **Stakeholders**: Add custom names or select from team members

### 3. **Data Persistence**
Action plans are automatically saved to both:
- Local Zustand store (for immediate UI updates)
- Firebase Firestore (for persistent storage)

## How to Use

### Creating a New Action Plan

1. Navigate to http://localhost:3000/actions/new
2. Fill in the form:
   - **Basic Information**: Title, Priority, Status
   - **WHAT Section**: Description, Success Criteria, Required Resources
   - **WHO Section**: 
     - Type the primary assignee name directly
     - Or select from the dropdown
     - Add supporting members and stakeholders by typing names
   - **WHEN Section**: Due Date, Time Estimate, Reminders
   - **Tags & Dependencies**: Add tags and link to other action plans

3. Click "Create Action Plan" to save to Firestore

### Editing an Existing Action Plan

1. Navigate to any action plan detail page
2. Click "Edit" button
3. Make changes to the form
4. Click "Update Action Plan" to save changes

## Firebase Configuration

The Firebase configuration is located in `src/lib/firebase.ts`:

```typescript
{
  apiKey: "AIzaSyAqVv_lZ8r1hgPCn2q6_ywBFtgKwQdVMGM",
  authDomain: "action-plan-3w-tracker.firebaseapp.com",
  projectId: "action-plan-3w-tracker",
  storageBucket: "action-plan-3w-tracker.firebasestorage.app",
  messagingSenderId: "402559410786",
  appId: "1:402559410786:web:1bbff32a262f40445fe73b",
  measurementId: "G-EX8CE6VRBH"
}
```

## Firestore Utilities

Available helper functions in `src/lib/firestoreUtils.ts`:

- `addActionPlanToFirestore(actionPlan)` - Add new action plan
- `updateActionPlanInFirestore(id, updates)` - Update existing action plan
- `deleteActionPlanFromFirestore(id)` - Delete action plan
- `getActionPlanFromFirestore(id)` - Get single action plan
- `getAllActionPlansFromFirestore()` - Get all action plans
- `getActionPlansByStatus(status)` - Query by status
- `getActionPlansByAssignee(assigneeId)` - Query by assignee

## Custom Member Format

When you type a custom name, it automatically creates a member object:

```typescript
{
  id: "custom-{timestamp}-{random}",
  name: "Your Typed Name",
  email: "your.typed.name@example.com",
  avatar: ""
}
```

## Error Handling

The application includes comprehensive error handling:
- Failed saves show an alert with retry option
- Form validation ensures required fields are filled
- Firestore errors are logged to console for debugging

## Next Steps

### Optional Enhancements:
1. **Authentication**: Implement user login to track who creates/edits action plans
2. **Real-time Updates**: Add Firestore listeners to sync data across users
3. **File Uploads**: Store attachments in Firebase Storage
4. **Email Notifications**: Use Firebase Cloud Functions for notifications
5. **Offline Support**: Enable Firestore offline persistence

## Troubleshooting

### Issue: "Failed to save action plan"
- Check Firebase console for any security rules
- Verify internet connection
- Check browser console for detailed error messages

### Issue: Custom names not showing
- Refresh the page
- Check if the name was actually added to the form state
- Verify the customMembers state in React DevTools

## Security Rules (Firestore)

For production, add proper security rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /actionPlans/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

Currently set to test mode (allow all reads/writes) for development.
