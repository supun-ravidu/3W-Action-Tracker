'use client';

import { useActionPlansStore } from '@/store/actionPlansStore';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Code, MessageSquare, Palette, Database, Shield } from 'lucide-react';

export function SkillMatrix() {
  const { teamMembers } = useActionPlansStore();

  const skillIcons: Record<string, any> = {
    'Frontend': Code,
    'Backend': Database,
    'Design': Palette,
    'Communication': MessageSquare,
    'Leadership': Award,
    'Security': Shield,
  };

  const allSkills = Array.from(
    new Set(teamMembers.flatMap(member => member.skills || []))
  ).sort();

  const getSkillLevel = (member: any, skill: string) => {
    return member.skills?.includes(skill);
  };

  const getSkillCount = (skill: string) => {
    return teamMembers.filter(member => member.skills?.includes(skill)).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Award className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Team Skill Matrix</h2>
        <Badge variant="secondary">{allSkills.length} Skills</Badge>
      </div>

      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-semibold">Team Member</th>
                {allSkills.map(skill => {
                  const Icon = skillIcons[skill] || Code;
                  return (
                    <th key={skill} className="text-center p-3">
                      <div className="flex flex-col items-center gap-1">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs font-medium">{skill}</span>
                        <Badge variant="outline" className="text-xs">
                          {getSkillCount(skill)}
                        </Badge>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {teamMembers.map(member => (
                <tr key={member.id} className="border-b hover:bg-accent/50">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                  </td>
                  {allSkills.map(skill => (
                    <td key={skill} className="text-center p-3">
                      {getSkillLevel(member, skill) ? (
                        <div className="flex justify-center">
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">✓</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-center">
                          <div className="w-6 h-6 bg-gray-200 rounded-full" />
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 pt-6 border-t">
          <h3 className="font-semibold mb-3">Skill Coverage</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {allSkills.map(skill => {
              const count = getSkillCount(skill);
              const percentage = (count / teamMembers.length) * 100;
              const Icon = skillIcons[skill] || Code;
              
              return (
                <Card key={skill} className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <span className="font-medium text-sm">{skill}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{count} members</span>
                      <span className="font-semibold">{percentage.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
}
