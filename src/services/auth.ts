import { LoginCredentials, User, Profile, RegisterData, ProfileData } from '../types/auth';

// Função simples para simular hash (NÃO USE EM PRODUÇÃO)
function simpleHash(str: string): string {
  const hashed = btoa(str);
  console.log('Hash gerado:', hashed);
  return hashed;
}

// Simula um banco de dados em memória
const initialAdmin = {
  id: '1',
  email: 'admin@phoenyx.com.br',
  password: btoa('admin@123'), // Hash direto na criação
  isAdmin: true,
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
};

let users: User[] = [initialAdmin];

// Armazena os IPs ativos por perfil
const activeProfileIps: Map<string, string> = new Map();

export async function login(email: string, password: string): Promise<{ user: User; profile: Profile }> {
  console.log('Tentativa de login:', { email });
  const user = users.find(u => u.email === email);
  
  if (!user) {
    console.log('Usuário não encontrado');
    throw new Error('Credenciais inválidas');
  }

  const hashedPassword = simpleHash(password);
  console.log('Comparando senhas:', {
    fornecida: hashedPassword,
    armazenada: user.password,
    match: hashedPassword === user.password
  });

  if (hashedPassword !== user.password) {
    console.log('Senha incorreta');
    throw new Error('Credenciais inválidas');
  }

  // Por enquanto, usa o primeiro perfil. Depois implementaremos a seleção de perfil
  const profile = user.profiles[0];
  
  // Verifica se o perfil já está logado em outro IP
  const existingIp = activeProfileIps.get(profile.id);
  if (existingIp) {
    throw new Error('Este perfil já está em uso em outro dispositivo');
  }

  // Registra o IP atual
  const currentIp = await getCurrentIp();
  activeProfileIps.set(profile.id, currentIp);

  // Atualiza informações de login
  profile.lastLoginIp = currentIp;
  profile.lastLoginTime = Date.now();

  console.log('Login bem-sucedido:', { user: user.email, profile: profile.name });
  return { user, profile };
}

export async function register(data: RegisterData): Promise<User> {
  console.log('Tentativa de registro:', { email: data.email });
  // Valida se o email já existe
  if (users.some(u => u.email === data.email)) {
    console.log('Email já cadastrado');
    throw new Error('Email já cadastrado');
  }

  // Valida a senha
  if (data.password !== data.confirmPassword) {
    console.log('As senhas não conferem');
    throw new Error('As senhas não conferem');
  }

  const newUser: User = {
    id: (users.length + 1).toString(),
    email: data.email,
    password: simpleHash(data.password),
    isAdmin: false,
    profiles: [
      {
        id: Date.now().toString(),
        name: data.profileName,
        email: data.email,
        isActive: true,
        createdAt: Date.now(),
      }
    ],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  users.push(newUser);
  console.log('Registro bem-sucedido:', { user: newUser.email });
  return newUser;
}

export async function logout(profileId: string): Promise<void> {
  console.log('Tentativa de logout:', { profileId });
  // Remove o IP ativo do perfil
  activeProfileIps.delete(profileId);
  console.log('Logout bem-sucedido:', { profileId });
}

export async function addProfile(userId: string, profileData: ProfileData): Promise<Profile> {
  console.log('Tentativa de adicionar perfil:', { userId, profileData });
  const user = users.find(u => u.id === userId);
  if (!user) {
    console.log('Usuário não encontrado');
    throw new Error('Usuário não encontrado');
  }

  if (user.profiles.length >= 3) {
    console.log('Limite máximo de perfis atingido');
    throw new Error('Limite máximo de perfis atingido');
  }

  if (user.profiles.some(p => p.email === profileData.email)) {
    console.log('Email já utilizado em outro perfil');
    throw new Error('Email já utilizado em outro perfil');
  }

  const newProfile: Profile = {
    id: Date.now().toString(),
    name: profileData.name,
    email: profileData.email,
    avatar: profileData.avatar,
    isActive: true,
    createdAt: Date.now(),
  };

  user.profiles.push(newProfile);
  user.updatedAt = Date.now();
  console.log('Perfil adicionado com sucesso:', { userId, profileId: newProfile.id });
  return newProfile;
}

// Função auxiliar para obter o IP do usuário
async function getCurrentIp(): Promise<string> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    console.log('IP obtido:', data.ip);
    return data.ip;
  } catch (error) {
    console.error('Erro ao obter IP:', error);
    return 'unknown';
  }
}
