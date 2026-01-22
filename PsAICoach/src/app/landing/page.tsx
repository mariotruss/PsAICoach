import Link from 'next/link';

export default function LandingPage() {
  const features = [
    {
      icon: 'fa-brain',
      title: 'AI Companion',
      description: 'Always-available support for reality validation and mental wellness',
      color: 'from-primary to-secondary',
    },
    {
      icon: 'fa-camera',
      title: 'AR Reality Check',
      description: 'Visual validation with timestamp and grid overlay for certainty',
      color: 'from-secondary to-accent',
    },
    {
      icon: 'fa-book-open',
      title: 'Reflective Journal',
      description: 'Track your thoughts, moods, and patterns over time',
      color: 'from-accent to-warning',
    },
    {
      icon: 'fa-tools',
      title: 'CBT Tools',
      description: 'Evidence-based techniques for managing thoughts and emotions',
      color: 'from-warning to-success',
    },
  ];

  const useCases = [
    {
      emoji: '👁️',
      title: 'Reality Validation',
      scenario: 'Sarah uses the AR camera to verify if someone is at her door, getting visual confirmation with timestamp.',
    },
    {
      emoji: '🌙',
      title: 'Late Night Support',
      scenario: 'Alex talks to the AI companion at 2 AM when experiencing anxiety, receiving immediate grounding techniques.',
    },
    {
      emoji: '📝',
      title: 'Daily Reflection',
      scenario: 'Marcus journals every morning to track mood patterns and recognize triggers before they escalate.',
    },
    {
      emoji: '🎯',
      title: 'Thought Reframing',
      scenario: 'Jordan uses CBT tools to identify cognitive distortions and develop healthier thinking patterns.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 animate-ping opacity-75">
                <div className="w-20 h-20 rounded-full bg-primary/30"></div>
              </div>
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <i className="fas fa-brain text-white text-3xl"></i>
              </div>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold">
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              PsAICoSys
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-text-muted max-w-2xl mx-auto">
            Your AI-powered companion for managing psychosis and schizophrenia symptoms
          </p>

          <p className="text-lg text-text max-w-3xl mx-auto leading-relaxed">
            A safe, always-available space for <strong>reality validation</strong>, <strong>therapeutic support</strong>, 
            and <strong>daily reflection</strong>. Built with evidence-based CBT techniques and AR technology.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link
              href="/"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-semibold text-lg hover:scale-105 transition-transform shadow-lg shadow-primary/50"
            >
              <i className="fas fa-rocket mr-2"></i>
              Launch App
            </Link>
            <a
              href="#features"
              className="px-8 py-4 rounded-2xl glass-effect text-text font-semibold text-lg hover:bg-white/10 transition-colors"
            >
              Learn More
              <i className="fas fa-arrow-down ml-2"></i>
            </a>
          </div>

          {/* Crisis Banner */}
          <div className="glass-effect rounded-2xl p-6 max-w-2xl mx-auto mt-12 border border-warning/30">
            <p className="text-sm text-text-muted">
              <strong className="text-warning">Crisis Support:</strong> If you're in crisis, call <a href="tel:988" className="underline text-warning font-semibold">988</a> or text HOME to <a href="sms:741741" className="underline text-warning font-semibold">741741</a>
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              Key Features
            </span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="glass-effect rounded-3xl p-8 hover:bg-white/10 transition-all group"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <i className={`fas ${feature.icon} text-3xl text-white`}></i>
                </div>
                <h3 className="text-2xl font-semibold text-text mb-3">{feature.title}</h3>
                <p className="text-text-muted leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-6">
            <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
              Real Stories, Real Impact
            </span>
          </h2>
          <p className="text-center text-text-muted mb-12 max-w-2xl mx-auto">
            See how PsAICoSys helps people navigate daily challenges with confidence
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {useCases.map((useCase, index) => (
              <div
                key={index}
                className="glass-effect rounded-3xl p-8 border border-white/10"
              >
                <div className="text-5xl mb-4">{useCase.emoji}</div>
                <h3 className="text-xl font-semibold text-text mb-3">{useCase.title}</h3>
                <p className="text-text-muted leading-relaxed italic">"{useCase.scenario}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Ready to Get Started?
            </span>
          </h2>
          <p className="text-xl text-text-muted">
            Join a supportive community focused on wellness and recovery
          </p>
          <Link
            href="/"
            className="inline-block px-10 py-5 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-semibold text-xl hover:scale-105 transition-transform shadow-2xl shadow-primary/50"
          >
            <i className="fas fa-rocket mr-2"></i>
            Launch PsAICoSys
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center text-text-muted text-sm space-y-4">
          <p>
            <strong>Disclaimer:</strong> PsAICoSys is a wellness tool and not a replacement for professional medical care. 
            Always consult with healthcare providers for diagnosis and treatment.
          </p>
          <p className="text-xs">
            © 2025 PsAICoSys • Prototype for research and education
          </p>
        </div>
      </footer>
    </div>
  );
}

