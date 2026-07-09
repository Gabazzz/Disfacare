import React, { useState } from 'react';
import { 
  Users, 
  Activity, 
  ShieldAlert, 
  Database, 
  Plus, 
  Search, 
  Trash2, 
  Lock, 
  CheckCircle,
  Building,
  Server,
  RefreshCw
} from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';

export const AdminDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Mock Admin Users
  const [users, setUsers] = useState([
    { id: 'usr-1', name: 'Dra. Ana Costa', role: 'Fonoaudiólogo', status: 'Ativo', patients: 12, clinic: 'Clinica Central' },
    { id: 'usr-2', name: 'Dr. Bruno Santos', role: 'Fonoaudiólogo', status: 'Ativo', patients: 8, clinic: 'MedSul' },
    { id: 'usr-3', name: 'Lúcia Medeiros', role: 'Cuidador', status: 'Ativo', patients: 1, clinic: 'Particular' },
    { id: 'usr-4', name: 'João dos Santos', role: 'Paciente', status: 'Ativo', patients: 0, clinic: 'Particular' },
    { id: 'usr-5', name: 'Dra. Clara Melo', role: 'Fonoaudiólogo', status: 'Pendente', patients: 0, clinic: 'Hosp. Albert Einstein' },
  ]);

  // Mock Logs
  const logs = [
    { time: '10:42:15', type: 'INFO', msg: 'Backup automático do banco de dados concluído com sucesso.' },
    { time: '09:15:30', type: 'WARN', msg: 'Tentativa de login malsucedida do IP 192.168.1.105.' },
    { time: '08:02:11', type: 'INFO', msg: 'API Gateway sincronizado com sucesso.' },
    { time: 'Ontem 18:30:45', type: 'ERROR', msg: 'Erro de conexão com o microsserviço de notificações.' }
  ];

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setSuccessMsg('Sincronização global concluída!');
      setTimeout(() => setSuccessMsg(null), 3000);
    }, 1500);
  };

  const handleDeleteUser = (id: string) => {
    if (confirm('Tem certeza de que deseja remover este usuário do sistema?')) {
      setUsers(prev => prev.filter(u => u.id !== id));
      setSuccessMsg('Usuário removido com sucesso!');
      setTimeout(() => setSuccessMsg(null), 3000);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.clinic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in pb-20 md:pb-6">
      
      {/* Welcome & Global Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-card shadow-premium border border-gray-100">
        <div>
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full border border-gray-250">
            Painel do Administrador
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-primary mt-3">
            Controle do Sistema
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Gerencie o banco de dados global, auditabilidade de acesso e credenciais da plataforma DISFACARE.
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={handleSync} 
            variant="inverted" 
            className="!py-2.5 !px-4 !h-11 text-xs shrink-0 flex items-center gap-2"
            disabled={syncing}
          >
            <RefreshCw className={`w-4 h-4 text-primary ${syncing ? 'animate-spin' : ''}`} />
            Sincronizar API
          </Button>
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-250 text-[#16A34A] text-xs font-semibold p-3.5 rounded-btn text-center animate-pulse flex items-center justify-center gap-2 shadow-sm">
          <CheckCircle className="w-4 h-4" />
          {successMsg}
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Usuários Cadastrados', val: users.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { title: 'Clínicas Parceiras', val: 4, icon: Building, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { title: 'Tamanho DB', val: '4.8 GB', icon: Database, color: 'text-amber-600', bg: 'bg-amber-50' },
          { title: 'Uptime Servidor', val: '99.98%', icon: Server, color: 'text-purple-600', bg: 'bg-purple-50' }
        ].map((met, idx) => {
          const Icon = met.icon;
          return (
            <Card key={idx} className="flex items-center gap-4 !p-4.5">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${met.bg} ${met.color}`}>
                <Icon className="w-5.5 h-5.5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider block">{met.title}</span>
                <span className="text-lg font-black text-primary block mt-0.5">{met.val}</span>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Main Admin Section Grid */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Users Administration Table (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-white rounded-card p-5 border border-gray-100 shadow-premium flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <h2 className="text-base font-extrabold text-primary uppercase tracking-wider flex items-center gap-2">
                <Users className="w-5 h-5 text-tertiary" />
                Usuários da Plataforma
              </h2>
              
              {/* Search bar */}
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                <input
                  type="text"
                  placeholder="Buscar usuário, função..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9.5 pr-4 py-2 text-xs border border-gray-200 rounded-btn bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>

            <div className="overflow-x-auto border border-gray-100 rounded-btn">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-gray-50 text-text-secondary uppercase tracking-wider font-extrabold border-b border-gray-100">
                    <th className="py-3 px-4">Nome</th>
                    <th className="py-3 px-4">Função</th>
                    <th className="py-3 px-4">Unidade / Clínica</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="font-semibold text-text-primary divide-y divide-gray-100">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-4">{user.name}</td>
                      <td className="py-3 px-4 text-text-secondary">{user.role}</td>
                      <td className="py-3 px-4 text-text-secondary">{user.clinic}</td>
                      <td className="py-3 px-4">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          user.status === 'Ativo' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-critical hover:text-red-800 p-1.5 rounded-btn hover:bg-red-50 transition-all"
                          title="Remover Usuário"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Side: Logs Audits (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <Card className="flex flex-col gap-4">
            <h2 className="text-base font-extrabold text-primary uppercase tracking-wider flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-critical animate-pulse" />
              Eventos Recentes
            </h2>
            
            <div className="flex flex-col gap-3 font-mono text-[11px]">
              {logs.map((log, idx) => (
                <div key={idx} className="p-3 bg-gray-50 rounded-btn border border-gray-100 flex flex-col gap-1.5">
                  <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-text-secondary">{log.time}</span>
                    <span className={`px-1.5 py-0.2 rounded font-extrabold ${
                      log.type === 'INFO' ? 'text-emerald-600 bg-emerald-50' : log.type === 'WARN' ? 'text-amber-600 bg-amber-50' : 'text-critical bg-red-50'
                    }`}>
                      {log.type}
                    </span>
                  </div>
                  <p className="text-text-primary leading-normal font-medium">{log.msg}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
