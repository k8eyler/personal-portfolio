import { CalendarIcon, BriefcaseIcon } from 'lucide-react'

const experiences = [
  {
    title: 'Operations Manager',
    company: 'Hive Gaming',
    location: 'Denver, CO',
    period: '11/2023 - Present',
    achievements: [
      'Lead CRM overhaul to achieve increased internal visibility and communication, increased email outreach 87% in 5 months',
      'Designed and delivered new reporting mechanisms to measure sales effectiveness toward company goals and proactively identify at risk accounts',
      'Report to founders on management of sales and financial operations'
    ]
  },
  {
    title: 'Enterprise Customer Success Manager',
    company: 'Datadog',
    location: 'Denver, CO, USA',
    period: '07/2021 - 03/2023',
    achievements: [
      'Managed 25+ strategic, Enterprise Customers driving $48M annual revenue, supporting >25% revenue growth in 18 months',
      '100% KPI attainment in customer onboarding/adoption, user engagement, and project management',
      'Leveraged data to identify opportunities for growth and develop strategic plans to manage complex projects across customers while collaborating cross-functionally',
      'Managed relationships across complex Enterprise customers and internal teams to understand customer objectives and drive platform adoption and customer growth',
      'Designed and implemented outreach across all users to drive engagement and registration for Datadog events'
    ]
  },
  {
    title: 'Senior Account Manager',
    company: 'Hotel Engine',
    location: 'Denver, CO, USA',
    period: '09/2020 - 07/2021',
    achievements: [
      'Managed a portfolio of 100 Mid-Market and Enterprise accounts, driving $22M annual revenue',
      '100% KPI attainment monthly in customer retention (churn), revenue growth, and customer satisfaction (NPS)',
      'Designed data-driven, custom outreach to increase engagement, resulting in 50% more QBRs scheduled'
    ]
  },
  {
    title: 'Account Manager',
    company: 'Hotel Engine',
    location: 'Denver, CO, USA',
    period: '09/2019 - 08/2020',
    achievements: [
      'Managed a portfolio of 200 SMB accounts, driving $6M annual revenue, achieved 100% KPI attainment',
      'Designed and implemented automated outreach to increase engagement, resulting in the highest NPS response rate of the team',
      'Supported customers through the onboarding process to account maintenance and quarterly business review (QBR)'
    ]
  }
]

export default function ExperienceTimeline() {
  return (
    <section className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8">Professional Experience</h2>
      <div className="space-y-8">
        {experiences.map((exp, index) => (
          <div key={index} className="flex">
            <div className="flex flex-col items-center mr-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <BriefcaseIcon className="text-white" size={24} />
              </div>
              {index !== experiences.length - 1 && (
                <div className="w-0.5 h-full bg-blue-300 mt-2" />
              )}
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg flex-1">
              <div className="flex flex-wrap justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{exp.title}</h3>
                  <p className="text-gray-700 font-medium">{exp.company}</p>
                  <p className="text-gray-600 text-sm">{exp.location}</p>
                </div>
                <div className="flex items-center text-gray-500 mt-1">
                  <CalendarIcon size={16} className="mr-2" />
                  <span className="text-sm">{exp.period}</span>
                </div>
              </div>
              <ul className="mt-4 space-y-2">
                {exp.achievements.map((achievement, i) => (
                  <li key={i} className="text-gray-700 pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-blue-600">
                    {achievement}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}