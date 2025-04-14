import Layout from '@/components/Layout';

export default function About() {
  return (
    <Layout title="About | Chronos Biotech">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-primary-800 mb-6">About Chronos Biotech</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-primary-700 mb-4">Our Mission</h2>
          <p className="text-lg text-secondary-700 mb-6">
            Chronos Biotech is dedicated to empowering individuals with personalized insights into their 
            health metrics. We believe that data-driven approaches to health optimization can help people 
            live longer, healthier lives.
          </p>
          
          <h2 className="text-2xl font-semibold text-primary-700 mb-4">Our Approach</h2>
          <p className="text-lg text-secondary-700 mb-6">
            We develop tools that translate complex biomedical research into practical, actionable insights. 
            Our calculators and analyzers are based on peer-reviewed scientific research and clinical guidelines.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 mb-6">
            <div className="card">
              <h3 className="text-xl font-semibold text-primary-700 mb-3">Precision Health</h3>
              <p className="text-secondary-700">
                We focus on providing personalized insights rather than one-size-fits-all recommendations. 
                Our tools take into account your unique biomarkers and metrics to deliver relevant guidance.
              </p>
            </div>
            
            <div className="card">
              <h3 className="text-xl font-semibold text-primary-700 mb-3">Evidence-Based</h3>
              <p className="text-secondary-700">
                All of our health calculators and analyzers are based on established scientific research 
                and validated methodologies from the fields of medicine, nutritional science, and exercise physiology.
              </p>
            </div>
            
            <div className="card">
              <h3 className="text-xl font-semibold text-primary-700 mb-3">Holistic View</h3>
              <p className="text-secondary-700">
                We look at health from multiple angles: metabolic, cardiovascular, hormonal, and more. 
                This comprehensive approach provides a more complete picture of your overall health status.
              </p>
            </div>
            
            <div className="card">
              <h3 className="text-xl font-semibold text-primary-700 mb-3">Actionable Insights</h3>
              <p className="text-secondary-700">
                Beyond just providing data, we offer specific recommendations and strategies to help you 
                improve your health metrics and achieve your wellness goals.
              </p>
            </div>
          </div>
          
          <h2 className="text-2xl font-semibold text-primary-700 mb-4">Our Tools</h2>
          <p className="text-lg text-secondary-700 mb-6">
            We've developed a suite of health optimization tools to help you understand and improve different aspects of your health:
          </p>
          
          <div className="space-y-4 mb-8">
            <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
              <h3 className="text-lg font-semibold text-primary-700 mb-1">Biological Age Calculator</h3>
              <p className="text-secondary-700">
                Calculates your biological age based on key biomarkers, providing insights into how your lifestyle and health status are affecting your aging process.
              </p>
            </div>
            
            <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
              <h3 className="text-lg font-semibold text-primary-700 mb-1">Cardiovascular Risk Assessment</h3>
              <p className="text-secondary-700">
                Evaluates your 10-year risk of developing cardiovascular disease based on established risk models and provides targeted recommendations.
              </p>
            </div>
            
            <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
              <h3 className="text-lg font-semibold text-primary-700 mb-1">Metabolic Health Score</h3>
              <p className="text-secondary-700">
                Provides a comprehensive assessment of your metabolic health by analyzing key biomarkers related to glucose regulation, insulin sensitivity, and more.
              </p>
            </div>
            
            <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
              <h3 className="text-lg font-semibold text-primary-700 mb-1">Body Composition Analysis</h3>
              <p className="text-secondary-700">
                Analyzes your body composition metrics, including body fat percentage, fat distribution, and muscle mass to provide insights into your physical health.
              </p>
            </div>
          </div>
          
          <h2 className="text-2xl font-semibold text-primary-700 mb-4">Data Privacy</h2>
          <p className="text-lg text-secondary-700 mb-6">
            We prioritize your privacy. All calculations are performed client-side in your browser, 
            and we do not store any of your health data on our servers. Your information remains 
            private and secure.
          </p>
        </div>
        
        <div className="bg-primary-50 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-primary-700 mb-4">Disclaimer</h2>
          <div className="text-secondary-700 space-y-4">
            <p>
              The information provided by Chronos Biotech tools is for educational and informational purposes only. 
              It is not intended to be a substitute for professional medical advice, diagnosis, or treatment.
            </p>
            <p>
              Always seek the advice of your physician or other qualified health provider with any questions 
              you may have regarding a medical condition or health objectives. Never disregard professional 
              medical advice or delay in seeking it because of something you have read on this website.
            </p>
            <p>
              The calculators and tools provided are based on statistical models and general guidelines. 
              They may not account for all individual variations or specific health conditions. Results 
              should be interpreted in consultation with healthcare professionals.
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-primary-700 mb-4">Contact Us</h2>
          <p className="text-lg text-secondary-700 mb-6">
            We welcome your feedback, questions, and suggestions. Please feel free to reach out to us at:
          </p>
          
          <div className="flex items-center mb-4">
            <svg className="w-5 h-5 text-primary-600 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
            </svg>
            <span className="text-secondary-700">info@chronos-biotech.com</span>
          </div>
          
          <div className="flex items-center">
            <svg className="w-5 h-5 text-primary-600 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd"></path>
            </svg>
            <span className="text-secondary-700">www.chronos-biotech.com</span>
          </div>
        </div>
      </div>
    </Layout>
  );
}