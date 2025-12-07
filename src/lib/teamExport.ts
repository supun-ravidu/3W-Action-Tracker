import { TeamMember } from '@/types';

/**
 * Export team members to JSON file
 */
export const exportToJSON = (members: TeamMember[], filename = 'team-members.json') => {
  const dataStr = JSON.stringify(members, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

/**
 * Export team members to CSV file
 */
export const exportToCSV = (members: TeamMember[], filename = 'team-members.csv') => {
  // Define CSV headers
  const headers = [
    'Name',
    'Email',
    'Role',
    'Department',
    'Status',
    'Workload',
    'Skills',
    'Timezone',
    'Tasks Completed',
    'Rating',
    'On-Time Delivery',
    'Achievements Count',
    'Join Date',
  ];

  // Convert members to CSV rows
  const rows = members.map((member) => [
    member.name,
    member.email,
    member.role || '',
    member.department || '',
    member.availability?.status || 'available',
    member.workload || 0,
    member.skills?.join('; ') || '',
    member.timezone || '',
    member.performanceMetrics?.tasksCompleted || 0,
    member.performanceMetrics?.averageRating.toFixed(1) || '0.0',
    `${member.performanceMetrics?.onTimeDelivery || 100}%`,
    member.achievements?.length || 0,
    member.joinedAt ? new Date(member.joinedAt).toLocaleDateString() : '',
  ]);

  // Create CSV content
  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ),
  ].join('\n');

  // Download CSV
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

/**
 * Copy team data to clipboard
 */
export const copyToClipboard = async (members: TeamMember[]) => {
  const text = members
    .map((member) => {
      const lines = [
        `👤 ${member.name}`,
        `📧 ${member.email}`,
        member.role ? `💼 ${member.role}` : '',
        member.department ? `🏢 ${member.department}` : '',
        `🔵 ${member.availability?.status || 'available'}`,
        member.skills?.length ? `🔧 ${member.skills.join(', ')}` : '',
        member.performanceMetrics
          ? `📊 ${member.performanceMetrics.tasksCompleted} tasks | ${member.performanceMetrics.averageRating.toFixed(1)}⭐ | ${member.performanceMetrics.onTimeDelivery}% on-time`
          : '',
      ];
      return lines.filter(Boolean).join('\n');
    })
    .join('\n\n---\n\n');

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

/**
 * Generate team summary report
 */
export const generateSummaryReport = (members: TeamMember[]) => {
  const total = members.length;
  const available = members.filter((m) => m.availability?.status === 'available').length;
  const busy = members.filter((m) => m.availability?.status === 'busy').length;
  const away = members.filter((m) => m.availability?.status === 'away').length;
  const offline = members.filter((m) => m.availability?.status === 'offline').length;

  const totalTasks = members.reduce((sum, m) => sum + (m.workload || 0), 0);
  const avgTasks = total > 0 ? (totalTasks / total).toFixed(1) : '0';

  const totalCompleted = members.reduce(
    (sum, m) => sum + (m.performanceMetrics?.tasksCompleted || 0),
    0
  );

  const avgRating =
    members.length > 0
      ? (
          members.reduce(
            (sum, m) => sum + (m.performanceMetrics?.averageRating || 0),
            0
          ) / members.length
        ).toFixed(1)
      : '0.0';

  // Department breakdown
  const departments = members.reduce((acc, m) => {
    const dept = m.department || 'Unassigned';
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Skills breakdown
  const skills = members.reduce((acc, m) => {
    m.skills?.forEach((skill) => {
      acc[skill] = (acc[skill] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const topSkills = Object.entries(skills)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return {
    overview: {
      total,
      available,
      busy,
      away,
      offline,
    },
    workload: {
      total: totalTasks,
      average: avgTasks,
    },
    performance: {
      totalCompleted,
      averageRating: avgRating,
    },
    departments: Object.entries(departments)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count),
    topSkills: topSkills.map(([name, count]) => ({ name, count })),
  };
};

/**
 * Export summary report as text
 */
export const exportSummaryReport = (members: TeamMember[], filename = 'team-summary.txt') => {
  const report = generateSummaryReport(members);

  const content = `
TEAM SUMMARY REPORT
Generated: ${new Date().toLocaleString()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 OVERVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Members: ${report.overview.total}
🟢 Available: ${report.overview.available}
🟡 Busy: ${report.overview.busy}
🟠 Away: ${report.overview.away}
⚫ Offline: ${report.overview.offline}

💼 WORKLOAD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Tasks: ${report.workload.total}
Average per Member: ${report.workload.average}

📈 PERFORMANCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Completed: ${report.performance.totalCompleted}
Average Rating: ${report.performance.averageRating} / 5.0

🏢 DEPARTMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${report.departments.map((d) => `${d.name}: ${d.count} members`).join('\n')}

🔧 TOP SKILLS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${report.topSkills.map((s, i) => `${i + 1}. ${s.name}: ${s.count} members`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
End of Report
`.trim();

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};
