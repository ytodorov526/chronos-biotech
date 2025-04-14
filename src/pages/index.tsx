import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-primary-100">
      <Head>
        <title>Chronos Biotech - Health Optimization Tools</title>
        <meta name="description" content="Advanced health optimization tools for monitoring and improving your biometrics" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-10">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-primary-800 mb-8">
          Chronos Biotech <span className="text-primary-600">Health Optimization</span>
        </h1>
        
        <p className="text-xl text-center text-secondary-700 max-w-3xl mx-auto mb-12">
          Advanced biomarker analysis and health optimization tools to help you understand and improve your biological health.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <ToolCard 
            title="Biological Age Calculator" 
            description="Calculate your biological age based on common biomarkers"
            link="/tools/bio-age-calculator"
          />
          <ToolCard 
            title="Cardiovascular Risk Assessment" 
            description="Evaluate your cardiovascular health and risk factors"
            link="/tools/cardiovascular-risk"
          />
          <ToolCard 
            title="Metabolic Health Score" 
            description="Analyze your metabolic health markers and get personalized insights"
            link="/tools/metabolic-health"
          />
          <ToolCard 
            title="Body Composition Analysis" 
            description="Track and optimize your body composition metrics"
            link="/tools/body-composition"
          />
          <ToolCard 
            title="Hormone Optimization" 
            description="Analyze hormone levels and get optimization recommendations"
            link="/tools/hormone-optimization"
          />
          <ToolCard 
            title="Sleep Quality Analysis" 
            description="Evaluate sleep quality metrics and improve recovery"
            link="/tools/sleep-analysis"
          />
        </div>
      </main>

      <footer className="py-8 bg-secondary-800 text-white text-center">
        <p>© {new Date().getFullYear()} Chronos Biotech. All rights reserved.</p>
      </footer>
    </div>
  );
}

function ToolCard({ title, description, link }: { title: string; description: string; link: string }) {
  return (
    <Link href={link} className="block">
      <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 h-full">
        <h2 className="text-xl font-semibold text-primary-700 mb-3">{title}</h2>
        <p className="text-secondary-600">{description}</p>
      </div>
    </Link>
  );
}
