import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Loader2, Filter, RefreshCw, Users, MessageSquare, Briefcase, Star, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

const AdminInmejora = () => {
  const { toast } = useToast();
  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("leads");
  
  const [filters, setFilters] = useState({
    lead_status: '',
    service_type: ''
  });

  const fetchData = async () => {
    setLoading(true);
    
    // Mock data fetching
    setTimeout(() => {
      setLeads([]);
      setUsers([]);
      setTestimonials([]);
      setProjects([]);
      setLoading(false);
    }, 600);
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleDelete = async (table, id) => {
    if(!confirm('¿Estás seguro de que querés borrar este item?')) return;
    
    // Mock delete
    toast({ title: "Eliminado", description: "Elemento eliminado correctamente (Simulado)." });
    fetchData();
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white p-8">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#D4AF37]">Panel Admin - INMEJORA</h1>
            <p className="text-gray-400 mt-1">Gestión de leads, usuarios y contenido (Fase 1)</p>
          </div>
          <Button onClick={fetchData} variant="outline" className="border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800">
            <RefreshCw className="mr-2 h-4 w-4" /> Actualizar Datos
          </Button>
        </div>

        <Tabs defaultValue="leads" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="bg-[#0f0f0f] border border-gray-800 p-1 mb-8 overflow-x-auto flex w-full md:w-auto">
            <TabsTrigger value="leads" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black text-gray-400">
              <MessageSquare className="w-4 h-4 mr-2" /> Consultas
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black text-gray-400">
              <Users className="w-4 h-4 mr-2" /> Usuarios
            </TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black text-gray-400">
              <Briefcase className="w-4 h-4 mr-2" /> Proyectos
            </TabsTrigger>
            <TabsTrigger value="testimonials" className="data-[state=active]:bg-[#D4AF37] data-[state=active]:text-black text-gray-400">
              <Star className="w-4 h-4 mr-2" /> Testimonios
            </TabsTrigger>
          </TabsList>

          <TabsContent value="leads">
            <div className="bg-[#0f0f0f] p-6 rounded-xl border border-gray-800 mb-8 flex flex-wrap gap-6 items-end">
              <div className="flex items-center gap-2 mb-2 w-full text-gray-400">
                <Filter size={18} />
                <span className="font-medium">Filtros de Leads</span>
              </div>
              
              <div className="w-full sm:w-auto flex-1 min-w-[200px]">
                <label className="block text-sm text-gray-500 mb-1">Estado del Lead</label>
                <select
                  name="lead_status"
                  value={filters.lead_status}
                  onChange={handleFilterChange}
                  className="w-full bg-[#1a1a1a] border border-gray-700 rounded-md px-3 py-2 text-sm text-white focus:border-[#D4AF37] outline-none"
                >
                  <option value="">Todos</option>
                  <option value="nuevo">Nuevo</option>
                  <option value="contactado">Contactado</option>
                  <option value="en_proceso">En Proceso</option>
                  <option value="cerrado">Cerrado</option>
                </select>
              </div>

              <div className="w-full sm:w-auto flex-1 min-w-[200px]">
                <label className="block text-sm text-gray-500 mb-1">Tipo de Servicio</label>
                <select
                  name="service_type"
                  value={filters.service_type}
                  onChange={handleFilterChange}
                  className="w-full bg-[#1a1a1a] border border-gray-700 rounded-md px-3 py-2 text-sm text-white focus:border-[#D4AF37] outline-none"
                >
                  <option value="">Todos</option>
                  <option value="general">General</option>
                  <option value="reforma_integral">Reforma Integral</option>
                  <option value="diseno_interior">Diseño Interior</option>
                  <option value="pintura_terminaciones">Pintura</option>
                  <option value="domotica">Domótica</option>
                  <option value="parquizaciones">Parquizaciones</option>
                </select>
              </div>
            </div>

            <div className="bg-[#0f0f0f] rounded-xl border border-gray-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-[#151515] border-b border-gray-800 text-gray-400 text-sm uppercase tracking-wider">
                      <th className="px-6 py-4 font-medium">Fecha</th>
                      <th className="px-6 py-4 font-medium">Nombre</th>
                      <th className="px-6 py-4 font-medium">Contacto</th>
                      <th className="px-6 py-4 font-medium">Detalles Proyecto</th>
                      <th className="px-6 py-4 font-medium">Presupuesto / Fecha</th>
                      <th className="px-6 py-4 font-medium">Estados</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {loading ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                          <div className="flex items-center justify-center gap-2">
                            <Loader2 className="animate-spin" /> Cargando leads...
                          </div>
                        </td>
                      </tr>
                    ) : leads.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                          No se encontraron leads con estos filtros.
                        </td>
                      </tr>
                    ) : (
                      leads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-[#1a1a1a] transition-colors">
                          <td className="px-6 py-4 text-sm text-gray-400 whitespace-nowrap align-top">
                            {format(new Date(lead.created_at), 'dd/MM/yy HH:mm', { locale: es })}
                          </td>
                          <td className="px-6 py-4 text-sm text-white align-top">
                            <div className="font-medium">{lead.full_name}</div>
                            <div className="text-xs text-gray-500 mt-1">{lead.city}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-400 align-top">
                            <div>{lead.email}</div>
                            <div className="text-xs text-gray-500">{lead.whatsapp}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-300 align-top">
                            <div className="mb-1">
                              <span className="text-xs font-semibold text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded">
                                {lead.environment_type || 'N/A'}
                              </span>
                              <span className="ml-2 text-xs bg-gray-800 px-2 py-0.5 rounded">
                                {lead.service_type}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400 line-clamp-2" title={lead.message}>
                              {lead.message}
                            </p>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-400 align-top">
                             <div className="text-xs mb-1"><span className="text-gray-500">Pres:</span> {lead.budget_range || '-'}</div>
                             <div className="text-xs"><span className="text-gray-500">Fecha:</span> {lead.preferred_date || '-'}</div>
                          </td>
                          <td className="px-6 py-4 text-sm align-top space-y-2">
                            <div className="flex gap-2">
                               <span className={`px-2 py-1 rounded text-[10px] font-medium border uppercase ${
                                  lead.lead_status === 'nuevo' ? 'bg-blue-900/30 text-blue-400 border-blue-800' :
                                  lead.lead_status === 'contactado' ? 'bg-yellow-900/30 text-yellow-400 border-yellow-800' :
                                  'bg-gray-800 text-gray-400 border-gray-700'
                               }`}>
                                  {lead.lead_status || 'Nuevo'}
                               </span>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="users">
            <div className="bg-[#0f0f0f] rounded-xl border border-gray-800 overflow-hidden">
               <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-[#151515] border-b border-gray-800 text-gray-400 text-sm uppercase tracking-wider">
                            <th className="px-6 py-4 font-medium">Registrado</th>
                            <th className="px-6 py-4 font-medium">Nombre</th>
                            <th className="px-6 py-4 font-medium">Email</th>
                            <th className="px-6 py-4 font-medium">Newsletter</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {users.map(u => (
                            <tr key={u.id}>
                                <td className="px-6 py-4 text-gray-400">{format(new Date(u.created_at), 'dd/MM/yy', { locale: es })}</td>
                                <td className="px-6 py-4 text-white">{u.full_name || '-'}</td>
                                <td className="px-6 py-4 text-gray-400">{u.email}</td>
                                <td className="px-6 py-4">{u.newsletter_opt_in ? 'Sí' : 'No'}</td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                          <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-500">No hay usuarios registrados.</td></tr>
                        )}
                    </tbody>
                </table>
               </div>
            </div>
          </TabsContent>

          <TabsContent value="projects">
            <div className="bg-[#0f0f0f] p-4 rounded-xl border border-gray-800">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Proyectos (Antes/Después)</h3>
                    <Button size="sm" variant="outline" disabled>+ Agregar Proyecto (Fase 2)</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {projects.map(project => (
                        <div key={project.id} className="bg-[#1a1a1a] p-4 rounded-lg border border-gray-800">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-[#D4AF37]">{project.category}</h4>
                                <Button size="icon" variant="ghost" className="h-6 w-6 text-red-500 hover:text-red-400" onClick={() => handleDelete('projects', project.id)}>
                                    <Trash2 size={14} />
                                </Button>
                            </div>
                            <div className="flex gap-2 mb-2 h-24">
                                <img src={project.before_image_url} className="w-1/2 object-cover rounded" alt="antes" />
                                <img src={project.after_image_url} className="w-1/2 object-cover rounded" alt="despues" />
                            </div>
                            <p className="text-xs text-gray-400">ID: {project.id.slice(0,8)}...</p>
                        </div>
                    ))}
                    {projects.length === 0 && <p className="text-gray-500 text-center py-8">No hay proyectos cargados.</p>}
                </div>
            </div>
          </TabsContent>

          <TabsContent value="testimonials">
            <div className="bg-[#0f0f0f] p-4 rounded-xl border border-gray-800">
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Testimonios</h3>
                    <Button size="sm" variant="outline" disabled>+ Agregar Testimonio (Fase 2)</Button>
                </div>
                <div className="space-y-4">
                    {testimonials.map(t => (
                        <div key={t.id} className="bg-[#1a1a1a] p-4 rounded-lg border border-gray-800 flex justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-bold text-white">{t.name}</h4>
                                    <span className="text-xs text-gray-500">({t.location})</span>
                                    <div className="flex text-yellow-500"><Star size={12} fill="currentColor"/> {t.rating}</div>
                                </div>
                                <p className="text-sm text-gray-300 italic">"{t.text}"</p>
                            </div>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:text-red-400" onClick={() => handleDelete('testimonials', t.id)}>
                                    <Trash2 size={16} />
                            </Button>
                        </div>
                    ))}
                    {testimonials.length === 0 && <p className="text-gray-500 text-center py-8">No hay testimonios cargados.</p>}
                </div>
            </div>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
};

export default AdminInmejora;