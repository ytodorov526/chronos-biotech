import { useState, ChangeEvent, FormEvent } from 'react';
import Layout from '@/components/Layout';
import FormInput from '@/components/FormInput';
import ResultCard from '@/components/ResultCard';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

// Define interfaces for our form and results
interface FormData {
  age: number;
  gender: string;
  totalCholesterol: number;
  hdl: number;
  systolicBP: number;
  onBloodPressureMeds: boolean;
  smoker: boolean;
  diabetic: boolean;
}

interface CardioRiskResult {
  tenYearRisk: number; // percentage
  heartAge: number; // years
  status: 'good' | 'warning' | 'danger' | 'neutral';
  interpretation: string;
  riskFactors: {
    [key: string]: {
      impact: 'high' | 'medium' | 'low' | 'none';
      description: string;
      recommendation?: string;
    };
  };
}

// Initial form values
const initialFormData: FormData = {
  age: 50,
  gender: 'male',
  totalCholesterol: 180,
  hdl: 50,
  systolicBP: 120,
  onBloodPressureMeds: false,
  smoker: false,
  diabetic: false,
};

export default function CardiovascularRiskCalculator() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [result, setResult] = useState<CardioRiskResult | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: type === 'number' ? Number(value) : value }));
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Calculate cardiovascular risk (using a simplified algorithm based on Framingham Risk Score)
    const calculateRisk = (): CardioRiskResult => {
      // Base risk by gender
      let riskScore = formData.gender === 'male' ? 0 : -3;
      
      // Age points
      if (formData.age >= 20 && formData.age <= 34) {
        riskScore += formData.gender === 'male' ? -9 : -7;
      } else if (formData.age >= 35 && formData.age <= 39) {
        riskScore += formData.gender === 'male' ? -4 : -3;
      } else if (formData.age >= 40 && formData.age <= 44) {
        riskScore += 0;
      } else if (formData.age >= 45 && formData.age <= 49) {
        riskScore += formData.gender === 'male' ? 3 : 3;
      } else if (formData.age >= 50 && formData.age <= 54) {
        riskScore += formData.gender === 'male' ? 6 : 6;
      } else if (formData.age >= 55 && formData.age <= 59) {
        riskScore += formData.gender === 'male' ? 8 : 8;
      } else if (formData.age >= 60 && formData.age <= 64) {
        riskScore += formData.gender === 'male' ? 10 : 10;
      } else if (formData.age >= 65 && formData.age <= 69) {
        riskScore += formData.gender === 'male' ? 11 : 12;
      } else if (formData.age >= 70 && formData.age <= 74) {
        riskScore += formData.gender === 'male' ? 12 : 14;
      } else if (formData.age >= 75 && formData.age <= 79) {
        riskScore += formData.gender === 'male' ? 13 : 16;
      }
      
      // Total Cholesterol points
      if (formData.totalCholesterol < 160) {
        riskScore += 0;
      } else if (formData.totalCholesterol >= 160 && formData.totalCholesterol <= 199) {
        riskScore += formData.gender === 'male' ? 1 : 1;
      } else if (formData.totalCholesterol >= 200 && formData.totalCholesterol <= 239) {
        riskScore += formData.gender === 'male' ? 2 : 3;
      } else if (formData.totalCholesterol >= 240 && formData.totalCholesterol <= 279) {
        riskScore += formData.gender === 'male' ? 3 : 4;
      } else if (formData.totalCholesterol >= 280) {
        riskScore += formData.gender === 'male' ? 4 : 5;
      }
      
      // HDL points
      if (formData.hdl >= 60) {
        riskScore += -2;
      } else if (formData.hdl >= 50 && formData.hdl <= 59) {
        riskScore += 0;
      } else if (formData.hdl >= 40 && formData.hdl <= 49) {
        riskScore += 1;
      } else if (formData.hdl < 40) {
        riskScore += 2;
      }
      
      // Systolic BP points
      if (formData.onBloodPressureMeds) {
        if (formData.systolicBP < 120) {
          riskScore += 0;
        } else if (formData.systolicBP >= 120 && formData.systolicBP <= 129) {
          riskScore += formData.gender === 'male' ? 1 : 3;
        } else if (formData.systolicBP >= 130 && formData.systolicBP <= 139) {
          riskScore += formData.gender === 'male' ? 2 : 4;
        } else if (formData.systolicBP >= 140 && formData.systolicBP <= 159) {
          riskScore += formData.gender === 'male' ? 2 : 5;
        } else if (formData.systolicBP >= 160) {
          riskScore += formData.gender === 'male' ? 3 : 6;
        }
      } else {
        if (formData.systolicBP < 120) {
          riskScore += 0;
        } else if (formData.systolicBP >= 120 && formData.systolicBP <= 129) {
          riskScore += 0;
        } else if (formData.systolicBP >= 130 && formData.systolicBP <= 139) {
          riskScore += formData.gender === 'male' ? 1 : 2;
        } else if (formData.systolicBP >= 140 && formData.systolicBP <= 159) {
          riskScore += formData.gender === 'male' ? 1 : 3;
        } else if (formData.systolicBP >= 160) {
          riskScore += formData.gender === 'male' ? 2 : 4;
        }
      }
      
      // Smoking status
      if (formData.smoker) {
        riskScore += formData.gender === 'male' ? 4 : 3;
      }
      
      // Diabetes
      if (formData.diabetic) {
        riskScore += formData.gender === 'male' ? 3 : 4;
      }
      
      // Convert score to 10-year risk percentage using lookup table (simplified)
      let tenYearRisk: number;
      
      if (formData.gender === 'male') {
        if (riskScore < 0) tenYearRisk = 1;
        else if (riskScore <= 4) tenYearRisk = 2;
        else if (riskScore <= 6) tenYearRisk = 3;
        else if (riskScore <= 8) tenYearRisk = 4;
        else if (riskScore <= 10) tenYearRisk = 6;
        else if (riskScore <= 12) tenYearRisk = 10;
        else if (riskScore <= 14) tenYearRisk = 16;
        else if (riskScore <= 16) tenYearRisk = 25;
        else tenYearRisk = 30;
      } else {
        if (riskScore < 0) tenYearRisk = 1;
        else if (riskScore <= 5) tenYearRisk = 2;
        else if (riskScore <= 7) tenYearRisk = 3;
        else if (riskScore <= 8) tenYearRisk = 4;
        else if (riskScore <= 10) tenYearRisk = 5;
        else if (riskScore <= 13) tenYearRisk = 8;
        else if (riskScore <= 16) tenYearRisk = 11;
        else if (riskScore <= 19) tenYearRisk = 15;
        else tenYearRisk = 24;
      }
      
      // Calculate heart age (simplified algorithm)
      let heartAge = formData.age;
      if (tenYearRisk <= 2) heartAge = Math.max(40, formData.age - 5);
      else if (tenYearRisk <= 5) heartAge = formData.age;
      else if (tenYearRisk <= 10) heartAge = formData.age + 5;
      else if (tenYearRisk <= 20) heartAge = formData.age + 10;
      else heartAge = formData.age + 15;
      
      // Round to ensure integer
      heartAge = Math.round(heartAge);
      
      // Determine status based on risk level
      let status: 'good' | 'warning' | 'danger' | 'neutral' = 'neutral';
      if (tenYearRisk < 5) status = 'good';
      else if (tenYearRisk < 10) status = 'warning';
      else status = 'danger';
      
      // Generate interpretation
      let interpretation = '';
      if (tenYearRisk < 5) {
        interpretation = 'Your 10-year risk of cardiovascular disease is low. Continue maintaining a healthy lifestyle.';
      } else if (tenYearRisk < 10) {
        interpretation = 'Your risk is moderate. Addressing risk factors can help reduce your risk further.';
      } else if (tenYearRisk < 20) {
        interpretation = 'Your risk is elevated. Consult with a healthcare provider to develop a risk reduction plan.';
      } else {
        interpretation = 'Your risk is high. It\'s strongly recommended to consult with a healthcare provider to address risk factors.';
      }
      
      // Analyze risk factors
      const riskFactors: CardioRiskResult['riskFactors'] = {};
      
      if (formData.age >= 45 && formData.gender === 'male' || formData.age >= 55 && formData.gender === 'female') {
        riskFactors.age = {
          impact: 'medium',
          description: 'Age is a non-modifiable risk factor for heart disease.',
          recommendation: 'Focus on modifiable risk factors like diet, exercise, and not smoking.'
        };
      }
      
      if (formData.totalCholesterol > 200) {
        riskFactors.cholesterol = {
          impact: formData.totalCholesterol > 240 ? 'high' : 'medium',
          description: 'Elevated total cholesterol increases cardiovascular risk.',
          recommendation: 'Consider dietary changes, increased physical activity, and possibly medication.'
        };
      }
      
      if (formData.hdl < 40) {
        riskFactors.hdl = {
          impact: 'high',
          description: 'Low HDL ("good") cholesterol is a risk factor for heart disease.',
          recommendation: 'Regular exercise, weight loss if needed, and avoiding trans fats can help raise HDL.'
        };
      }
      
      if (formData.systolicBP >= 130) {
        riskFactors.bloodPressure = {
          impact: formData.systolicBP >= 140 ? 'high' : 'medium',
          description: 'Elevated blood pressure increases strain on your heart and arteries.',
          recommendation: 'Reduce sodium intake, maintain healthy weight, exercise regularly, and manage stress.'
        };
      }
      
      if (formData.smoker) {
        riskFactors.smoking = {
          impact: 'high',
          description: 'Smoking significantly increases cardiovascular risk.',
          recommendation: 'Quitting smoking is one of the most impactful changes you can make for heart health.'
        };
      }
      
      if (formData.diabetic) {
        riskFactors.diabetes = {
          impact: 'high',
          description: 'Diabetes significantly increases your risk of heart disease.',
          recommendation: 'Maintain good glucose control through diet, exercise, and medication as prescribed.'
        };
      }
      
      return {
        tenYearRisk,
        heartAge,
        status,
        interpretation,
        riskFactors
      };
    };
    
    // Set result and show it
    const calculatedResult = calculateRisk();
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
    labels: ['Risk', 'Low Risk'],
    datasets: [
      {
        data: [result.tenYearRisk, 100 - result.tenYearRisk],
        backgroundColor: [
          result.status === 'good' ? '#10B981' : result.status === 'warning' ? '#F59E0B' : '#EF4444',
          '#E5E7EB',
        ],
        borderWidth: 0,
      },
    ],
  } : null;

  return (
    <Layout title="Cardiovascular Risk Calculator | Chronos Biotech">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-primary-800 mb-6">Cardiovascular Risk Calculator</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <p className="text-lg text-secondary-700 mb-6">
            This tool estimates your 10-year risk of developing cardiovascular disease based on the 
            Framingham Risk Score model. Enter your health information below to calculate your risk.
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
                    min={30}
                    max={79}
                    helpText="Valid for ages 30-79"
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
                <h2 className="text-xl font-semibold text-primary-700 mb-4">Cholesterol</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    label="Total Cholesterol"
                    name="totalCholesterol"
                    type="number"
                    value={formData.totalCholesterol}
                    onChange={handleInputChange}
                    required
                    min={100}
                    max={400}
                    units="mg/dL"
                    helpText="Desirable: < 200 mg/dL"
                  />
                  
                  <FormInput
                    label="HDL Cholesterol"
                    name="hdl"
                    type="number"
                    value={formData.hdl}
                    onChange={handleInputChange}
                    required
                    min={20}
                    max={100}
                    units="mg/dL"
                    helpText="Desirable: > 40 mg/dL (men), > 50 mg/dL (women)"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-primary-700 mb-4">Blood Pressure</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    label="Systolic Blood Pressure"
                    name="systolicBP"
                    type="number"
                    value={formData.systolicBP}
                    onChange={handleInputChange}
                    required
                    min={90}
                    max={200}
                    units="mmHg"
                    helpText="Normal: < 120 mmHg"
                  />
                  
                  <div className="mb-4 flex items-center">
                    <input
                      type="checkbox"
                      id="onBloodPressureMeds"
                      name="onBloodPressureMeds"
                      checked={formData.onBloodPressureMeds}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                    />
                    <label htmlFor="onBloodPressureMeds" className="ml-2 block text-sm font-medium text-secondary-700">
                      Currently on blood pressure medication
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-primary-700 mb-4">Other Risk Factors</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="mb-4 flex items-center">
                    <input
                      type="checkbox"
                      id="smoker"
                      name="smoker"
                      checked={formData.smoker}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                    />
                    <label htmlFor="smoker" className="ml-2 block text-sm font-medium text-secondary-700">
                      Current smoker
                    </label>
                  </div>
                  
                  <div className="mb-4 flex items-center">
                    <input
                      type="checkbox"
                      id="diabetic"
                      name="diabetic"
                      checked={formData.diabetic}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                    />
                    <label htmlFor="diabetic" className="ml-2 block text-sm font-medium text-secondary-700">
                      Diagnosed with diabetes
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center mt-8">
                <button type="submit" className="btn-primary px-8 py-3 text-lg">
                  Calculate Risk
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
                                display: false,
                              },
                              tooltip: {
                                callbacks: {
                                  label: function(context) {
                                    const label = context.label || '';
                                    if (label === 'Risk') {
                                      return `Your 10-year risk: ${context.raw}%`;
                                    } else {
                                      return '';
                                    }
                                  }
                                }
                              }
                            },
                          }}
                        />
                      )}
                      <div className="absolute text-center" style={{ width: '240px' }}>
                        <div className="text-3xl font-bold text-primary-700">{result.tenYearRisk}%</div>
                        <div className="text-sm text-secondary-600">10-Year Risk</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <ResultCard
                      title="Your Cardiovascular Risk Assessment"
                      value={`${result.tenYearRisk}% 10-Year Risk`}
                      interpretation={result.interpretation}
                      status={result.status}
                    >
                      <div className="flex items-center mt-2">
                        <span className="text-sm mr-2">Chronological Age:</span>
                        <span className="font-semibold">{formData.age} years</span>
                      </div>
                      <div className="flex items-center mt-1">
                        <span className="text-sm mr-2">Heart Age:</span>
                        <span className={`font-semibold ${
                          result.heartAge < formData.age 
                            ? 'text-green-600' 
                            : result.heartAge > formData.age 
                              ? 'text-red-600' 
                              : ''
                        }`}>
                          {result.heartAge} years
                        </span>
                      </div>
                    </ResultCard>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-primary-700 mt-8 mb-4">Risk Factor Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(result.riskFactors).map(([factor, data]) => (
                    <div 
                      key={factor} 
                      className={`p-4 rounded-lg border ${
                        data.impact === 'high' 
                          ? 'border-red-200 bg-red-50' 
                          : data.impact === 'medium'
                            ? 'border-yellow-200 bg-yellow-50'
                            : 'border-blue-200 bg-blue-50'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium capitalize">{factor}</h4>
                        <span 
                          className={`px-2 py-0.5 text-xs rounded-full ${
                            data.impact === 'high' 
                              ? 'bg-red-100 text-red-800' 
                              : data.impact === 'medium'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {data.impact === 'high' ? 'High Impact' : data.impact === 'medium' ? 'Medium Impact' : 'Low Impact'}
                        </span>
                      </div>
                      <p className="text-sm text-secondary-700 mb-2">{data.description}</p>
                      {data.recommendation && (
                        <p className="text-sm font-medium text-secondary-800 mt-1">
                          Recommendation: {data.recommendation}
                        </p>
                      )}
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
          <h2 className="text-xl font-semibold text-primary-700 mb-4">About Cardiovascular Risk Assessment</h2>
          <div className="text-secondary-700 space-y-4">
            <p>
              This calculator uses a simplified version of the Framingham Risk Score to estimate your 10-year risk of developing cardiovascular disease (CVD).
            </p>
            <p>
              The Framingham Risk Score is based on data from long-term cardiovascular cohort studies and is widely used to estimate the risk of developing CVD in individuals who haven't previously experienced a cardiovascular event.
            </p>
            <p>
              Heart age represents the typical age of a person with your level of risk factors but with all other risk factors at normal levels. A heart age older than your actual age means you have elevated risk factors that are aging your cardiovascular system prematurely.
            </p>
            <p className="font-medium">
              This tool is for informational purposes only and should not replace professional medical advice. Always consult with a healthcare provider for a complete risk assessment and personalized recommendations.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}