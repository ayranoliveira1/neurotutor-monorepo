import {
  Brain,
  Target,
  Sparkles,
  TrendingUp,
  GraduationCap,
  Lightbulb,
} from 'lucide-react'

interface FeatureItem {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
}

const features: FeatureItem[] = [
  {
    icon: Brain,
    title: 'Repetição Espaçada',
    description:
      'Algoritmos inteligentes que otimizam seus intervalos de revisão para máxima retenção',
  },
  {
    icon: Target,
    title: 'Planos Personalizados',
    description:
      'Cronogramas adaptados ao seu ritmo, metas e estilo de aprendizagem',
  },
  {
    icon: TrendingUp,
    title: 'Métricas de Progresso',
    description:
      'Acompanhe sua evolução com relatórios detalhados e insights práticos',
  },
  {
    icon: Lightbulb,
    title: 'Flashcards com IA',
    description:
      'Geração automática de cards inteligentes a partir do seu material de estudo',
  },
]

interface StatItem {
  value: string
  label: string
}

const stats: StatItem[] = [
  { value: '50mil+', label: 'Estudantes ativos' },
  { value: '2x', label: 'Mais retenção' },
  { value: '98%', label: 'Aprovação' },
]

export function AuthBrandingPanel() {
  return (
    <div className="relative hidden overflow-hidden bg-linear-to-br from-primary via-primary to-primary/80 px-10 py-10 text-primary-foreground lg:flex lg:flex-col lg:justify-between xl:px-16">
      {/* Decorative background elements */}
      <div className="animate-pulse-glow absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary-foreground/10 blur-3xl" />
      <div className="animate-pulse-glow absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-primary-foreground/8 blur-3xl" />
      <div className="animate-float absolute right-1/4 top-1/3 h-3 w-3 rounded-full bg-primary-foreground/30" />
      <div className="animate-float-delayed absolute left-1/3 top-2/3 h-2 w-2 rounded-full bg-primary-foreground/20" />
      <div className="animate-float-slow absolute right-1/3 bottom-1/4 h-4 w-4 rounded-full bg-primary-foreground/15" />

      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Logo */}
      <div className="relative">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-foreground/15 backdrop-blur-sm">
            <GraduationCap className="h-6 w-6" />
          </div>
          <span className="font-serif text-2xl font-bold tracking-tight">
            NeuroTutor
          </span>
        </div>
      </div>

      {/* Hero content */}
      <div className="relative space-y-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
          <Sparkles className="h-4 w-4" />
          Potencializado por IA
        </div>

        <div className="space-y-4">
          <h2 className="font-serif text-4xl font-bold leading-[1.15] tracking-tight xl:text-5xl">
            Seu cérebro merece
            <br />
            <span className="text-primary-foreground/90">
              a melhor estratégia.
            </span>
          </h2>
          <p className="text-lg leading-relaxed text-primary-foreground/75">
            Transforme horas de estudo em resultados reais. O NeuroTutor usa
            ciência cognitiva e inteligência artificial para você aprender mais,
            em menos tempo.
          </p>
        </div>

        {/* Stats */}
        <div className="flex gap-8">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
              <p className="text-sm text-primary-foreground/60">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group space-y-2.5 rounded-2xl border border-primary-foreground/10 bg-primary-foreground/[0.07] p-5 backdrop-blur-sm transition-colors duration-300 hover:bg-primary-foreground/12"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary-foreground/15 p-2 transition-colors duration-300 group-hover:bg-primary-foreground/20">
                  <feature.icon className="h-5 w-5" />
                </div>
                <p className="font-semibold leading-tight">{feature.title}</p>
              </div>
              <p className="text-sm leading-relaxed text-primary-foreground/60">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Social proof + copyright */}
      <div className="relative space-y-6">
        <div className="rounded-2xl border border-primary-foreground/10 bg-primary-foreground/[0.07] p-5 backdrop-blur-sm">
          <p className="text-sm italic leading-relaxed text-primary-foreground/80">
            &ldquo;Em 3 meses usando o NeuroTutor, consegui a aprovação que
            busquei por 2 anos. A repetição espaçada mudou completamente minha
            forma de estudar.&rdquo;
          </p>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-foreground/20 text-xs font-bold">
              ML
            </div>
            <div>
              <p className="text-sm font-semibold">Marina Lima</p>
              <p className="text-xs text-primary-foreground/50">
                Aprovada em Medicina - UNICAMP
              </p>
            </div>
          </div>
        </div>

        <p className="text-sm text-primary-foreground/40">
          &copy; {new Date().getFullYear()} NeuroTutor. Todos os direitos
          reservados.
        </p>
      </div>
    </div>
  )
}
