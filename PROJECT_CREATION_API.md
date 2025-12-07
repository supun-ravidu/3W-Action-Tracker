# 🔌 Project Creation API & Extension Guide

## Firebase API Reference

### Create a New Project

```typescript
import { addProjectToFirestore } from '@/lib/firestoreUtils';

// Example: Create a marketing project
const createMarketingProject = async () => {
  const project = {
    name: 'Q1 2025 Marketing Campaign',
    description: 'Launch comprehensive digital marketing strategy',
    icon: '📱',
    color: '#3B82F6',
    workspace: 'workspace-id-123',
    startDate: new Date('2025-01-01'),
    targetEndDate: new Date('2025-03-31'),
    actionPlans: [],
    teamMembers: [],
    lead: {
      id: 'user-123',
      name: 'John Doe',
      email: 'john@example.com',
    },
    status: 'active',
    tags: ['marketing', 'digital', 'q1'],
    dependencies: [],
    budget: {
      allocated: 75000,
      spent: 0,
      currency: 'USD',
    },
  };

  const result = await addProjectToFirestore(project);
  
  if (result.success) {
    console.log('✅ Project created:', result.id);
    return result.id;
  } else {
    console.error('❌ Error:', result.error);
    return null;
  }
};
```

### Update an Existing Project

```typescript
import { updateProjectInFirestore } from '@/lib/firestoreUtils';

// Example: Update project status and progress
const updateProjectProgress = async (projectId: string) => {
  const updates = {
    progress: 75,
    status: 'active',
    budget: {
      allocated: 75000,
      spent: 45000,
      currency: 'USD',
    },
  };

  const result = await updateProjectInFirestore(projectId, updates);
  
  if (result.success) {
    console.log('✅ Project updated');
  }
};
```

### Fetch Projects

```typescript
import { 
  getAllProjectsFromFirestore,
  getProjectsByWorkspace,
  getProjectsByStatus 
} from '@/lib/firestoreUtils';

// Get all projects
const fetchAllProjects = async () => {
  const result = await getAllProjectsFromFirestore();
  return result.data; // Array of projects
};

// Get projects by workspace
const fetchWorkspaceProjects = async (workspaceId: string) => {
  const result = await getProjectsByWorkspace(workspaceId);
  return result.data;
};

// Get active projects only
const fetchActiveProjects = async () => {
  const result = await getProjectsByStatus('active');
  return result.data;
};
```

### Delete a Project

```typescript
import { deleteProjectFromFirestore } from '@/lib/firestoreUtils';

const deleteProject = async (projectId: string) => {
  const confirmed = window.confirm('Delete this project?');
  
  if (confirmed) {
    const result = await deleteProjectFromFirestore(projectId);
    
    if (result.success) {
      console.log('✅ Project deleted');
    }
  }
};
```

## Store Integration

### Using the Projects Store

```typescript
import { useProjectsStore } from '@/store/projectsStore';

function MyComponent() {
  const { 
    projects, 
    addProject, 
    updateProject, 
    deleteProject,
    getProjectStats,
    workspaces 
  } = useProjectsStore();

  // Add project to local store (after Firebase save)
  const handleCreateProject = (newProject) => {
    addProject(newProject);
  };

  // Get project statistics
  const stats = getProjectStats('project-id-123');
  console.log('Project Stats:', stats);

  return (
    <div>
      {projects.map(project => (
        <div key={project.id}>{project.name}</div>
      ))}
    </div>
  );
}
```

### Load Projects from Firebase on App Start

```typescript
// In your App component or layout
import { useEffect } from 'react';
import { useProjectsStore } from '@/store/projectsStore';
import { getAllProjectsFromFirestore } from '@/lib/firestoreUtils';

export function ProjectsLoader() {
  const { loadProjectsFromFirebase } = useProjectsStore();

  useEffect(() => {
    const loadProjects = async () => {
      const result = await getAllProjectsFromFirestore();
      if (result.success) {
        loadProjectsFromFirebase(result.data);
      }
    };

    loadProjects();
  }, []);

  return null;
}
```

## Customization Examples

### 1. Add Project Categories

```typescript
// Update CreateProjectModal.tsx
const projectCategories = [
  { value: 'development', label: 'Development', icon: '💻' },
  { value: 'marketing', label: 'Marketing', icon: '📱' },
  { value: 'design', label: 'Design', icon: '🎨' },
  { value: 'operations', label: 'Operations', icon: '⚙️' },
];

// Add to form state
const [formData, setFormData] = useState({
  // ... existing fields
  category: '',
});

// Add to Step 1
<div className="space-y-2">
  <Label>Category</Label>
  <Select 
    value={formData.category} 
    onValueChange={(value) => handleInputChange('category', value)}
  >
    <SelectTrigger>
      <SelectValue placeholder="Select category" />
    </SelectTrigger>
    <SelectContent>
      {projectCategories.map(cat => (
        <SelectItem key={cat.value} value={cat.value}>
          {cat.icon} {cat.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>
```

