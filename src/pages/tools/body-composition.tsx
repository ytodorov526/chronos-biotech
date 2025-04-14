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
  weight: number;
  height: number;
  waistCircumference: number;
  neckCircumference: number;
  hipCircumference: number;
  bodyFatPercentage?: number;
  bodyFatMethod?: string;
}

interface BodyCompositionResult {
  bmi: number;
  bmiCategory: string;
  bmiStatus: 'good' | 'warning' | 'danger' | 'neutral';
  ffmi: number;
  ffmiCategory: string;
  bodyFatPercentage: number;
  bodyFatCategory: string;
  bodyFatStatus: 'good' | 'warning' | 'danger' | 'neutral';
  waistToHeightRatio: number;
  waistToHeightCategory: string;
  waistToHipRatio: number;
  waistToHipCategory: string;
  visceralFatRisk: 'low' | 'moderate' | 'high';
  leanMass: number;
  fatMass: number;
  recommendations: string[];
}

// Initial form values
const initialFormData: FormData = {
  age: 35,
  gender: 'male',
  weight: 75, // kg
  height: 175, // cm
  waistCircumference: 83, // cm
  neckCircumference: 38, // cm
  hipCircumference: 95, // cm
  bodyFatPercentage: undefined,
  bodyFatMethod: 'estimate',
};

