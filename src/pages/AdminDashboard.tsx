import { useState, useEffect } from 'react';
import { User, Profile } from '../types/auth';
import { useAuth } from '../contexts/AuthContext';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack,
  Box,
  Text,
  Badge,
  useToast,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Grid,
  GridItem,
  Link,
} from '@chakra-ui/react';
import { FaUserPlus, FaUserEdit, FaUserSlash, FaKey, FaRobot, FaCoins } from 'react-icons/fa';
import { sendWelcomeEmail } from '../services/api';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Mock data for API usage
  const apiUsage = {
    totalTokens: 1000000,
    usedTokens: 450000,
    apiKey: "sk-...aBcD",
    lastCheck: new Date(),
    costThisMonth: 45.50,
  };

  // Form states
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileEmail, setNewProfileEmail] = useState('');
  const [newProfilePassword, setNewProfilePassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Carregar usuários (simulado por enquanto)
  useEffect(() => {
    // Aqui você faria uma chamada à API para buscar os usuários
    const mockUsers: User[] = [
      {
        id: '1',
        email: 'admin@phoenyx.com.br',
        password: '', // hash
        isAdmin: true,
        isOwner: true,
        profiles: [
          {
            id: '1',
            name: 'Admin',
            email: 'admin@phoenyx.com.br',
            isActive: true,
            createdAt: Date.now(),
          }
        ],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        id: '2',
        email: 'eduardo@phoenyx.com.br',
        password: '', // hash
        isAdmin: false,
        isOwner: true,
        profiles: [
          {
            id: '2',
            name: 'Eduardo',
            email: 'eduardo@phoenyx.com.br',
            isActive: true,
            createdAt: Date.now(),
          },
          {
            id: '3',
            name: 'Maria',
            email: 'maria@email.com',
            isActive: true,
            createdAt: Date.now(),
          }
        ],
        subscription: {
          id: '1',
          plan: 'premium',
          status: 'active',
          startDate: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 dias atrás
          endDate: Date.now() + 60 * 24 * 60 * 60 * 1000, // 60 dias para frente
          maxProfiles: 3,
          price: 29.90,
          autoRenew: true,
          lastPayment: {
            date: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5 dias atrás
            amount: 29.90,
            status: 'success'
          }
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
    ];
    setUsers(mockUsers);
  }, []);

  const handleAddProfile = async () => {
    if (!selectedUser) return;
    
    try {
      setIsSubmitting(true);

      // Aqui você faria uma chamada à API para adicionar o perfil
      // Por enquanto vamos simular
      const newProfile = {
        id: Date.now().toString(),
        name: newProfileName,
        email: newProfileEmail,
        isActive: true,
        createdAt: Date.now(),
      };

      // Enviar email para o novo perfil
      const response = await sendWelcomeEmail({
        to: newProfileEmail,
        name: newProfileName,
        password: newProfilePassword
      });

      // Atualizar a lista de usuários (simulado)
      setUsers(users.map(user => 
        user.id === selectedUser.id 
          ? { ...user, profiles: [...user.profiles, newProfile] }
          : user
      ));

      toast({
        title: 'Perfil adicionado com sucesso',
        description: (
          <Box>
            <Text>Um email foi enviado com as credenciais de acesso.</Text>
            {response.previewUrl && (
              <Link href={response.previewUrl} isExternal color="blue.500" mt={2} display="block">
                Visualizar email enviado
              </Link>
            )}
          </Box>
        ),
        status: 'success',
        duration: 10000,
        isClosable: true,
      });

      // Limpar form
      setNewProfileName('');
      setNewProfileEmail('');
      setNewProfilePassword('');
      onClose();

    } catch (error) {
      console.error('Erro ao adicionar perfil:', error);
      
      let errorMessage = 'Erro desconhecido ao adicionar perfil';
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: 'Erro ao adicionar perfil',
        description: errorMessage,
        status: 'error',
        duration: 7000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard Administrativo</h1>
        
        <div className="mt-8">
          <Box bg="white" shadow="sm" rounded="lg" p={6}>
            <VStack spacing={6} align="stretch">
              {/* API e Tokens */}
              <Box>
                <Text fontSize="lg" fontWeight="semibold" mb={4}>
                  API OpenAI e Tokens
                </Text>
                <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                  <GridItem>
                    <Box p={4} bg="blue.50" rounded="md">
                      <HStack spacing={3} mb={2}>
                        <FaKey />
                        <Text fontWeight="medium">Chave API</Text>
                      </HStack>
                      <Text fontSize="sm" color="gray.600">{apiUsage.apiKey}</Text>
                      <Text fontSize="xs" color="gray.500" mt={1}>
                        Última verificação: {apiUsage.lastCheck.toLocaleString()}
                      </Text>
                    </Box>
                  </GridItem>
                  <GridItem>
                    <Box p={4} bg="green.50" rounded="md">
                      <HStack spacing={3} mb={2}>
                        <FaRobot />
                        <Text fontWeight="medium">Uso de Tokens</Text>
                      </HStack>
                      <Progress 
                        value={(apiUsage.usedTokens / apiUsage.totalTokens) * 100} 
                        size="sm" 
                        colorScheme="green" 
                        mb={2}
                      />
                      <Text fontSize="sm" color="gray.600">
                        {apiUsage.usedTokens.toLocaleString()} / {apiUsage.totalTokens.toLocaleString()}
                      </Text>
                    </Box>
                  </GridItem>
                  <GridItem>
                    <Box p={4} bg="purple.50" rounded="md">
                      <HStack spacing={3} mb={2}>
                        <FaCoins />
                        <Text fontWeight="medium">Custo</Text>
                      </HStack>
                      <Stat>
                        <StatNumber fontSize="2xl">${apiUsage.costThisMonth}</StatNumber>
                        <StatHelpText>Este mês</StatHelpText>
                      </Stat>
                    </Box>
                  </GridItem>
                </Grid>
              </Box>

              {/* Estatísticas de Usuários */}
              <Box>
                <Text fontSize="lg" fontWeight="semibold" mb={4}>
                  Visão Geral - Usuários
                </Text>
                <HStack spacing={8}>
                  <Box p={4} bg="purple.50" rounded="md">
                    <Text color="purple.600" fontSize="sm">Total de Usuários</Text>
                    <Text fontSize="2xl" fontWeight="bold">{users.length}</Text>
                  </Box>
                  <Box p={4} bg="blue.50" rounded="md">
                    <Text color="blue.600" fontSize="sm">Perfis Ativos</Text>
                    <Text fontSize="2xl" fontWeight="bold">
                      {users.reduce((acc, user) => acc + user.profiles.filter(p => p.isActive).length, 0)}
                    </Text>
                  </Box>
                  <Box p={4} bg="green.50" rounded="md">
                    <Text color="green.600" fontSize="sm">Conversas Hoje</Text>
                    <Text fontSize="2xl" fontWeight="bold">0</Text>
                  </Box>
                </HStack>
              </Box>

              {/* Lista de Usuários */}
              <Box>
                <Text fontSize="lg" fontWeight="semibold" mb={4}>
                  Usuários e Perfis
                </Text>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Email</Th>
                      <Th>Tipo</Th>
                      <Th>Perfis</Th>
                      <Th>Plano</Th>
                      <Th>Status</Th>
                      <Th>Ações</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {users.map((user) => (
                      <Tr key={user.id}>
                        <Td>
                          <VStack align="start" spacing={1}>
                            <Text>{user.email}</Text>
                            {user.isOwner && (
                              <Badge colorScheme="purple" fontSize="xs">
                                Conta Principal
                              </Badge>
                            )}
                          </VStack>
                        </Td>
                        <Td>
                          <Badge colorScheme={user.isAdmin ? 'purple' : 'blue'}>
                            {user.isAdmin ? 'Admin' : 'Usuário'}
                          </Badge>
                        </Td>
                        <Td>
                          <VStack align="start" spacing={2}>
                            {user.profiles.map((profile) => (
                              <HStack key={profile.id}>
                                <Badge colorScheme={profile.isActive ? 'green' : 'gray'}>
                                  {profile.name}
                                </Badge>
                                <Text fontSize="xs" color="gray.500">
                                  {profile.email}
                                </Text>
                              </HStack>
                            ))}
                            {user.subscription && (
                              <Text fontSize="xs" color="gray.500">
                                {user.profiles.length}/{user.subscription.maxProfiles} perfis usados
                              </Text>
                            )}
                          </VStack>
                        </Td>
                        <Td>
                          {user.subscription ? (
                            <VStack align="start" spacing={1}>
                              <Badge colorScheme="blue">
                                {user.subscription.plan.toUpperCase()}
                              </Badge>
                              <Text fontSize="xs" color="gray.500">
                                R$ {user.subscription.price}/mês
                              </Text>
                            </VStack>
                          ) : (
                            <Badge colorScheme="gray">Sem plano</Badge>
                          )}
                        </Td>
                        <Td>
                          {user.subscription ? (
                            <VStack align="start" spacing={1}>
                              <Badge 
                                colorScheme={
                                  user.subscription.status === 'active' ? 'green' : 
                                  user.subscription.status === 'inactive' ? 'red' : 
                                  'yellow'
                                }
                              >
                                {user.subscription.status === 'active' ? 'Ativo' : 
                                 user.subscription.status === 'inactive' ? 'Inativo' : 
                                 'Cancelado'}
                              </Badge>
                              {user.subscription.lastPayment && (
                                <Text fontSize="xs" color="gray.500">
                                  Último pagamento: {new Date(user.subscription.lastPayment.date).toLocaleDateString()}
                                </Text>
                              )}
                            </VStack>
                          ) : (
                            <Badge colorScheme="red">Inativo</Badge>
                          )}
                        </Td>
                        <Td>
                          <VStack spacing={2}>
                            <Button
                              size="sm"
                              colorScheme="purple"
                              leftIcon={<FaUserPlus />}
                              isDisabled={user.subscription ? user.profiles.length >= user.subscription.maxProfiles : true}
                              onClick={() => {
                                setSelectedUser(user);
                                onOpen();
                              }}
                            >
                              Adicionar Perfil
                            </Button>
                            <Button
                              size="sm"
                              colorScheme="blue"
                              leftIcon={<FaUserEdit />}
                            >
                              Editar
                            </Button>
                            <Button
                              size="sm"
                              colorScheme="red"
                              leftIcon={<FaUserSlash />}
                              isDisabled={user.isAdmin}
                            >
                              Desativar
                            </Button>
                          </VStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </VStack>
          </Box>
        </div>

        {/* Modal para adicionar perfil */}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Adicionar Novo Perfil</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack spacing={4}>
                <FormControl isRequired isDisabled={isSubmitting}>
                  <FormLabel>Nome do Perfil</FormLabel>
                  <Input 
                    placeholder="Nome do perfil"
                    value={newProfileName}
                    onChange={(e) => setNewProfileName(e.target.value)}
                  />
                </FormControl>
                <FormControl isRequired isDisabled={isSubmitting}>
                  <FormLabel>Email</FormLabel>
                  <Input 
                    type="email" 
                    placeholder="Email do perfil"
                    value={newProfileEmail}
                    onChange={(e) => setNewProfileEmail(e.target.value)}
                  />
                </FormControl>
                <FormControl isRequired isDisabled={isSubmitting}>
                  <FormLabel>Senha</FormLabel>
                  <Input 
                    type="password" 
                    placeholder="Senha para o novo perfil"
                    value={newProfilePassword}
                    onChange={(e) => setNewProfilePassword(e.target.value)}
                  />
                </FormControl>
                <Button 
                  colorScheme="purple" 
                  w="full"
                  onClick={handleAddProfile}
                  isLoading={isSubmitting}
                  loadingText="Adicionando perfil e enviando email..."
                  isDisabled={!newProfileName || !newProfileEmail || !newProfilePassword || isSubmitting}
                >
                  Adicionar Perfil
                </Button>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}
