import React, { useState } from 'react';
import ical from 'ical-generator';

const CalendarForm = () => {
  const [days, setDays] = useState(21);
  const [percentage, setPercentage] = useState(60);
  const [titles, setTitles] = useState([
    "Data Management Meeting",
    "Reporting Standards Project Meeting",
    "Data Analysis Session",
    "Project Planning Meeting",
    "Standards Review Meeting",
    "Data Quality Assurance Meeting",
    "Reporting Strategy Session",
    "Data Governance Workshop",
    "Analytics Review Meeting",
    "Project Coordination Meeting",
    "Standards Compliance Discussion",
    "Data Integration Planning",
    "Reporting Tools Training",
    "Data Security Briefing",
    "Performance Metrics Review"
  ]);
  const [selectedTitles, setSelectedTitles] = useState(titles);
  const [newTitle, setNewTitle] = useState('');

  const handleTitleChange = (title) => {
    setSelectedTitles(prev =>
      prev.includes(title)
        ? prev.filter(t => t !== title)
        : [...prev, title]
    );
  };

  const addNewTitle = () => {
    if (newTitle && !titles.includes(newTitle)) {
      setTitles([...titles, newTitle]);
      setSelectedTitles([...selectedTitles, newTitle]);
      setNewTitle('');
    }
  };

  const generateICal = () => {
    const cal = ical({ name: 'Generated Calendar' });
    const startDate = new Date();
    const workdayStart = new Date(startDate.setHours(9, 0, 0, 0));
    const workdayEnd = new Date(startDate.setHours(17, 0, 0, 0));
    const lunchStart = new Date(startDate.setHours(13, 0, 0, 0));
    const lunchEnd = new Date(startDate.setHours(14, 0, 0, 0));

    for (let day = 0; day < days; day++) {
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + day);

      if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
        continue;
      }

      let morningDuration = (lunchStart.getHours() - workdayStart.getHours()) * 60;
      let occupiedMorningDuration = Math.floor(morningDuration * (percentage / 100));
      let currentTime = new Date(currentDate.setHours(9, 0, 0, 0));

      while (currentTime < lunchStart && occupiedMorningDuration > 0) {
        const duration = occupiedMorningDuration >= 60 ? 60 : 30;
        const title = selectedTitles[Math.floor(Math.random() * selectedTitles.length)];
        cal.createEvent({
          start: new Date(currentTime),
          end: new Date(currentTime.setMinutes(currentTime.getMinutes() + duration)),
          summary: title
        });
        occupiedMorningDuration -= duration;
      }

      let afternoonDuration = (workdayEnd.getHours() - lunchEnd.getHours()) * 60;
      let occupiedAfternoonDuration = Math.floor(afternoonDuration * (percentage / 100));
      currentTime = new Date(currentDate.setHours(14, 0, 0, 0));

      while (currentTime < workdayEnd && occupiedAfternoonDuration > 0) {
        const duration = occupiedAfternoonDuration >= 60 ? 60 : 30;
        const title = selectedTitles[Math.floor(Math.random() * selectedTitles.length)];
        cal.createEvent({
          start: new Date(currentTime),
          end: new Date(currentTime.setMinutes(currentTime.getMinutes() + duration)),
          summary: title
        });
        occupiedAfternoonDuration -= duration;
      }
    }

    const blob = new Blob([cal.toString()], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'calendar.ics';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="formDiv">
      <h1>Calendar Generator</h1>
      <form onSubmit={(e) => { e.preventDefault(); generateICal(); }}>
        <div>
          <label>Number of work-days:</label>
          <input
            type="number"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            min="1"
            step="1"
          />
        </div>
        <div>
          <label>Percentage of Occupation:</label>
          <input
            type="number"
            value={percentage}
            onChange={(e) => setPercentage(e.target.value)}
            min="1"
            max="100"
            step="1"
          />%
        </div>
        <div>
          <label>Meeting Titles:</label>
          {titles.map((title, index) => (
            <div key={index}>
              <input
                type="checkbox"
                checked={selectedTitles.includes(title)}
                onChange={() => handleTitleChange(title)}
              />
              {title}
            </div>
          ))}
        </div>
        <div>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Add new title"
          />
          <button type="button" onClick={addNewTitle}>Add Title</button>
        </div>
        <button type="submit">Generate iCal</button>
      </form>
    </div>
  );
};

export default CalendarForm;