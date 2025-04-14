import { useState, ChangeEvent, FormEvent } from 'react';
import Layout from '@/components/Layout';
import FormInput from '@/components/FormInput';
import ResultCard from '@/components/ResultCard';
import BiomarkerRangeIndicator from '@/components/BiomarkerRangeIndicator';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

// Define interfaces for our form and results
interface FormData {
  age: number;
  gender: string;
  glucose: number;
  crp: number;
  albumin: number;
  creatinine: number;
  bun: number;
  alt: number;
  hdl: number;
  ldl: number;
  hba1c: number;
  wbc: number;
}

interface BioAgeResult {
  bioAge: number;
  ageDifference: number;
  status: 'good' | 'warning' | 'danger' | 'neutral';
  interpretation: string;
  biomarkerScores: {
    [key: string]: {
      score: number;
      impact: 'positive' | 'negative' | 'neutral';
      description: string;
    };
  };
}

// Initial form values
const initialFormData: FormData = {
  age: 35,
  gender: 'male',
  glucose: 85,
  crp: 0.8,
  albumin: 4.5,
  creatinine: 0.9,
  bun: 15,
  alt: 20,
  hdl: 60,
  ldl: 100,
  hba1c: 5.2,
  wbc: 5.5,
};

// Normal ranges for biomarkers
const biomarkerRanges = {
  glucose: { min: 70, max: 120, minNormal: 70, maxNormal: 99, unit: 'mg/dL', label: 'Fasting Glucose' },
  crp: { min: 0, max: 10, minNormal: 0, maxNormal: 1.0, unit: 'mg/L', label: 'C-Reactive Protein' },
  albumin: { min: 3.0, max: 6.0, minNormal: 3.5, maxNormal: 5.2, unit: 'g/dL', label: 'Albumin' },
  creatinine: { min: 0.5, max: 2.0, minNormal: 0.6, maxNormal: 1.2, unit: 'mg/dL', label: 'Creatinine' },
  bun: { min: 5, max: 30, minNormal: 7, maxNormal: 20, unit: 'mg/dL', label: 'Blood Urea Nitrogen' },
  alt: { min: 0, max: 100, minNormal: 0, maxNormal: 40, unit: 'U/L', label: 'Alanine Aminotransferase' },
  hdl: { min: 20, max: 100, minNormal: 40, maxNormal: 100, unit: 'mg/dL', label: 'HDL Cholesterol' },
  ldl: { min: 40, max: 200, minNormal: 40, maxNormal: 100, unit: 'mg/dL', label: 'LDL Cholesterol' },
  hba1c: { min: 4.0, max: 12.0, minNormal: 4.0, maxNormal: 5.7, unit: '%', label: 'HbA1c' },
  wbc: { min: 3.0, max: 11.0, minNormal: 4.5, maxNormal: 11.0, unit: 'K/μL', label: 'White Blood Cell Count' },
};

