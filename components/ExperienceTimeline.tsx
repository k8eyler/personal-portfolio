'use client'

import React, { useState } from 'react';

const Toggle = ({ isChecked, onChange }) => (
  <button
    onClick={() => onChange(!isChecked)}
    className={`
      relative inline-flex h-8 w-16 items-center rounded-full
      transition-colors duration-200 ease-in-out focus:outline-none
      bg-background/60 backdrop-blur-xl border border-white/10 shadow-sm
    `}
  >
    <span
      className={`
        inline-block h-6 w-6 transform rounded-full transition-transform
        bg-background/80 backdrop-blur-xl border border-white/20 shadow-sm
        ${isChecked ? 'translate-x-9' : 'translate-x-1'}
      `}
    />
  </button>
);

const professionalExperiences = [
  {
    logo: "/archsoftware_logo.jpeg",
    title: 'Account Manager',
    company: 'Arch',
    period: '11/2025 - Present',
    achievements: [
      'Manage a book of flagship investment firms, with $10.3B assets under administration (AUM)',
    ]
  },
  {
    logo: "/hive.jpg",
    title: 'Operations Manager',
    company: 'Hive Gaming',
    period: '11/2023 - 11/2025',
    achievements: [
      'Lead CRM overhaul to achieve increased internal visibility and communication, increased email outreach 87% in 5 months',
      'Designed and delivered new revenue reporting dashboard, decreasing time spent on payroll by 60%'
    ]
  },
  {
    logo: "datadog.jpg",
    title: 'Enterprise Customer Success Manager',
    company: 'Datadog',
    period: '07/2021 - 03/2023',
    achievements: [
      'Managed 25+ strategic, Enterprise Customers driving $48M annual revenue, supporting >25% revenue growth in 18 months',
      'Leveraged data to identify opportunities for growth and develop strategic plans to manage complex projects'
    ]
  },
  {
    logo: "/HE.jpg",
    title: 'Senior Account Manager',
    company: 'Hotel Engine',
    period: '09/2020 - 07/2021',
    achievements: [
      'Managed a portfolio of 100 Mid-Market and Enterprise accounts, driving $22M annual revenue',
      'Designed data-driven, custom outreach to increase engagement, resulting in 50% more QBRs scheduled'
    ]
  },
  {
    logo: "/HEred.jpg",
    title: 'Account Manager',
    company: 'Hotel Engine',
    period: '09/2019 - 08/2020',
    achievements: [
      'Managed a portfolio of 200 SMB accounts, driving $6M annual revenue, achieved 100% KPI attainment',
      'Designed and implemented automated outreach to increase engagement'
    ]
  }
];

const personalExperiences = [
  {
    logo: "/travel.png",
    title: 'Flew 3.5x Around the World',
    company: '2025',
    period: '',
    achievements: [
      'Spent 8 days 8 minutes in the air',
      'Highlights: Cannes, Bangkok, Doha, Crete '
    ]
  },
  {
    logo: "/goldstar.jpg",
    title: '1000th Crossword Solved',
    company: '12/22/2024',
    period: '',
    achievements: [
      'Sunday puzzle, completed in 25.7 minutes',
      '4th fastest Sunday puzzle to date'
    ]
  },
  {
    logo: "/skiing.jpg",
    title: 'Joined Guiness Book of World Records',
    company: '4/28/2024',
    period: '',
    achievements: [
      'Most Guy Fieris skiing simultaneously (328)',
      'Minimal ice stuck in my goatee'
    ]
  },
  {
    logo: "/katecheese.jpg",
    title: '62lb Block of Parmesan Acquired',
    company: '9/27/2023',
    period: '',
    achievements: [
      'Life long goal of at-home parmesan wheel pasta achieved',
      'Unsure of what to do with remaining 31 lbs'
    ]
  },
  {
    logo: "/scooter.jpg",
    title: 'Scooter Joins the Family',
    company: '4/10/2020',
    period: '',
    achievements: [
      'I now have a tiny assistant',
      'His technical skills remain to be seen'
    ]
  },
  // Add more personal experiences following the same structure
];

export default function ExperienceTimeline() {
  const [isProfessional, setIsProfessional] = useState(true);
  const experiences = isProfessional ? professionalExperiences : personalExperiences;

  return (
    <section className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-center space-x-8 mb-12">
        <div className="flex items-center gap-4">
          <span className={`text-2xl md:text-3xl font-semibold transition-colors ${isProfessional ? 'text-foreground' : 'text-muted-foreground'}`}>
            Professional
          </span>
          <Toggle
            isChecked={!isProfessional}
            onChange={(checked) => setIsProfessional(!checked)}
          />
          <span className={`text-2xl md:text-3xl font-semibold transition-colors ${!isProfessional ? 'text-foreground' : 'text-muted-foreground'}`}>
            Personal
          </span>
        </div>
      </div>

      <div className="space-y-12">
        {experiences.map((exp, index) => (
          <div key={index} className={`flex items-start gap-8 ${!isProfessional ? 'flex-row-reverse' : ''}`}>
            <div className="flex flex-col items-center">
              <div className="w-40 h-40 bg-card rounded-lg shadow-md border border-border flex items-center justify-center">
                <img 
                  src={exp.logo}
                  alt={`${exp.company} logo`}
                  className="w-36 h-36 object-contain"
                />
              </div>
              {index !== experiences.length - 1 && (
                <div className="w-0.5 h-full bg-primary/30 mt-4" />
              )}
            </div>
            
            <div className={`flex-1 pt-2 ${!isProfessional ? 'text-right' : ''}`}>
              <h3 className="text-xl font-semibold text-foreground">{exp.title}</h3>
              <p className="text-foreground font-medium">{exp.company}</p>
              <p className="text-muted-foreground text-sm mb-4">{exp.period}</p>
              
              <ul className={`space-y-2 ${!isProfessional ? 'ml-auto' : ''}`}>
                {exp.achievements.map((achievement, i) => (
                  <li 
                    key={i} 
                    className="text-muted-foreground"
                  >
                    {achievement}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}