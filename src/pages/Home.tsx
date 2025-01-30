import { Box, Container, Heading, Text, Button } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

function Home() {
  return (
    <Container maxW="container.xl" py={8}>
      <Box textAlign="center">
        <Heading as="h1" size="xl" mb={4}>
          Bem-vindo ao LTII
        </Heading>
        <Text fontSize="lg" mb={6}>
          Pratique conversação em diferentes idiomas com nossa IA inteligente.
        </Text>
        <Button
          as={RouterLink}
          to="/conversation"
          colorScheme="blue"
          size="lg"
        >
          Iniciar Conversação
        </Button>
      </Box>
    </Container>
  );
}

export default Home;
