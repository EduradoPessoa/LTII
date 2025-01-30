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
import { useAuth } from '../contexts/AuthContext';

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
  const { user, activeProfile } = useAuth();

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Meu Progresso</h1>

        <div className="mt-8">
          <Box bg="white" shadow="sm" rounded="lg" p={6}>
            <VStack spacing={6} align="stretch">
              {/* Resumo do Progresso */}
              <Box>
                <Text fontSize="lg" fontWeight="semibold" mb={4}>
                  Resumo de Aprendizado
                </Text>
                <Grid templateColumns="repeat(4, 1fr)" gap={6}>
                  <GridItem>
                    <Box p={4} bg="purple.50" rounded="md">
                      <HStack spacing={3} mb={2}>
                        <FaClock />
                        <Text fontWeight="medium">Tempo Total</Text>
                      </HStack>
                      <Stat>
                        <StatNumber>{learningMetrics.totalMinutes} min</StatNumber>
                        <StatHelpText>
                          <StatArrow 
                            type={learningMetrics.lastWeekMinutes > learningMetrics.previousWeekMinutes ? 'increase' : 'decrease'} 
                          />
                          {Math.abs(((learningMetrics.lastWeekMinutes - learningMetrics.previousWeekMinutes) / learningMetrics.previousWeekMinutes) * 100).toFixed(0)}%
                        </StatHelpText>
                      </Stat>
                    </Box>
                  </GridItem>
                  <GridItem>
                    <Box p={4} bg="blue.50" rounded="md">
                      <HStack spacing={3} mb={2}>
                        <FaComments />
                        <Text fontWeight="medium">Sessões</Text>
                      </HStack>
                      <Stat>
                        <StatNumber>{learningMetrics.totalSessions}</StatNumber>
                        <StatHelpText>Conversações</StatHelpText>
                      </Stat>
                    </Box>
                  </GridItem>
                  <GridItem>
                    <Box p={4} bg="green.50" rounded="md">
                      <HStack spacing={3} mb={2}>
                        <FaStar />
                        <Text fontWeight="medium">Pontuação Média</Text>
                      </HStack>
                      <CircularProgress value={learningMetrics.averageScore} color="green.400" size="60px">
                        <CircularProgressLabel>{learningMetrics.averageScore}%</CircularProgressLabel>
                      </CircularProgress>
                    </Box>
                  </GridItem>
                  <GridItem>
                    <Box p={4} bg="orange.50" rounded="md">
                      <HStack spacing={3} mb={2}>
                        <FaChartLine />
                        <Text fontWeight="medium">Streak</Text>
                      </HStack>
                      <Stat>
                        <StatNumber>5 dias</StatNumber>
                        <StatHelpText>Sequência atual</StatHelpText>
                      </Stat>
                    </Box>
                  </GridItem>
                </Grid>
              </Box>

              {/* Progresso por Idioma */}
              <Box>
                <Text fontSize="lg" fontWeight="semibold" mb={4}>
                  Progresso por Idioma
                </Text>
                <VStack spacing={4} align="stretch">
                  {Object.entries(learningMetrics.languageProgress).map(([language, progress]) => (
                    <Box key={language}>
                      <HStack justify="space-between" mb={2}>
                        <HStack>
                          <FaLanguage />
                          <Text>{language}</Text>
                        </HStack>
                        <Text fontWeight="medium">{progress}%</Text>
                      </HStack>
                      <Progress value={progress} size="sm" colorScheme="blue" rounded="full" />
                    </Box>
                  ))}
                </VStack>
              </Box>

              {/* Habilidades */}
              <Box>
                <Text fontSize="lg" fontWeight="semibold" mb={4}>
                  Habilidades
                </Text>
                <Grid templateColumns="repeat(4, 1fr)" gap={6}>
                  {Object.entries(learningMetrics.skillProgress).map(([skill, progress]) => (
                    <GridItem key={skill}>
                      <Box p={4} bg="gray.50" rounded="md" textAlign="center">
                        <Text mb={2} fontWeight="medium" textTransform="capitalize">
                          {skill}
                        </Text>
                        <CircularProgress value={progress} color="blue.400" size="80px">
                          <CircularProgressLabel>{progress}%</CircularProgressLabel>
                        </CircularProgress>
                      </Box>
                    </GridItem>
                  ))}
                </Grid>
              </Box>

              {/* Sessões Recentes */}
              <Box>
                <Text fontSize="lg" fontWeight="semibold" mb={4}>
                  Sessões Recentes
                </Text>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Data</Th>
                      <Th>Idioma</Th>
                      <Th>Duração</Th>
                      <Th>Pontuação</Th>
                      <Th>Tópicos</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {learningMetrics.recentSessions.map((session) => (
                      <Tr key={session.id}>
                        <Td>{new Date(session.date).toLocaleDateString()}</Td>
                        <Td>{session.language}</Td>
                        <Td>{session.duration} min</Td>
                        <Td>
                          <Badge colorScheme={session.score >= 85 ? 'green' : 'yellow'}>
                            {session.score}%
                          </Badge>
                        </Td>
                        <Td>
                          <HStack spacing={2}>
                            {session.topics.map((topic) => (
                              <Badge key={topic} colorScheme="blue">
                                {topic}
                              </Badge>
                            ))}
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </VStack>
          </Box>
        </div>
      </div>
    </div>
  );
}