### 2. Add Priority Selection

```typescript
// Add priority field with visual indicators
const priorities = [
  { value: 'critical', label: 'Critical', color: '#EF4444', icon: '🔥' },
  { value: 'high', label: 'High', color: '#F59E0B', icon: '⚡' },
  { value: 'medium', label: 'Medium', color: '#3B82F6', icon: '📋' },
  { value: 'low', label: 'Low', color: '#10B981', icon: '🌱' },
];

// Add to Step 3
<div className="space-y-2">
  <Label>Priority</Label>
  <div className="grid grid-cols-2 gap-2">
    {priorities.map(priority => (
      <button
        key={priority.value}
        onClick={() => handleInputChange('priority', priority.value)}
        className={cn(
          'p-3 rounded-lg border-2 transition-all',
          formData.priority === priority.value
            ? 'border-current shadow-lg'
            : 'border-gray-200'
        )}
        style={{ borderColor: formData.priority === priority.value ? priority.color : undefined }}
      >
        <span className="text-2xl">{priority.icon}</span>
        <p className="text-sm font-medium">{priority.label}</p>
      </button>
    ))}
  </div>
</div>
```

### 3. Add Team Member Selection

```typescript
// Fetch team members and allow selection
import { getAllTeamMembersFromFirestore } from '@/lib/firestoreUtils';

const [teamMembers, setTeamMembers] = useState([]);
const [selectedMembers, setSelectedMembers] = useState([]);

useEffect(() => {
  const loadTeamMembers = async () => {
    const result = await getAllTeamMembersFromFirestore();
    if (result.success) {
      setTeamMembers(result.data);
    }
  };
  loadTeamMembers();
}, []);

// Add to Step 3
<div className="space-y-2">
  <Label>Team Members</Label>
  <div className="grid grid-cols-3 gap-2">
    {teamMembers.map(member => (
      <button
        key={member.id}
        onClick={() => toggleMember(member)}
        className={cn(
          'p-2 rounded-lg border-2 transition-all',
          selectedMembers.includes(member.id)
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-200'
        )}
      >
        <Avatar>
          <AvatarImage src={member.avatar} />
          <AvatarFallback>{member.name[0]}</AvatarFallback>
        </Avatar>
        <p className="text-xs mt-1">{member.name}</p>
      </button>
    ))}
  </div>
</div>
```

### 4. Add File Attachments

```typescript
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const [attachments, setAttachments] = useState([]);

const handleFileUpload = async (files: FileList) => {
  const storage = getStorage();
  const uploadPromises = Array.from(files).map(async (file) => {
    const storageRef = ref(storage, `projects/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return {
      name: file.name,
      url,
      type: file.type,
      size: file.size,
    };
  });

  const uploadedFiles = await Promise.all(uploadPromises);
  setAttachments([...attachments, ...uploadedFiles]);
};

// Add to Step 3
<div className="space-y-2">
  <Label>Attachments</Label>
  <input
    type="file"
    multiple
    onChange={(e) => handleFileUpload(e.target.files)}
    className="block w-full text-sm"
  />
  {attachments.map((file, i) => (
    <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
      <span className="text-sm">{file.name}</span>
      <button onClick={() => removeAttachment(i)}>❌</button>
    </div>
  ))}