export default function BioAgeCalculator() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [result, setResult] = useState<BioAgeResult | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === 'gender' ? value : Number(value) }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Calculate biological age (this is a simplified algorithm for demonstration)
    const calculateBioAge = (): BioAgeResult => {
      // Starting with chronological age as baseline
      let bioAge = formData.age;
      
      const biomarkerScores: BioAgeResult['biomarkerScores'] = {};
      
      // Glucose impact (high glucose ages you)
      let glucoseImpact = 0;
      if (formData.glucose > 99) glucoseImpact = (formData.glucose - 99) * 0.05;
      biomarkerScores.glucose = {
        score: glucoseImpact,
        impact: glucoseImpact > 0 ? 'negative' : 'neutral',
        description: 'Higher fasting glucose levels are associated with accelerated aging.'
      };
      
      // CRP impact (inflammation ages you)
      let crpImpact = 0;
      if (formData.crp > 1.0) crpImpact = formData.crp * 0.3;
      biomarkerScores.crp = {
        score: crpImpact,
        impact: crpImpact > 0 ? 'negative' : 'neutral',
        description: 'Elevated CRP indicates chronic inflammation, which accelerates aging.'
      };
      
      // Albumin impact (lower albumin ages you)
      let albuminImpact = 0;
      if (formData.albumin < 4.0) albuminImpact = (4.0 - formData.albumin) * 0.5;
      biomarkerScores.albumin = {
        score: albuminImpact,
        impact: albuminImpact > 0 ? 'negative' : 'neutral',
        description: 'Lower albumin levels may indicate reduced liver function and protein status.'
      };
      
      // HDL impact (high HDL makes you younger)
      let hdlImpact = 0;
      if (formData.hdl > 60) hdlImpact = -((formData.hdl - 60) * 0.03);
      biomarkerScores.hdl = {
        score: Math.abs(hdlImpact),
        impact: hdlImpact < 0 ? 'positive' : 'neutral',
        description: 'Higher HDL cholesterol is associated with longevity and better cardiovascular health.'
      };
      
      // LDL impact (high LDL ages you)
      let ldlImpact = 0;
      if (formData.ldl > 100) ldlImpact = (formData.ldl - 100) * 0.02;
      biomarkerScores.ldl = {
        score: ldlImpact,
        impact: ldlImpact > 0 ? 'negative' : 'neutral',
        description: 'Elevated LDL cholesterol increases cardiovascular risk.'
      };
      
      // HbA1c impact (high HbA1c ages you)
      let hba1cImpact = 0;
      if (formData.hba1c > 5.7) hba1cImpact = (formData.hba1c - 5.7) * 0.8;
      biomarkerScores.hba1c = {
        score: hba1cImpact,
        impact: hba1cImpact > 0 ? 'negative' : 'neutral',
        description: 'Higher HbA1c indicates sustained elevated blood sugar over time.'
      };
      
      // Apply all impacts to biological age
      bioAge += glucoseImpact + crpImpact + albuminImpact + hdlImpact + ldlImpact + hba1cImpact;
      
      // Round to 1 decimal place
      bioAge = Math.round(bioAge * 10) / 10;
      
      // Calculate difference from chronological age
      const ageDifference = bioAge - formData.age;
      
      // Determine status based on age difference
      let status: 'good' | 'warning' | 'danger' | 'neutral' = 'neutral';
      if (ageDifference <= -3) status = 'good';
      else if (ageDifference >= 3) status = 'danger';
      else if (ageDifference > 0) status = 'warning';
      
      // Create interpretation text
      let interpretation = '';
      if (ageDifference <= -5) {
        interpretation = 'Excellent! Your biological age is significantly lower than your chronological age. Your biomarkers indicate excellent health and potential longevity.';
      } else if (ageDifference < 0) {
        interpretation = 'Good! Your biological age is lower than your chronological age, suggesting your body is aging slower than average.';
      } else if (ageDifference === 0) {
        interpretation = 'Your biological age matches your chronological age, suggesting normal aging patterns.';
      } else if (ageDifference < 5) {
        interpretation = 'Your biological age is slightly higher than your chronological age. Consider lifestyle modifications to improve key biomarkers.';
      } else {
        interpretation = 'Your biological age is significantly higher than your chronological age. It\'s recommended to consult with a healthcare provider to address the biomarkers that need improvement.';
      }
      
      return {
        bioAge,
        ageDifference,
        status,
        interpretation,
        biomarkerScores
      };
    };
    
    // Set result and show it
    const calculatedResult = calculateBioAge();
    setResult(calculatedResult);
    setShowResults(true);
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setResult(null);
    setShowResults(false);
  };

  // Prepare chart data if we have results
  const chartData = result ? {
    labels: ['Biological Age', 'Chronological Age'],
    datasets: [
      {
        data: [result.bioAge, formData.age],
        backgroundColor: [
          result.status === 'good' ? '#10B981' : result.status === 'warning' ? '#F59E0B' : '#EF4444',
          '#3B82F6',
        ],
        borderWidth: 0,
      },
    ],
  } : null;

  return (
    <Layout title="Biological Age Calculator | Chronos Biotech">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-primary-800 mb-6">Biological Age Calculator</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <p className="text-lg text-secondary-700 mb-6">
            This tool calculates your biological age based on key biomarkers from your blood work. 
            Biological age is a measure of how well your body is functioning relative to your chronological age.
          </p>
          
          {!showResults ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-primary-700 mb-4">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    label="Age"
                    name="age"
                    type="number"
                    value={formData.age}
                    onChange={handleInputChange}
                    required
                    min={18}
                    max={120}
                  />
                  
                  <div className="mb-4">
                    <label htmlFor="gender" className="block text-sm font-medium text-secondary-700 mb-1">
                      Gender
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="input"
                      required
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-primary-700 mb-4">Metabolic Biomarkers</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    label="Fasting Glucose"
                    name="glucose"
                    type="number"
                    value={formData.glucose}
                    onChange={handleInputChange}
                    required
                    min={40}
                    max={300}
                    step={0.1}
                    units="mg/dL"
                    helpText="Normal range: 70-99 mg/dL"
                  />
                  
                  <FormInput
                    label="HbA1c"
                    name="hba1c"
                    type="number"
                    value={formData.hba1c}
                    onChange={handleInputChange}
                    required
                    min={3}
                    max={15}
                    step={0.1}
                    units="%"
                    helpText="Normal range: 4.0-5.7%"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-primary-700 mb-4">Inflammation & Liver</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    label="C-Reactive Protein (CRP)"
                    name="crp"
                    type="number"
                    value={formData.crp}
                    onChange={handleInputChange}
                    required
                    min={0}
                    max={20}
                    step={0.1}
                    units="mg/L"
                    helpText="Normal range: 0-1.0 mg/L"
                  />
                  
                  <FormInput
                    label="Albumin"
                    name="albumin"
                    type="number"
                    value={formData.albumin}
                    onChange={handleInputChange}
                    required
                    min={2}
                    max={6}
                    step={0.1}
                    units="g/dL"
                    helpText="Normal range: 3.5-5.2 g/dL"
                  />
                  
                  <FormInput
                    label="Alanine Aminotransferase (ALT)"
                    name="alt"
                    type="number"
                    value={formData.alt}
                    onChange={handleInputChange}
                    required
                    min={0}
                    max={200}
                    step={0.1}
                    units="U/L"
                    helpText="Normal range: 0-40 U/L"
                  />
                  
                  <FormInput
                    label="White Blood Cell Count"
                    name="wbc"
                    type="number"
                    value={formData.wbc}
                    onChange={handleInputChange}
                    required
                    min={2}
                    max={20}
                    step={0.1}
                    units="K/μL"
                    helpText="Normal range: 4.5-11.0 K/μL"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-primary-700 mb-4">Kidney Function</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    label="Creatinine"
                    name="creatinine"
                    type="number"
                    value={formData.creatinine}
                    onChange={handleInputChange}
                    required
                    min={0.2}
                    max={3}
                    step={0.1}
                    units="mg/dL"
                    helpText="Normal range: 0.6-1.2 mg/dL"
                  />
                  
                  <FormInput
                    label="Blood Urea Nitrogen (BUN)"
                    name="bun"
                    type="number"
                    value={formData.bun}
                    onChange={handleInputChange}
                    required
                    min={5}
                    max={50}
                    step={0.1}
                    units="mg/dL"
                    helpText="Normal range: 7-20 mg/dL"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-primary-700 mb-4">Lipids</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    label="HDL Cholesterol"
                    name="hdl"
                    type="number"
                    value={formData.hdl}
                    onChange={handleInputChange}
                    required
                    min={20}
                    max={120}
                    step={0.1}
                    units="mg/dL"
                    helpText="Healthy range: 40-100 mg/dL"
                  />
                  
                  <FormInput
                    label="LDL Cholesterol"
                    name="ldl"
                    type="number"
                    value={formData.ldl}
                    onChange={handleInputChange}
                    required
                    min={40}
                    max={250}
                    step={0.1}
                    units="mg/dL"
                    helpText="Optimal range: 40-100 mg/dL"
                  />
                </div>
              </div>
              
              <div className="flex justify-center mt-8">
                <button type="submit" className="btn-primary px-8 py-3 text-lg">
                  Calculate Biological Age
                </button>
              </div>
            </form>
          ) : (
            result && (
              <div className="results-container">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="md:col-span-1">
                    <div className="flex justify-center" style={{ maxWidth: '240px', margin: '0 auto' }}>
                      {chartData && (
                        <Doughnut
                          data={chartData}
                          options={{
                            cutout: '70%',
                            plugins: {
                              legend: {
                                position: 'bottom',
                              },
                            },
                          }}
                        />
                      )}
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <ResultCard
                      title="Your Biological Age"
                      value={`${result.bioAge} years`}
                      interpretation={result.interpretation}
                      status={result.status}
                    >
                      <div className="flex items-center mt-2">
                        <span className="text-sm mr-2">Chronological Age:</span>
                        <span className="font-semibold">{formData.age} years</span>
                      </div>
                      <div className="flex items-center mt-1">
                        <span className="text-sm mr-2">Difference:</span>
                        <span className={`font-semibold ${
                          result.ageDifference < 0 
                            ? 'text-green-600' 
                            : result.ageDifference > 0 
                              ? 'text-red-600' 
                              : ''
                        }`}>
                          {result.ageDifference > 0 ? '+' : ''}{result.ageDifference.toFixed(1)} years
                        </span>
                      </div>
                    </ResultCard>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-primary-700 mb-4">Your Key Biomarkers</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                  {Object.entries(biomarkerRanges).map(([key, range]) => {
                    // Safely access formData[key as keyof FormData]
                    const value = formData[key as keyof FormData] as number;
                    return (
                      <BiomarkerRangeIndicator
                        key={key}
                        value={value}
                        min={range.min}
                        max={range.max}
                        minNormal={range.minNormal}
                        maxNormal={range.maxNormal}
                        unit={range.unit}
                        label={range.label}
                      />
                    );
                  })}
                </div>
                
                <h3 className="text-xl font-semibold text-primary-700 mt-8 mb-4">Biomarker Impact Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(result.biomarkerScores)
                    .filter(([_, data]) => data.score > 0) // Only show biomarkers with non-zero impact
                    .sort((a, b) => b[1].score - a[1].score) // Sort by impact, highest first
                    .map(([biomarker, data]) => (
                      <div 
                        key={biomarker} 
                        className={`p-4 rounded-lg border ${
                          data.impact === 'positive' 
                            ? 'border-green-200 bg-green-50' 
                            : 'border-red-200 bg-red-50'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">{biomarkerRanges[biomarker as keyof typeof biomarkerRanges]?.label}</h4>
                          <span 
                            className={`px-2 py-0.5 text-xs rounded-full ${
                              data.impact === 'positive' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {data.impact === 'positive' ? 'Beneficial' : 'Needs Improvement'}
                          </span>
                        </div>
                        <p className="text-sm text-secondary-700">{data.description}</p>
                      </div>
                    ))}
                </div>
                
                <div className="flex justify-center mt-8">
                  <button 
                    onClick={resetForm} 
                    className="btn-secondary mr-4"
                  >
                    Enter New Values
                  </button>
                </div>
              </div>
            )
          )}
        </div>
        
        <div className="bg-primary-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-primary-700 mb-4">About Biological Age</h2>
          <div className="text-secondary-700 space-y-4">
            <p>
              Biological age is a measure of how well your body is functioning compared to your chronological age. It's based on various biomarkers that indicate the health and performance of different body systems.
            </p>
            <p>
              Unlike chronological age, which simply counts the years you've been alive, biological age tells you how old your body actually seems based on measurable health data. This provides a more useful indicator of your current health status and potential longevity.
            </p>
            <p>
              The algorithm used in this calculator is based on current scientific research on biomarkers associated with aging and mortality risk. It's important to note that this is an estimate, and many factors influencing health and longevity are not captured by these biomarkers alone.
            </p>
            <p className="font-medium">
              Always consult with healthcare professionals for personalized health advice. This tool is for informational purposes only.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}