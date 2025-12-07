'use client';

import { useActionPlansStore } from '@/store/actionPlansStore';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Plane, Briefcase, Home } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isWithinInterval } from 'date-fns';
import { useState } from 'react';

export function AvailabilityCalendar() {
  const { teamMembers } = useActionPlansStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getTimeOffForDay = (day: Date) => {
    const timeOffs: Array<{ member: any; timeOff: any }> = [];
    
    teamMembers.forEach(member => {
      member.availability?.timeOff?.forEach(to => {
        const start = new Date(to.start);
        const end = new Date(to.end);
        if (isWithinInterval(day, { start, end })) {
          timeOffs.push({ member, timeOff: to });
        }
      });
    });
    
    return timeOffs;
  };

  const getReasonIcon = (reason: string) => {
    if (reason.toLowerCase().includes('vacation') || reason.toLowerCase().includes('holiday')) {
      return Plane;
    }
    if (reason.toLowerCase().includes('sick')) {
      return Home;
    }
    return Briefcase;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-6 w-6" />
          <h2 className="text-2xl font-bold">Team Availability</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
            className="px-3 py-1 text-sm border rounded hover:bg-accent"
          >
            Previous
          </button>
          <Badge variant="outline" className="text-base px-4">
            {format(currentMonth, 'MMMM yyyy')}
          </Badge>
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
            className="px-3 py-1 text-sm border rounded hover:bg-accent"
          >
            Next
          </button>
        </div>
      </div>

      <Card className="p-6">
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-semibold text-sm text-muted-foreground p-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: monthStart.getDay() }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}
          
          {daysInMonth.map(day => {
            const timeOffs = getTimeOffForDay(day);
            const isToday = isSameDay(day, new Date());
            
            return (
              <div
                key={day.toISOString()}
                className={`aspect-square border rounded-lg p-2 ${
                  isToday ? 'border-primary border-2' : 'border-gray-200'
                } ${timeOffs.length > 0 ? 'bg-orange-50' : 'bg-white'} hover:shadow-md transition-shadow`}
              >
                <div className="flex flex-col h-full">
                  <span className={`text-sm font-medium ${isToday ? 'text-primary' : ''}`}>
                    {format(day, 'd')}
                  </span>
                  {timeOffs.length > 0 && (
                    <div className="flex-1 mt-1 space-y-1">
                      {timeOffs.slice(0, 2).map(({ member, timeOff }, i) => {
                        const Icon = getReasonIcon(timeOff.reason);
                        return (
                          <div
                            key={i}
                            className="text-xs bg-orange-100 rounded px-1 py-0.5 flex items-center gap-1"
                            title={`${member.name} - ${timeOff.reason}`}
                          >
                            <Icon className="h-3 w-3" />
                            <span className="truncate">{member.name.split(' ')[0]}</span>
                          </div>
                        );
                      })}
                      {timeOffs.length > 2 && (
                        <div className="text-xs text-muted-foreground">
                          +{timeOffs.length - 2} more
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Upcoming Time Off</h3>
        <div className="space-y-3">
          {teamMembers
            .flatMap(member =>
              (member.availability?.timeOff || []).map(to => ({
                member,
                timeOff: to,
              }))
            )
            .filter(({ timeOff }) => new Date(timeOff.start) >= new Date())
            .sort((a, b) => new Date(a.timeOff.start).getTime() - new Date(b.timeOff.start).getTime())
            .slice(0, 5)
            .map(({ member, timeOff }, i) => {
              const Icon = getReasonIcon(timeOff.reason);
              return (
                <div key={i} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Icon className="h-3 w-3" />
                        {timeOff.reason}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {format(new Date(timeOff.start), 'MMM d')} - {format(new Date(timeOff.end), 'MMM d')}
                  </Badge>
                </div>
              );
            })}
        </div>
      </Card>
    </div>
  );
}
