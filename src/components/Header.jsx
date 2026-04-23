import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Menu, X, Sun, Moon, User, LogOut, LayoutDashboard, ChevronRight, CreditCard, Building2 } from 'lucide-react';
import { ThemeContext } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useProveedorAuth } from '@/contexts/ProveedorAuthContext';
import { useContactModal } from '@/contexts/ContactModalContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { isAuthenticated, user, logout: clientLogout } = useAuth();
  const { token: isProveedorAuthenticated, proveedor, logout: proveedorLogout } = useProveedorAuth();
  const { openContactModal } = useContactModal();
  const location = useLocation();
  const navigate = useNavigate();

  const isDashboard = location.pathname.startsWith('/portal') || location.pathname.startsWith('/proveedores/dashboard');
  const isPlansPage = location.pathname === '/portal/planes';
  const isProveedorPortal = location.pathname.startsWith('/proveedores/dashboard');

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 20);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setIsOpen(false);

  const handleClientLogout = () => {
    clientLogout();
    closeMenu();
    navigate('/');
  };

  const handleProveedorLogout = () => {
    proveedorLogout();
    closeMenu();
    navigate('/proveedores/login');
  };

  const handleNavClick = (href) => {
    closeMenu();
    
    // Special handling for Contact modal
    if (href === '#contacto') {
      openContactModal();
      return;
    }

    // Direct routing for page links
    if (href.startsWith('/')) {
      navigate(href);
      window.scrollTo(0, 0);
      return;
    }

    // Mapping old "#servicios" link to the new "soluciones" id
    const targetId = href === '#servicios' ? '#soluciones' : href;

    if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
            const element = document.querySelector(targetId);
            if (element) {
                const headerOffset = 80;
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }, 100);
    } else {
        const element = document.querySelector(targetId);
        if (element) {
            const headerOffset = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - headerOffset;
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }
  };

  const navLinks = [
    { name: 'Servicios', href: '#servicios' },
    { name: 'Proyectos', href: '#proyectos' },
    { name: 'Cotizador', href: '/cotizador' },
    { name: 'Asistente IA', href: '#asistente-ia' },
    { name: 'Precios', href: '/precios' },
    { name: 'Proveedores', href: '/proveedores' },
    { name: 'Contacto', href: '#contacto' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-white/5 shadow-lg h-16 md:h-[72px] flex items-center ${
        isScrolled 
          ? 'bg-[#0f0f0f]/95 backdrop-blur-lg border-white/10' 
          : 'bg-[#0f0f0f]/80 backdrop-blur-md border-white/5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center w-full">
          {/* Logo Section */}
          <div className="flex items-center gap-4">
            <Link to="/" onClick={() => handleNavClick('#inicio')} className="flex items-center group">
              <motion.div whileHover={{ scale: 1.05 }} className="flex items-baseline">
                <span className="text-2xl md:text-3xl font-black text-white tracking-tight">
                  IN
                </span>
                <span 
                  className="text-2xl md:text-3xl font-black text-[#d4af37] tracking-tight ml-0.5 drop-shadow-[0_0_8px_rgba(212,175,55,0.3)] transition-all duration-300 group-hover:drop-shadow-[0_0_12px_rgba(212,175,55,0.5)]"
                >
                  MEJORA
                </span>
              </motion.div>
            </Link>

            {/* Breadcrumb / Dashboard Title */}
            {isDashboard && !isProveedorPortal && (
              <div className="hidden md:flex items-center text-sm text-gray-400 border-l border-gray-700 pl-4 ml-4 h-8">
                 <Link to="/portal/dashboard" className="hover:text-white transition-colors">Portal</Link>
                 <ChevronRight className="w-4 h-4 mx-1" />
                 {isPlansPage ? (
                   <>
                     <Link to="/portal/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
                     <ChevronRight className="w-4 h-4 mx-1" />
                     <span className="text-white font-medium">Planes</span>
                   </>
                 ) : (
                   <span className="text-white font-medium">Dashboard</span>
                 )}
              </div>
            )}
            
            {isProveedorPortal && (
              <div className="hidden md:flex items-center text-sm text-gray-400 border-l border-gray-700 pl-4 ml-4 h-8">
                 <span className="text-white font-medium flex items-center gap-2">
                   <Building2 className="w-4 h-4 text-[#d4af37]" /> Proveedores
                 </span>
              </div>
            )}
          </div>

          {/* Desktop Navigation (Hide on Dashboard) */}
          {!isDashboard && (
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              {navLinks.map(link => (
                <button 
                  key={link.name} 
                  onClick={() => handleNavClick(link.href)} 
                  className={`text-sm xl:text-base font-medium transition-colors duration-300 relative group py-2 ${
                    location.pathname === link.href ? 'text-[#d4af37]' : 'text-white hover:text-[#d4af37]'
                  }`}
                >
                  {link.name}
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-[#d4af37] transition-all duration-300 ${
                    location.pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </button>
              ))}
            </nav>
          )}

          {/* Actions Section */}
          <div className="flex items-center gap-3 md:gap-6">
            <Button
                onClick={toggleTheme}
                variant="ghost"
                size="icon"
                className="text-gray-300 hover:bg-white/10 hover:text-[#d4af37] h-9 w-9 md:h-10 md:w-10 rounded-full transition-colors duration-300 hidden md:flex"
                aria-label="Toggle theme"
            >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
            
            {/* Show Provider Auth over Client Auth if in Proveedores flow */}
            {isProveedorAuthenticated ? (
               <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white hover:text-[#d4af37] hover:bg-white/10 pl-2 pr-4">
                    <div className="w-8 h-8 rounded-full bg-[#d4af37]/20 flex items-center justify-center mr-2 border border-[#d4af37]/50">
                        <Building2 className="h-4 w-4 text-[#d4af37]" />
                    </div>
                    <span className="hidden md:inline-block max-w-[150px] truncate">{proveedor?.nombre || 'Proveedor'}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-[#1a1a1a] border-[#333] text-white" align="end">
                  <DropdownMenuLabel>Hola, {proveedor?.nombre}</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-[#333]" />
                  <DropdownMenuItem onClick={() => navigate('/proveedores/dashboard')} className="cursor-pointer hover:bg-white/5 focus:bg-white/5">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard Proveedor</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleProveedorLogout} className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-white/5 focus:bg-white/5">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar Sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : isAuthenticated ? (
               <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white hover:text-[#d4af37] hover:bg-white/10 pl-2 pr-4">
                    <div className="w-8 h-8 rounded-full bg-[#d4af37]/20 flex items-center justify-center mr-2 border border-[#d4af37]/50">
                        <User className="h-4 w-4 text-[#d4af37]" />
                    </div>
                    <span className="hidden md:inline-block max-w-[100px] truncate">{user?.name || 'Mi Cuenta'}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-[#1a1a1a] border-[#333] text-white" align="end">
                  <DropdownMenuLabel>Hola, {user?.name || 'Usuario'}</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-[#333]" />
                  <DropdownMenuItem onClick={() => navigate('/portal/dashboard')} className="cursor-pointer hover:bg-white/5 focus:bg-white/5">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard Cliente</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/precios')} className="cursor-pointer hover:bg-white/5 focus:bg-white/5">
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Planes</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleClientLogout} className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-white/5 focus:bg-white/5">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar Sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                  {location.pathname.startsWith('/proveedores') ? (
                    <Link to="/proveedores/login">
                      <Button variant="ghost" className="text-white hover:text-[#d4af37] hover:bg-white/10 flex items-center gap-2">
                          <Building2 className="w-4 h-4" /> Ingresar como proveedor
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Link to="/login">
                        <Button variant="ghost" className="text-white hover:text-[#d4af37] hover:bg-white/10">
                            Iniciar Sesión
                        </Button>
                      </Link>
                      <Link to="/registro">
                        <Button className="bg-[#d4af37] text-black hover:bg-[#b5952f] font-semibold animate-button-glow hover:shadow-[0_0_50px_rgba(212,175,55,0.8)] transition-all duration-300">
                            Registrarme
                        </Button>
                      </Link>
                    </>
                  )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <Button 
                onClick={() => setIsOpen(!isOpen)} 
                variant="ghost" 
                size="icon" 
                className="text-white hover:text-[#d4af37] hover:bg-white/10 h-10 w-10 p-2 rounded-lg transition-colors"
                aria-label="Menu"
              >
                {isOpen ? <X size={26} /> : <Menu size={26} />}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="lg:hidden bg-[#0f0f0f]/95 backdrop-blur-xl border-t border-white/10 overflow-hidden absolute w-full left-0 top-[64px] shadow-2xl"
        >
          <nav className="flex flex-col items-center py-8 space-y-2 px-6 h-[calc(100vh-64px)] overflow-y-auto">
            {!isDashboard && navLinks.map(link => (
              <button 
                key={link.name} 
                onClick={() => handleNavClick(link.href)} 
                className={`text-lg font-medium hover:text-[#d4af37] active:text-[#d4af37] hover:bg-white/5 w-full text-center py-4 rounded-xl transition-all duration-200 ${
                  location.pathname === link.href ? 'text-[#d4af37] bg-white/5' : 'text-gray-200'
                }`}
              >
                {link.name}
              </button>
            ))}

            <div className="w-full pt-6 mt-4 border-t border-white/10 flex flex-col gap-4">
              {isProveedorAuthenticated ? (
                <>
                    <Button 
                        variant="ghost"
                        onClick={() => { closeMenu(); navigate('/proveedores/dashboard'); }} 
                        className="text-lg font-medium text-white hover:text-[#d4af37] w-full justify-start"
                    >
                        <LayoutDashboard className="mr-2 h-5 w-5" />
                        Dashboard Proveedor
                    </Button>
                    <Button 
                        variant="ghost"
                        onClick={handleProveedorLogout}
                        className="text-lg font-medium text-red-400 hover:text-red-300 w-full justify-start"
                    >
                        <LogOut className="mr-2 h-5 w-5" />
                        Cerrar Sesión Proveedor
                    </Button>
                </>
              ) : isAuthenticated ? (
                 <>
                    <Button 
                        variant="ghost"
                        onClick={() => { closeMenu(); navigate('/portal/dashboard'); }} 
                        className="text-lg font-medium text-white hover:text-[#d4af37] w-full justify-start"
                    >
                        <LayoutDashboard className="mr-2 h-5 w-5" />
                        Mi Dashboard
                    </Button>
                    <Button 
                        variant="ghost"
                        onClick={() => { closeMenu(); navigate('/precios'); }} 
                        className="text-lg font-medium text-white hover:text-[#d4af37] w-full justify-start"
                    >
                        <CreditCard className="mr-2 h-5 w-5" />
                        Planes
                    </Button>
                    <Button 
                        variant="ghost"
                        onClick={handleClientLogout}
                        className="text-lg font-medium text-red-400 hover:text-red-300 w-full justify-start"
                    >
                        <LogOut className="mr-2 h-5 w-5" />
                        Cerrar Sesión
                    </Button>
                 </>
              ) : (
                <>
                    {location.pathname.startsWith('/proveedores') ? (
                      <Link to="/proveedores/login" onClick={closeMenu} className="w-full">
                        <Button variant="ghost" className="text-lg font-medium text-[#d4af37] hover:bg-[#d4af37]/10 w-full">
                            <Building2 className="mr-2 h-5 w-5" /> Ingresar como Proveedor
                        </Button>
                      </Link>
                    ) : (
                      <>
                        <Link to="/login" onClick={closeMenu} className="w-full">
                            <Button variant="ghost" className="text-lg font-medium text-white hover:text-[#d4af37] w-full">
                                Iniciar Sesión
                            </Button>
                        </Link>
                        <Link to="/registro" onClick={closeMenu} className="w-full">
                            <Button className="bg-[#d4af37] text-black hover:bg-[#b5952f] font-bold text-lg w-full py-6 animate-button-glow hover:shadow-[0_0_50px_rgba(212,175,55,0.8)] transition-all duration-300">
                                Registrarme
                            </Button>
                        </Link>
                      </>
                    )}
                </>
              )}
            </div>
          </nav>
        </motion.div>
      )}
      </AnimatePresence>
    </header>
  );
};

export default Header;