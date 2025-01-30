import { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Progress,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  CircularProgress,
  CircularProgressLabel,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';
import { 
  FaGraduationCap, 
  FaClock, 
  FaComments, 
  FaStar,
  FaChartLine,
  FaLanguage,
} from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';

// Mock data for learning metrics
const learningMetrics = {
  totalMinutes: 480,
  totalSessions: 24,
  averageScore: 85,
  lastWeekMinutes: 120,
  previousWeekMinutes: 90,
  languageProgress: {
    english: 75,
    spanish: 45,
    french: 30,
  },
  recentSessions: [
    { id: 1, date: '2025-01-30', duration: 30, language: 'English', score: 88, topics: ['Daily Routine', 'Travel'] },
    { id: 2, date: '2025-01-29', duration: 25, language: 'Spanish', score: 82, topics: ['Food', 'Culture'] },
    { id: 3, date: '2025-01-28', duration: 35, language: 'English', score: 90, topics: ['Business', 'Technology'] },
  ],
  skillProgress: {
    speaking: 70,
    listening: 85,
    vocabulary: 65,
    grammar: 80,
  },
};

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-4">
            <div className="text-center">
              <h2 className="text-lg font-medium text-gray-900">
                Bem-vindo, {user?.email}!
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Este é o seu dashboard personalizado.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
