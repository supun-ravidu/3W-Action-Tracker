# Team Members Firebase Integration

## Overview
The WHO section in the action plan form now connects to Firebase to fetch team members. Users can either:
1. Type a custom name for team members
2. Select existing team members from the Firebase database

## Setup Instructions

### 1. Add Team Members to Firebase

You have two options to add team members to your Firebase:

#### Option A: Using the Script (Recommended)
Run the provided script to add sample team members:

```bash
npx tsx src/scripts/addTeamMembers.ts
```

or if you have ts-node installed:

```bash
npx ts-node src/scripts/addTeamMembers.ts
```

#### Option B: Manually via Firebase Console
1. Go to your Firebase Console
2. Navigate to Firestore Database
3. Create a collection named `teamMembers`
4. Add documents with the following structure:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  "role": "Senior Developer",
  "skills": ["Frontend", "React", "TypeScript"],
  "workload": 0,
  "availability": {
    "status": "available",
    "timeOff": []
  }
}
```

### 2. Customize Team Members

Edit `src/scripts/addTeamMembers.ts` to add your own team members before running the script:

```typescript
const teamMembersToAdd = [
  {
    name: 'Your Name',
    email: 'your.email@company.com',
    role: 'Your Role',
    skills: ['Skill1', 'Skill2'],
    // ... other fields
  },
  // Add more team members
];
```

## Features

### WHO Section Capabilities

1. **Type Custom Names**: Simply type any name in the input field for Primary Assignee, Supporting Members, or Stakeholders

2. **Select from Firebase**: If team members exist in Firebase, you can select them from:
   - Dropdown for Primary Assignee
   - Clickable cards for Supporting Members and Stakeholders

3. **Mix and Match**: You can combine typed names with Firebase team members in Supporting Members and Stakeholders

4. **Auto-generated Email**: When typing custom names, emails are automatically generated (e.g., "John Doe" → "john.doe@example.com")

## Firebase Structure

### Collections

#### `teamMembers`
Stores all team member information:
- `name` (string, required)
- `email` (string, required)
- `avatar` (string, optional)
- `role` (string, optional)
- `skills` (array of strings, optional)
- `workload` (number, optional)
- `availability` (object, optional)

#### `actionPlans`
Each action plan stores team member references in the `who` field:
```typescript
{
  who: {
    primaryAssignee: TeamMember,
    supportingMembers: TeamMember[],
    stakeholders: TeamMember[]
  }
}
```

## API Functions

New utility functions in `src/lib/firestoreUtils.ts`:

- `getAllTeamMembersFromFirestore()` - Fetch all team members
- `addTeamMemberToFirestore(member)` - Add a new team member
- `updateTeamMemberInFirestore(id, updates)` - Update team member info
- `deleteTeamMemberFromFirestore(id)` - Delete a team member

## Usage Example

When creating a new action plan at `/actions/new`:

1. The form loads team members from Firebase automatically
2. Type a name in "Primary Assignee" or select from the dropdown
3. Add supporting members by typing names or clicking team member cards
4. Add stakeholders using the same method
5. Submit the form - all data is saved to Firebase

## Removed Mock Data

The following mock data has been removed:
- ✅ `teamMembers` import from `@/store/mockData`
- ✅ Hard-coded team member arrays
- ✅ Static team member selection

All team data now comes from Firebase in real-time!

## Troubleshooting

### Team members not showing up?
1. Check Firebase Console to ensure `teamMembers` collection exists
2. Verify Firebase configuration in `.env.local`
3. Check browser console for any errors

### Can't add team members via script?
1. Ensure Firebase credentials are properly configured
2. Make sure you have write permissions in Firestore Rules
3. Install required dependencies: `npm install`

### Form still showing "Loading team members..."?
1. Check your internet connection
2. Verify Firebase is properly initialized
3. Check browser console for errors

## Next Steps

Consider adding:
- Team member management page (`/team`)
- Bulk import from CSV
- Team member profiles with stats
- Role-based access control