</div>
```

### 5. Add Custom Validation

```typescript
// Add custom validation logic
const validateProject = () => {
  const errors = [];

  // Name validation
  if (formData.name.length < 3) {
    errors.push('Project name must be at least 3 characters');
  }

  // Budget validation
  if (formData.budget && parseFloat(formData.budget) < 0) {
    errors.push('Budget cannot be negative');
  }

  // Date validation
  if (formData.targetEndDate && formData.targetEndDate < formData.startDate) {
    errors.push('End date must be after start date');
  }

  // Workspace validation
  if (!formData.workspace) {
    errors.push('Please select a workspace');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

const handleSubmit = async () => {
  const validation = validateProject();
  
  if (!validation.isValid) {
    alert(validation.errors.join('\n'));
    return;
  }

  // Proceed with creation...
};
```

## Real-time Updates with Firestore Listeners

```typescript
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Listen to project changes in real-time
const useProjectsListener = (workspaceId: string) => {
  const { loadProjectsFromFirebase } = useProjectsStore();

  useEffect(() => {
    const q = query(
      collection(db, 'projects'),
      where('workspace', '==', workspaceId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projects = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Project[];

      loadProjectsFromFirebase(projects);
    });

    return () => unsubscribe();
  }, [workspaceId]);
};
```

## Advanced Features

### 1. Project Templates

```typescript
// Save current project as template
const saveAsTemplate = async (project: Project) => {
  const template = {
    name: `${project.name} Template`,
    description: project.description,
    category: 'custom',
    type: 'user-created',
    actionPlans: project.actionPlans,
    tags: project.tags,
    createdBy: currentUser,
  };

  await addDoc(collection(db, 'templates'), template);
};

// Create project from template
const createFromTemplate = async (templateId: string) => {
  const template = await getDoc(doc(db, 'templates', templateId));
  const templateData = template.data();

  // Pre-fill modal with template data
  setFormData({
    name: `${templateData.name} - Copy`,
    description: templateData.description,
    // ... other template fields
  });
};
```

### 2. Bulk Project Creation

```typescript
// Create multiple projects from CSV
const bulkCreateProjects = async (csvData: any[]) => {
  const results = [];

  for (const row of csvData) {
    const project = {
      name: row.name,
      description: row.description,
      icon: row.icon || '📁',
      color: row.color || '#3B82F6',
      workspace: row.workspace,
      startDate: new Date(row.startDate),
      targetEndDate: new Date(row.endDate),
      // ... map other fields
    };

    const result = await addProjectToFirestore(project);
    results.push(result);
  }

  return results;
};
```

### 3. Project Analytics

```typescript
// Track project creation metrics
const trackProjectCreation = async (project: Project) => {
  await addDoc(collection(db, 'analytics'), {
    type: 'project_created',
    projectId: project.id,
    userId: currentUser.uid,
    workspace: project.workspace,
    timestamp: new Date(),
    metadata: {
      icon: project.icon,
      color: project.color,
      hasBudget: !!project.budget,
      tagCount: project.tags.length,
    },
  });
};
```

## Testing

### Unit Test Example

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import CreateProjectModal from '@/components/projects/CreateProjectModal';

describe('CreateProjectModal', () => {
  it('should validate required fields', () => {
    render(<CreateProjectModal open={true} onOpenChange={() => {}} />);
    
    const nextButton = screen.getByText('Next');
    expect(nextButton).toBeDisabled();
    
    // Fill required fields
    fireEvent.change(screen.getByLabelText('Project Name'), {
      target: { value: 'Test Project' },
    });
    
    // Select workspace
    fireEvent.click(screen.getByText('Select a workspace'));
    fireEvent.click(screen.getByText('Product & Development'));
    
    expect(nextButton).not.toBeDisabled();
  });
});
```

### Integration Test

```typescript
describe('Project Creation Flow', () => {
  it('should create project and save to Firebase', async () => {
    const { getByText, getByLabelText } = render(<ProjectsPage />);
    
    // Open modal
    fireEvent.click(getByText('New Project'));
    
    // Step 1
    fireEvent.change(getByLabelText('Project Name'), {
      target: { value: 'Integration Test Project' },
    });
    fireEvent.click(getByText('Next'));
    
    // Step 2
    fireEvent.click(screen.getByText('🚀'));
    fireEvent.click(getByText('Next'));
    
    // Step 3
    fireEvent.click(getByText('Create Project'));
    
    // Wait for Firebase save
    await waitFor(() => {
      expect(getByText('Integration Test Project')).toBeInTheDocument();
    });
  });
});
```

## Performance Optimization

### Lazy Loading Images

```typescript
// Optimize emoji rendering
const EmojiIcon = ({ emoji }) => (
  <span 
    className="text-2xl"
    loading="lazy"
  >
    {emoji}
  </span>
);
```

### Debounced Form Validation

```typescript
import { useDebouncedCallback } from 'use-debounce';

const debouncedValidation = useDebouncedCallback(
  (value) => {
    // Validate project name uniqueness
    checkProjectNameExists(value);
  },
  500
);
```

---

## 🎯 Best Practices

1. **Always validate input** before Firebase operations
2. **Handle errors gracefully** with user-friendly messages
3. **Use transactions** for operations affecting multiple documents
4. **Implement optimistic updates** for better UX
5. **Add loading states** for all async operations
6. **Clean up listeners** on component unmount
7. **Test edge cases** (empty values, special characters, etc.)

---

**Ready to extend?** Start with any of the examples above! 🚀
