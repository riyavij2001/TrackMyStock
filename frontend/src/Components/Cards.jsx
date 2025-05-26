import React from 'react';
import TimelineIcon from '@mui/icons-material/Timeline';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import InsightsIcon from '@mui/icons-material/Insights';

function Cards() {
  const cards = [
    {
      title: 'Real-Time Tracking',
      description: 'Get live updates on stock prices and market trends.',
      bgColor: 'bg-[#1E1E1E]', // Dark background
      textColor: 'text-white',
      height: 'h-80',
      icon: <TimelineIcon style={{ fontSize: '2.5rem', marginBottom: '1rem' }} />, // Explicit size
    },
    {
      title: 'Personalized Alerts',
      description: 'Receive notifications tailored to your stock preferences.',
      bgColor: 'bg-[#a8d603]', // Theme color background
      textColor: 'text-[#1E1E1E]',
      height: 'h-96',
      icon: <NotificationsActiveIcon style={{ fontSize: '2.5rem', marginBottom: '1rem' }} />, // Explicit size
    },
    {
      title: 'Comprehensive Insights',
      description: 'Access detailed analysis and reports for smarter investments.',
      bgColor: 'bg-[#1E1E1E]', // Dark background
      textColor: 'text-white',
      height: 'h-80',
      icon: <InsightsIcon style={{ fontSize: '2.5rem', marginBottom: '1rem' }} />, // Explicit size
    },
  ];

  return (
    <div className="flex flex-wrap justify-center items-center p-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`relative p-[2px] rounded-lg shadow-lg ${card.height}`}
          style={{
            background: index === 1 ? '' : 'linear-gradient(45deg, black 40%, #2F2F2F 100%)',
          }}
        >
          <div
            className={`${card.bgColor} ${card.textColor} p-6 rounded-lg w-80 h-full text-center flex flex-col justify-center items-center`}
          >
            {card.icon}
            <h3 className={`text-xl font-bold mb-4 ${card.textColor}`}>{card.title}</h3>
            <p className={`text-md ${card.textColor}`}>{card.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Cards;