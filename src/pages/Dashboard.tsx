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
} from '@chakra-ui/react';
import { useAuth } from '../hooks/useAuth';

export default function Dashboard() {
  const { user } = useAuth();
  const [metrics] = useState({
    totalSessions: 120,
    averageScore: 85,
    learningStreak: 7,
    wordsLearned: 450,
  });

  return (
    <Box p={5}>
      <VStack spacing={6} align="stretch">
        <Text fontSize="2xl" fontWeight="bold">
          Welcome back, {user?.email}!
        </Text>

        <Grid templateColumns="repeat(4, 1fr)" gap={4}>
          <GridItem>
            <Stat>
              <StatLabel>Total Sessions</StatLabel>
              <StatNumber>{metrics.totalSessions}</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                23%
              </StatHelpText>
            </Stat>
          </GridItem>

          <GridItem>
            <Stat>
              <StatLabel>Average Score</StatLabel>
              <StatNumber>{metrics.averageScore}%</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                5%
              </StatHelpText>
            </Stat>
          </GridItem>

          <GridItem>
            <Stat>
              <StatLabel>Learning Streak</StatLabel>
              <StatNumber>{metrics.learningStreak} days</StatNumber>
              <StatHelpText>Keep it up!</StatHelpText>
            </Stat>
          </GridItem>

          <GridItem>
            <Stat>
              <StatLabel>Words Learned</StatLabel>
              <StatNumber>{metrics.wordsLearned}</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                12 new this week
              </StatHelpText>
            </Stat>
          </GridItem>
        </Grid>

        <Box>
          <Text mb={2}>Progress to Next Level</Text>
          <Progress value={80} size="lg" colorScheme="green" />
        </Box>

        <HStack spacing={4} justify="center">
          {/* Add action buttons or additional features here */}
        </HStack>
      </VStack>
    </Box>
  );
}
