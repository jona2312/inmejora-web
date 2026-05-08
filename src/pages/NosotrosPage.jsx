import SEOHead from '@/components/SEOHead';
import { motion } from 'framer-motion';
import { Award, Users, Zap, Heart, MapPin, CheckCircle } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.5, ease: 'easeOut' } })
};

const team = [
  {
    name: 'Jonatan Bravo',
    role: 'Fundador & Director de Proyectos',
    bio: 'Más de 10 años transformando espacios en la Zona Sur del GBA. Especialista en renders arquitectónicos y gestión integral de reformas.',
    initials: 'JB',
    color: '#d4af37'
  },
  {
    name: 'Equipo de Diseño',
    role: 'Arquitectos & Diseñadores de Interiores',
    bio: 'Profesionales matriculados que combinan estética contemporánea con soluciones funcionales adaptadas a cada cliente y presupuesto.',
    initials: 'DI',
    color: '#c8a227'
  },
  {
    name: 'Equipo Técnico',
    role: 'Maestros & Especialistas en Obra',
    bio: 'Artesanos y técnicos certificados con experiencia en carpintería, electricidad, plomería, pintura y terminaciones de alta calidad.',
    initials: 'ET',
    color: '#b8921e'
  }
];

const values = [
  { icon: Award, title: 'Calidad garantizada', desc: 'Cada proyecto pasa por controles rigurosos antes de la entrega final.' },
  { icon: Zap, title: 'Tecnología IA', desc: 'Renders fotorrealistas para que veas tu espacio antes de invertir un peso.' },
  { icon: Heart, title: 'Compromiso real', desc: 'Acompañamos cada etapa: diseño, obra, materiales y post-entrega.' },
  { icon: Users, title: 'Equipo humano', desc: 'Trato directo, sin intermediarios. Tu proyecto, nuestra prioridad.' }
];

const stats = [
  { num: '200+', label: 'Proyectos completados' },
  { num: '10+', label: 'Años de experiencia' },
  { num: '98%', label: 'Clientes satisfechos' },
  { num: '15+', label: 'Municipios atendidos' }
];

export default function NosotrosPage() {
  return (
    <>
      <SEOHead
        title="Nosotros - INMEJORA | Reformas y Diseño de Interiores"
        description="Conocé al equipo de INMEJORA: más de 10 años transformando hogares y espacios en la Zona Sur del GBA con tecnología IA, renders 3D y obra de calidad."
        ogUrl="https://inmejora.com/nosotros"
      />

      {/* Hero */}
      <section className="relative bg-[#0d0d0d] overflow-hidden pt-28 pb-20 px-4">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #d4af37 0%, transparent 60%)' }} />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.p
            variants={fadeUp} initial="hidden" animate="show" custom={0}
            className="text-[#d4af37] text-sm font-semibold tracking-widest uppercase mb-4"
          >
            Quiénes somos
          </motion.p>
          <motion.h1
            variants={fadeUp} initial="hidden" animate="show" custom={1}
            className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6"
          >
            Transformamos espacios con{' '}
            <span className="text-[#d4af37]">pasión y tecnología</span>
          </motion.h1>
          <motion.p
            variants={fadeUp} initial="hidden" animate="show" custom={2}
            className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed"
          >
            INMEJORA nació con una misión clara: que cada persona pueda reformar su hogar
            con confianza, visualizando el resultado antes de comenzar la obra.
          </motion.p>
          <motion.div
            variants={fadeUp} initial="hidden" animate="show" custom={3}
            className="flex items-center justify-center gap-2 mt-6 text-gray-500 text-sm"
          >
            <MapPin className="w-4 h-4 text-[#d4af37]" />
            <span>Zona Sur, Buenos Aires — atendemos todo el GBA</span>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#111] py-14 px-4 border-y border-[#d4af37]/10">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s, i) => (
            <motion.div key={s.label} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i}>
              <p className="text-4xl font-bold text-[#d4af37] mb-1">{s.num}</p>
              <p className="text-gray-400 text-sm">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Historia */}
      <section className="bg-[#0d0d0d] py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="text-3xl font-bold text-white mb-6 text-center"
          >
            Nuestra historia
          </motion.h2>
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={1}
            className="space-y-4 text-gray-400 leading-relaxed text-base"
          >
            <p>
              Todo empezó con una pregunta simple: <em className="text-white">&ldquo;¿Por qué los propietarios tienen que imaginar cómo quedará su reforma?&rdquo;</em>
              La incertidumbre era el mayor freno a la hora de invertir en el hogar.
            </p>
            <p>
              Fundamos INMEJORA para cambiar eso. Incorporamos tecnología de renders
              fotorrealistas e inteligencia artificial para que cada cliente pueda
              <strong className="text-white"> ver su espacio transformado antes de gastar el primer peso en obra</strong>.
            </p>
            <p>
              Hoy somos el puente entre el diseño de interiores profesional y la ejecución
              artesanal de calidad en la Zona Sur del GBA, con más de 200 proyectos
              entregados y una red de más de 50 proveedores verificados.
            </p>
          </motion.div>
          <motion.ul
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={2}
            className="mt-8 space-y-3"
          >
            {[
              'Renders 3D fotorrealistas incluidos en todos los proyectos',
              'Cotizador online transparente sin sorpresas de precio',
              'Proveedores verificados con garantía de materiales',
              'Gestión integral: diseño, compras, obra y terminaciones'
            ].map(item => (
              <li key={item} className="flex items-start gap-3 text-gray-300">
                <CheckCircle className="w-5 h-5 text-[#d4af37] mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </motion.ul>
        </div>
      </section>

      {/* Valores */}
      <section className="bg-[#111] py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="text-3xl font-bold text-white text-center mb-12"
          >
            Nuestros valores
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i}
                className="bg-[#1a1a1a] border border-[#d4af37]/10 rounded-xl p-6 hover:border-[#d4af37]/40 transition-colors"
              >
                <div className="w-11 h-11 rounded-lg bg-[#d4af37]/10 flex items-center justify-center mb-4">
                  <v.icon className="w-5 h-5 text-[#d4af37]" />
                </div>
                <h3 className="text-white font-semibold mb-2">{v.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipo */}
      <section className="bg-[#0d0d0d] py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="text-3xl font-bold text-white text-center mb-12"
          >
            El equipo
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i}
                className="bg-[#111] border border-[#d4af37]/10 rounded-xl p-8 text-center hover:border-[#d4af37]/30 transition-colors"
              >
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold text-[#0d0d0d]"
                  style={{ backgroundColor: member.color }}
                >
                  {member.initials}
                </div>
                <h3 className="text-white font-semibold text-lg mb-1">{member.name}</h3>
                <p className="text-[#d4af37] text-sm mb-3">{member.role}</p>
                <p className="text-gray-400 text-sm leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#111] py-20 px-4 border-t border-[#d4af37]/10">
        <div className="max-w-2xl mx-auto text-center">
          <motion.h2
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="text-3xl font-bold text-white mb-4"
          >
            ¿Listo para transformar tu espacio?
          </motion.h2>
          <motion.p
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={1}
            className="text-gray-400 mb-8"
          >
            Pedí tu presupuesto sin compromiso y recibí tu render 3D.
          </motion.p>
          <motion.a
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={2}
            href="/cotizador"
            className="inline-block bg-[#d4af37] text-[#0d0d0d] font-bold px-8 py-3 rounded-lg hover:bg-[#c8a227] transition-colors text-base"
          >
            Cotizá tu reforma gratis
          </motion.a>
        </div>
      </section>
    </>
  );
}