export default function BodyCompositionAnalyzer() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [result, setResult] = useState<BodyCompositionResult | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (name === 'bodyFatMethod') {
      // If switching between body fat methods
      setFormData((prev) => ({ 
        ...prev, 
        [name]: value,
        // Clear body fat percentage if switching to estimate
        bodyFatPercentage: value === 'estimate' ? undefined : prev.bodyFatPercentage,
      }));
    } else {
      setFormData((prev) => ({ 
        ...prev, 
        [name]: type === 'number' ? (value === '' ? undefined : Number(value)) : value 
      }));
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Calculate body composition metrics
    const calculateBodyComposition = (): BodyCompositionResult => {
      // Calculate BMI
      const heightInMeters = formData.height / 100;
      const bmi = formData.weight / (heightInMeters * heightInMeters);
      
      // Determine BMI category
      let bmiCategory = '';
      let bmiStatus: 'good' | 'warning' | 'danger' | 'neutral' = 'neutral';
      
      if (bmi < 18.5) {
        bmiCategory = 'Underweight';
        bmiStatus = 'warning';
      } else if (bmi >= 18.5 && bmi < 25) {
        bmiCategory = 'Normal weight';
        bmiStatus = 'good';
      } else if (bmi >= 25 && bmi < 30) {
        bmiCategory = 'Overweight';
        bmiStatus = 'warning';
      } else if (bmi >= 30 && bmi < 35) {
        bmiCategory = 'Obese Class I';
        bmiStatus = 'danger';
      } else if (bmi >= 35 && bmi < 40) {
        bmiCategory = 'Obese Class II';
        bmiStatus = 'danger';
      } else {
        bmiCategory = 'Obese Class III';
        bmiStatus = 'danger';
      }
      
      // Calculate or use provided body fat percentage
      let bodyFatPercentage: number;
      
      if (formData.bodyFatMethod === 'measured' && formData.bodyFatPercentage !== undefined) {
        bodyFatPercentage = formData.bodyFatPercentage;
      } else {
        // Estimate body fat using U.S. Navy Method
        if (formData.gender === 'male') {
          // Male formula
          bodyFatPercentage = 495 / (1.0324 - 0.19077 * Math.log10(formData.waistCircumference - formData.neckCircumference) + 0.15456 * Math.log10(formData.height)) - 450;
        } else {
          // Female formula
          bodyFatPercentage = 495 / (1.29579 - 0.35004 * Math.log10(formData.waistCircumference + formData.hipCircumference - formData.neckCircumference) + 0.22100 * Math.log10(formData.height)) - 450;
        }
      }
      
      // Ensure body fat percentage is within reasonable bounds
      bodyFatPercentage = Math.max(5, Math.min(60, bodyFatPercentage));
      
      // Determine body fat category based on gender and age
      let bodyFatCategory = '';
      let bodyFatStatus: 'good' | 'warning' | 'danger' | 'neutral' = 'neutral';
      
      if (formData.gender === 'male') {
        if (bodyFatPercentage < 6) {
          bodyFatCategory = 'Essential fat';
          bodyFatStatus = 'warning';
        } else if (bodyFatPercentage >= 6 && bodyFatPercentage < 14) {
          bodyFatCategory = 'Athletic';
          bodyFatStatus = 'good';
        } else if (bodyFatPercentage >= 14 && bodyFatPercentage < 18) {
          bodyFatCategory = 'Fitness';
          bodyFatStatus = 'good';
        } else if (bodyFatPercentage >= 18 && bodyFatPercentage < 25) {
          bodyFatCategory = 'Average';
          bodyFatStatus = 'warning';
        } else {
          bodyFatCategory = 'Obese';
          bodyFatStatus = 'danger';
        }
      } else {
        if (bodyFatPercentage < 14) {
          bodyFatCategory = 'Essential fat';
          bodyFatStatus = 'warning';
        } else if (bodyFatPercentage >= 14 && bodyFatPercentage < 21) {
          bodyFatCategory = 'Athletic';
          bodyFatStatus = 'good';
        } else if (bodyFatPercentage >= 21 && bodyFatPercentage < 25) {
          bodyFatCategory = 'Fitness';
          bodyFatStatus = 'good';
        } else if (bodyFatPercentage >= 25 && bodyFatPercentage < 32) {
          bodyFatCategory = 'Average';
          bodyFatStatus = 'warning';
        } else {
          bodyFatCategory = 'Obese';
          bodyFatStatus = 'danger';
        }
      }
      
      // Calculate fat mass and lean mass
      const fatMass = (bodyFatPercentage / 100) * formData.weight;
      const leanMass = formData.weight - fatMass;
      
      // Calculate Fat-Free Mass Index (FFMI)
      const ffmi = leanMass / (heightInMeters * heightInMeters);
      
      // Determine FFMI category
      let ffmiCategory = '';
      if (formData.gender === 'male') {
        if (ffmi < 18) {
          ffmiCategory = 'Below average';
        } else if (ffmi >= 18 && ffmi < 20) {
          ffmiCategory = 'Average';
        } else if (ffmi >= 20 && ffmi < 22) {
          ffmiCategory = 'Above average';
        } else if (ffmi >= 22 && ffmi < 23) {
          ffmiCategory = 'Excellent';
        } else if (ffmi >= 23 && ffmi < 26) {
          ffmiCategory = 'Superior';
        } else {
          ffmiCategory = 'Exceptional';
        }
      } else {
        if (ffmi < 15) {
          ffmiCategory = 'Below average';
        } else if (ffmi >= 15 && ffmi < 16) {
          ffmiCategory = 'Average';
        } else if (ffmi >= 16 && ffmi < 17.5) {
          ffmiCategory = 'Above average';
        } else if (ffmi >= 17.5 && ffmi < 19) {
          ffmiCategory = 'Excellent';
        } else if (ffmi >= 19 && ffmi < 21) {
          ffmiCategory = 'Superior';
        } else {
          ffmiCategory = 'Exceptional';
        }
      }
      
      // Calculate waist-to-height ratio
      const waistToHeightRatio = formData.waistCircumference / formData.height;
      
      // Determine waist-to-height category
      let waistToHeightCategory = '';
      if (waistToHeightRatio < 0.4) {
        waistToHeightCategory = 'Extremely slim';
      } else if (waistToHeightRatio >= 0.4 && waistToHeightRatio < 0.43) {
        waistToHeightCategory = 'Slender';
      } else if (waistToHeightRatio >= 0.43 && waistToHeightRatio < 0.47) {
        waistToHeightCategory = 'Healthy slim';
      } else if (waistToHeightRatio >= 0.47 && waistToHeightRatio < 0.53) {
        waistToHeightCategory = 'Healthy';
      } else if (waistToHeightRatio >= 0.53 && waistToHeightRatio < 0.58) {
        waistToHeightCategory = 'Overweight';
      } else if (waistToHeightRatio >= 0.58 && waistToHeightRatio < 0.63) {
        waistToHeightCategory = 'Very overweight';
      } else {
        waistToHeightCategory = 'Obese';
      }
      
      // Calculate waist-to-hip ratio
      const waistToHipRatio = formData.waistCircumference / formData.hipCircumference;
      
      // Determine waist-to-hip category
      let waistToHipCategory = '';
      if (formData.gender === 'male') {
        if (waistToHipRatio < 0.9) {
          waistToHipCategory = 'Low risk';
        } else if (waistToHipRatio >= 0.9 && waistToHipRatio < 1.0) {
          waistToHipCategory = 'Moderate risk';
        } else {
          waistToHipCategory = 'High risk';
        }
      } else {
        if (waistToHipRatio < 0.8) {
          waistToHipCategory = 'Low risk';
        } else if (waistToHipRatio >= 0.8 && waistToHipRatio < 0.85) {
          waistToHipCategory = 'Moderate risk';
        } else {
          waistToHipCategory = 'High risk';
        }
      }
      
      // Determine visceral fat risk
      let visceralFatRisk: 'low' | 'moderate' | 'high' = 'low';
      if (formData.gender === 'male') {
        if (formData.waistCircumference < 94) {
          visceralFatRisk = 'low';
        } else if (formData.waistCircumference >= 94 && formData.waistCircumference < 102) {
          visceralFatRisk = 'moderate';
        } else {
          visceralFatRisk = 'high';
        }
      } else {
        if (formData.waistCircumference < 80) {
          visceralFatRisk = 'low';
        } else if (formData.waistCircumference >= 80 && formData.waistCircumference < 88) {
          visceralFatRisk = 'moderate';
        } else {
          visceralFatRisk = 'high';
        }
      }
      
      // Generate recommendations
      const recommendations: string[] = [];
      
      if (bmi < 18.5) {
        recommendations.push('Consider increasing caloric intake with nutrient-dense foods to achieve a healthy weight.');
        recommendations.push('Focus on strength training to build lean muscle mass.');
      } else if (bmi >= 25) {
        recommendations.push('Consider a moderate caloric deficit through a combination of diet and exercise.');
        recommendations.push('Aim for sustainable weight loss of 0.5-1kg per week.');
      }
      
      if (bodyFatPercentage > (formData.gender === 'male' ? 25 : 32)) {
        recommendations.push('Focus on reducing body fat percentage through combined cardiovascular and resistance training.');
        recommendations.push('Consider consulting a nutritionist for a personalized nutrition plan.');
      }
      
      if (waistToHeightRatio >= 0.5) {
        recommendations.push('Your waist-to-height ratio indicates increased health risk. Focus on reducing abdominal fat.');
        recommendations.push('Incorporate high-intensity interval training (HIIT) to target abdominal fat reduction.');
      }
      
      if (visceralFatRisk === 'high') {
        recommendations.push('Your waist circumference indicates elevated visceral fat, which increases risk for metabolic diseases.');
        recommendations.push('Prioritize reducing abdominal obesity through diet, exercise, stress management, and improved sleep.');
      }
      
      if (formData.gender === 'male' ? ffmi < 18 : ffmi < 15) {
        recommendations.push('Consider a structured resistance training program to increase muscle mass.');
        recommendations.push('Ensure adequate protein intake (1.6-2.2g per kg of body weight) to support muscle growth.');
      }
      
      // If no specific recommendations, provide general guidance
      if (recommendations.length === 0) {
        recommendations.push('Your body composition metrics are within healthy ranges. Continue your current fitness regimen.');
        recommendations.push('For optimal health, maintain a balanced diet and regular physical activity combining both strength and cardiovascular training.');
      }
      
      return {
        bmi,
        bmiCategory,
        bmiStatus,
        ffmi,
        ffmiCategory,
        bodyFatPercentage,
        bodyFatCategory,
        bodyFatStatus,
        waistToHeightRatio,
        waistToHeightCategory,
        waistToHipRatio,
        waistToHipCategory,
        visceralFatRisk,
        leanMass,
        fatMass,
        recommendations
      };
    };
    
    // Set result and show it
    const calculatedResult = calculateBodyComposition();
    setResult(calculatedResult);
    setShowResults(true);
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setResult(null);
    setShowResults(false);
  };

  // Prepare chart data if we have results
  const compositionData = result ? {
    labels: ['Lean Mass', 'Fat Mass'],
    datasets: [
      {
        label: 'Body Composition',
        data: [result.leanMass, result.fatMass],
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 99, 132, 0.8)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  } : null;

  return (
    <Layout title="Body Composition Analyzer | Chronos Biotech">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-primary-800 mb-6">Body Composition Analyzer</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <p className="text-lg text-secondary-700 mb-6">
            This tool analyzes your body composition metrics, including body fat percentage, 
            lean mass, fat distribution, and more to provide a comprehensive assessment of your 
            body composition and health risk profile.
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
                    max={100}
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
                <h2 className="text-xl font-semibold text-primary-700 mb-4">Measurements</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    label="Weight"
                    name="weight"
                    type="number"
                    value={formData.weight}
                    onChange={handleInputChange}
                    required
                    min={30}
                    max={250}
                    step={0.1}
                    units="kg"
                  />
                  
                  <FormInput
                    label="Height"
                    name="height"
                    type="number"
                    value={formData.height}
                    onChange={handleInputChange}
                    required
                    min={120}
                    max={220}
                    units="cm"
                  />
                  
                  <FormInput
                    label="Waist Circumference"
                    name="waistCircumference"
                    type="number"
                    value={formData.waistCircumference}
                    onChange={handleInputChange}
                    required
                    min={40}
                    max={200}
                    units="cm"
                    helpText="Measure at navel level"
                  />
                  
                  <FormInput
                    label="Hip Circumference"
                    name="hipCircumference"
                    type="number"
                    value={formData.hipCircumference}
                    onChange={handleInputChange}
                    required
                    min={60}
                    max={200}
                    units="cm"
                    helpText="Measure at widest point"
                  />
                  
                  <FormInput
                    label="Neck Circumference"
                    name="neckCircumference"
                    type="number"
                    value={formData.neckCircumference}
                    onChange={handleInputChange}
                    required
                    min={20}
                    max={60}
                    units="cm"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-primary-700 mb-4">Body Fat Percentage</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="bodyFatMethodEstimate"
                        name="bodyFatMethod"
                        value="estimate"
                        checked={formData.bodyFatMethod === 'estimate'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-primary-600 border-secondary-300 focus:ring-primary-500"
                      />
                      <label htmlFor="bodyFatMethodEstimate" className="ml-2 block text-sm font-medium text-secondary-700">
                        Estimate from measurements
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="bodyFatMethodMeasured"
                        name="bodyFatMethod"
                        value="measured"
                        checked={formData.bodyFatMethod === 'measured'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-primary-600 border-secondary-300 focus:ring-primary-500"
                      />
                      <label htmlFor="bodyFatMethodMeasured" className="ml-2 block text-sm font-medium text-secondary-700">
                        Enter measured value
                      </label>
                    </div>
                  </div>
                  
                  {formData.bodyFatMethod === 'measured' && (
                    <FormInput
                      label="Body Fat Percentage"
                      name="bodyFatPercentage"
                      type="number"
                      value={formData.bodyFatPercentage || ''}
                      onChange={handleInputChange}
                      required
                      min={3}
                      max={60}
                      step={0.1}
                      units="%"
                      helpText="From DEXA, BIA, calipers, etc."
                    />
                  )}
                </div>
              </div>
              
              <div className="flex justify-center mt-8">
                <button type="submit" className="btn-primary px-8 py-3 text-lg">
                  Analyze Body Composition
                </button>
              </div>
            </form>
          ) : (
            result && (
              <div className="results-container">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <ResultCard
                      title="Body Fat Percentage"
                      value={`${result.bodyFatPercentage.toFixed(1)}%`}
                      interpretation={`Category: ${result.bodyFatCategory}`}
                      status={result.bodyFatStatus}
                    >
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div>
                          <span className="text-sm text-secondary-600">Fat Mass:</span>
                          <span className="ml-1 font-medium">{result.fatMass.toFixed(1)} kg</span>
                        </div>
                        <div>
                          <span className="text-sm text-secondary-600">Lean Mass:</span>
                          <span className="ml-1 font-medium">{result.leanMass.toFixed(1)} kg</span>
                        </div>
                      </div>
                    </ResultCard>
                    
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="p-4 bg-secondary-50 rounded-lg border border-secondary-200">
                        <h3 className="text-sm font-semibold text-secondary-700">BMI</h3>
                        <div className="text-xl font-bold">{result.bmi.toFixed(1)}</div>
                        <div className="text-sm text-secondary-600">{result.bmiCategory}</div>
                      </div>
                      
                      <div className="p-4 bg-secondary-50 rounded-lg border border-secondary-200">
                        <h3 className="text-sm font-semibold text-secondary-700">FFMI</h3>
                        <div className="text-xl font-bold">{result.ffmi.toFixed(1)}</div>
                        <div className="text-sm text-secondary-600">{result.ffmiCategory}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center">
                    {compositionData && (
                      <div className="w-64">
                        <Doughnut
                          data={compositionData}
                          options={{
                            plugins: {
                              tooltip: {
                                callbacks: {
                                  label: function(context) {
                                    const label = context.label || '';
                                    const value = context.raw as number;
                                    const percentage = context.label === 'Fat Mass' 
                                      ? result.bodyFatPercentage.toFixed(1) 
                                      : (100 - result.bodyFatPercentage).toFixed(1);
                                    return `${label}: ${value.toFixed(1)} kg (${percentage}%)`;
                                  }
                                }
                              }
                            },
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-primary-700 mb-4">Body Fat Distribution Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-white rounded-lg border border-secondary-200">
                    <h4 className="text-sm font-semibold text-secondary-700 mb-1">Waist-to-Height Ratio</h4>
                    <div className="text-xl font-bold">{result.waistToHeightRatio.toFixed(2)}</div>
                    <div className="text-sm text-secondary-600">{result.waistToHeightCategory}</div>
                    <div className={`mt-2 text-xs px-2 py-1 rounded-full inline-block ${
                      result.waistToHeightRatio < 0.5 
                        ? 'bg-green-100 text-green-800' 
                        : result.waistToHeightRatio < 0.6
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {result.waistToHeightRatio < 0.5 
                        ? 'Healthy' 
                        : result.waistToHeightRatio < 0.6
                          ? 'Increased Risk'
                          : 'High Risk'}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-white rounded-lg border border-secondary-200">
                    <h4 className="text-sm font-semibold text-secondary-700 mb-1">Waist-to-Hip Ratio</h4>
                    <div className="text-xl font-bold">{result.waistToHipRatio.toFixed(2)}</div>
                    <div className="text-sm text-secondary-600">{result.waistToHipCategory}</div>
                    <div className={`mt-2 text-xs px-2 py-1 rounded-full inline-block ${
                      result.waistToHipCategory === 'Low risk' 
                        ? 'bg-green-100 text-green-800' 
                        : result.waistToHipCategory === 'Moderate risk'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {result.waistToHipCategory}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-white rounded-lg border border-secondary-200">
                    <h4 className="text-sm font-semibold text-secondary-700 mb-1">Visceral Fat Risk</h4>
                    <div className="text-xl font-bold capitalize">{result.visceralFatRisk}</div>
                    <div className="text-sm text-secondary-600">Based on waist circumference</div>
                    <div className={`mt-2 text-xs px-2 py-1 rounded-full inline-block ${
                      result.visceralFatRisk === 'low' 
                        ? 'bg-green-100 text-green-800' 
                        : result.visceralFatRisk === 'moderate'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {result.visceralFatRisk === 'low' 
                        ? 'Low Risk' 
                        : result.visceralFatRisk === 'moderate'
                          ? 'Moderate Risk'
                          : 'High Risk'}
                    </div>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-primary-700 mt-8 mb-4">Recommendations</h3>
                <div className="bg-primary-50 p-4 rounded-lg border border-primary-200">
                  <ul className="space-y-2">
                    {result.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-primary-600 mr-2">•</span>
                        <span>{recommendation}</span>
                      </li>
                    ))}
                  </ul>
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
          <h2 className="text-xl font-semibold text-primary-700 mb-4">About Body Composition Analysis</h2>
          <div className="text-secondary-700 space-y-4">
            <p>
              Body composition analysis goes beyond simple weight measurements to assess the proportion 
              of fat, muscle, and other tissues in your body. This provides a more comprehensive picture 
              of your health than weight or BMI alone.
            </p>
            <p>
              Key metrics like body fat percentage, fat-free mass index (FFMI), and body fat distribution 
              patterns help identify specific health risks and guide personalized fitness and nutrition strategies.
            </p>
            <p>
              The Navy Method used for body fat estimation in this tool has been validated against more 
              advanced methods like DEXA scans, with a typical error of 2-3%. For the most accurate results, 
              use consistent measuring techniques.
            </p>
            <p className="font-medium">
              This tool is for informational purposes only. For medical advice or precise body composition 
              analysis, consult with healthcare professionals or use clinical measurement methods.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}