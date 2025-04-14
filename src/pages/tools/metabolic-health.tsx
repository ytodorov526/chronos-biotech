import { useState, ChangeEvent, FormEvent } from 'react';
import Layout from '@/components/Layout';
import FormInput from '@/components/FormInput';
import ResultCard from '@/components/ResultCard';
import BiomarkerRangeIndicator from '@/components/BiomarkerRangeIndicator';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// Define interfaces for our form and results
interface FormData {
  fastingGlucose: number;
  postprandialGlucose: number;
  hba1c: number;
  fasting_insulin: number;
  triglycerides: number;
  hdl: number;
  weight: number;
  height: number;
  waistCircumference: number;
}

interface MetabolicHealthResult {
  totalScore: number;
  status: 'optimal' | 'good' | 'fair' | 'poor';
  bmi: number;
  bmiCategory: string;
  insulinSensitivity: number;
  insulinSensitivityCategory: string;
  metabolicFactors: {
    [key: string]: {
      value: number;
      score: number;
      interpretation: string;
      status: 'good' | 'warning' | 'danger' | 'neutral';
    };
  };
  recommendations: string[];
}

// Initial form values
const initialFormData: FormData = {
  fastingGlucose: 85,
  postprandialGlucose: 120,
  hba1c: 5.2,
  fasting_insulin: 8,
  triglycerides: 100,
  hdl: 55,
  weight: 70, // kg
  height: 170, // cm
  waistCircumference: 80, // cm
};

export default function MetabolicHealthCalculator() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [result, setResult] = useState<MetabolicHealthResult | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: Number(value) }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Calculate metabolic health score
    const calculateMetabolicHealth = (): MetabolicHealthResult => {
      // Calculate BMI
      const heightInMeters = formData.height / 100;
      const bmi = formData.weight / (heightInMeters * heightInMeters);
      
      // Determine BMI category
      let bmiCategory = '';
      if (bmi < 18.5) bmiCategory = 'Underweight';
      else if (bmi >= 18.5 && bmi < 25) bmiCategory = 'Normal weight';
      else if (bmi >= 25 && bmi < 30) bmiCategory = 'Overweight';
      else bmiCategory = 'Obese';
      
      // Calculate HOMA-IR (Homeostatic Model Assessment for Insulin Resistance) - simplified
      const homaIr = (formData.fastingGlucose * formData.fasting_insulin) / 405;
      
      // Determine insulin sensitivity category
      let insulinSensitivityCategory = '';
      if (homaIr < 1) insulinSensitivityCategory = 'Excellent';
      else if (homaIr >= 1 && homaIr < 1.5) insulinSensitivityCategory = 'Good';
      else if (homaIr >= 1.5 && homaIr < 2) insulinSensitivityCategory = 'Fair';
      else if (homaIr >= 2 && homaIr < 2.5) insulinSensitivityCategory = 'Poor';
      else insulinSensitivityCategory = 'Very Poor';
      
      // Score each metabolic factor (0-10 scale, where 10 is optimal)
      const metabolicFactors: MetabolicHealthResult['metabolicFactors'] = {};
      
      // Score fasting glucose
      let fastingGlucoseScore = 10;
      if (formData.fastingGlucose > 70 && formData.fastingGlucose <= 85) fastingGlucoseScore = 10;
      else if (formData.fastingGlucose > 85 && formData.fastingGlucose <= 95) fastingGlucoseScore = 8;
      else if (formData.fastingGlucose > 95 && formData.fastingGlucose <= 100) fastingGlucoseScore = 6;
      else if (formData.fastingGlucose > 100 && formData.fastingGlucose <= 110) fastingGlucoseScore = 4;
      else if (formData.fastingGlucose > 110 && formData.fastingGlucose <= 125) fastingGlucoseScore = 2;
      else fastingGlucoseScore = 0;
      
      let fastingGlucoseStatus: 'good' | 'warning' | 'danger' | 'neutral' = 'neutral';
      if (fastingGlucoseScore >= 8) fastingGlucoseStatus = 'good';
      else if (fastingGlucoseScore >= 4) fastingGlucoseStatus = 'warning';
      else fastingGlucoseStatus = 'danger';
      
      metabolicFactors.fastingGlucose = {
        value: formData.fastingGlucose,
        score: fastingGlucoseScore,
        interpretation: getFastingGlucoseInterpretation(formData.fastingGlucose),
        status: fastingGlucoseStatus
      };
      
      // Score HbA1c
      let hba1cScore = 10;
      if (formData.hba1c <= 5.2) hba1cScore = 10;
      else if (formData.hba1c > 5.2 && formData.hba1c <= 5.5) hba1cScore = 8;
      else if (formData.hba1c > 5.5 && formData.hba1c <= 5.7) hba1cScore = 6;
      else if (formData.hba1c > 5.7 && formData.hba1c <= 6.0) hba1cScore = 4;
      else if (formData.hba1c > 6.0 && formData.hba1c <= 6.4) hba1cScore = 2;
      else hba1cScore = 0;
      
      let hba1cStatus: 'good' | 'warning' | 'danger' | 'neutral' = 'neutral';
      if (hba1cScore >= 8) hba1cStatus = 'good';
      else if (hba1cScore >= 4) hba1cStatus = 'warning';
      else hba1cStatus = 'danger';
      
      metabolicFactors.hba1c = {
        value: formData.hba1c,
        score: hba1cScore,
        interpretation: getHbA1cInterpretation(formData.hba1c),
        status: hba1cStatus
      };
      
      // Score insulin sensitivity
      let insulinSensitivityScore = 10;
      if (homaIr < 1) insulinSensitivityScore = 10;
      else if (homaIr >= 1 && homaIr < 1.5) insulinSensitivityScore = 8;
      else if (homaIr >= 1.5 && homaIr < 2) insulinSensitivityScore = 6;
      else if (homaIr >= 2 && homaIr < 2.5) insulinSensitivityScore = 4;
      else if (homaIr >= 2.5 && homaIr < 3) insulinSensitivityScore = 2;
      else insulinSensitivityScore = 0;
      
      let insulinSensitivityStatus: 'good' | 'warning' | 'danger' | 'neutral' = 'neutral';
      if (insulinSensitivityScore >= 8) insulinSensitivityStatus = 'good';
      else if (insulinSensitivityScore >= 4) insulinSensitivityStatus = 'warning';
      else insulinSensitivityStatus = 'danger';
      
      metabolicFactors.insulinSensitivity = {
        value: homaIr,
        score: insulinSensitivityScore,
        interpretation: getInsulinSensitivityInterpretation(homaIr),
        status: insulinSensitivityStatus
      };
      
      // Score triglycerides
      let triglyceridesScore = 10;
      if (formData.triglycerides < 70) triglyceridesScore = 10;
      else if (formData.triglycerides >= 70 && formData.triglycerides < 100) triglyceridesScore = 8;
      else if (formData.triglycerides >= 100 && formData.triglycerides < 130) triglyceridesScore = 6;
      else if (formData.triglycerides >= 130 && formData.triglycerides < 150) triglyceridesScore = 4;
      else if (formData.triglycerides >= 150 && formData.triglycerides < 200) triglyceridesScore = 2;
      else triglyceridesScore = 0;
      
      let triglyceridesStatus: 'good' | 'warning' | 'danger' | 'neutral' = 'neutral';
      if (triglyceridesScore >= 8) triglyceridesStatus = 'good';
      else if (triglyceridesScore >= 4) triglyceridesStatus = 'warning';
      else triglyceridesStatus = 'danger';
      
      metabolicFactors.triglycerides = {
        value: formData.triglycerides,
        score: triglyceridesScore,
        interpretation: getTriglyceridesInterpretation(formData.triglycerides),
        status: triglyceridesStatus
      };
      
      // Score HDL
      let hdlScore = 10;
      if (formData.hdl >= 60) hdlScore = 10;
      else if (formData.hdl >= 50 && formData.hdl < 60) hdlScore = 8;
      else if (formData.hdl >= 40 && formData.hdl < 50) hdlScore = 6;
      else if (formData.hdl >= 35 && formData.hdl < 40) hdlScore = 4;
      else if (formData.hdl >= 30 && formData.hdl < 35) hdlScore = 2;
      else hdlScore = 0;
      
      let hdlStatus: 'good' | 'warning' | 'danger' | 'neutral' = 'neutral';
      if (hdlScore >= 8) hdlStatus = 'good';
      else if (hdlScore >= 4) hdlStatus = 'warning';
      else hdlStatus = 'danger';
      
      metabolicFactors.hdl = {
        value: formData.hdl,
        score: hdlScore,
        interpretation: getHDLInterpretation(formData.hdl),
        status: hdlStatus
      };
      
      // Score waist circumference (assuming this is for a male - would need gender input for more accuracy)
      let waistScore = 10;
      if (formData.waistCircumference < 80) waistScore = 10;
      else if (formData.waistCircumference >= 80 && formData.waistCircumference < 90) waistScore = 8;
      else if (formData.waistCircumference >= 90 && formData.waistCircumference < 100) waistScore = 6;
      else if (formData.waistCircumference >= 100 && formData.waistCircumference < 110) waistScore = 4;
      else if (formData.waistCircumference >= 110 && formData.waistCircumference < 120) waistScore = 2;
      else waistScore = 0;
      
      let waistStatus: 'good' | 'warning' | 'danger' | 'neutral' = 'neutral';
      if (waistScore >= 8) waistStatus = 'good';
      else if (waistScore >= 4) waistStatus = 'warning';
      else waistStatus = 'danger';
      
      metabolicFactors.waistCircumference = {
        value: formData.waistCircumference,
        score: waistScore,
        interpretation: getWaistCircumferenceInterpretation(formData.waistCircumference),
        status: waistStatus
      };
      
      // Calculate total score (average of all scores)
      const scores = Object.values(metabolicFactors).map(factor => factor.score);
      const totalScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
      
      // Determine overall status
      let status: 'optimal' | 'good' | 'fair' | 'poor';
      if (totalScore >= 8) status = 'optimal';
      else if (totalScore >= 6) status = 'good';
      else if (totalScore >= 4) status = 'fair';
      else status = 'poor';
      
      // Generate recommendations based on scores
      const recommendations: string[] = [];
      
      if (fastingGlucoseScore < 6 || hba1cScore < 6) {
        recommendations.push('Consider reducing refined carbohydrates and added sugars in your diet.');
        recommendations.push('Aim for regular physical activity, especially after meals.');
      }
      
      if (insulinSensitivityScore < 6) {
        recommendations.push('Focus on improving insulin sensitivity through weight management and resistance training.');
        recommendations.push('Consider time-restricted eating (intermittent fasting) after consulting with a healthcare provider.');
      }
      
      if (triglyceridesScore < 6) {
        recommendations.push('Reduce intake of processed foods, refined carbs, and alcohol.');
        recommendations.push('Increase omega-3 fatty acids through fatty fish or supplements.');
      }
      
      if (hdlScore < 6) {
        recommendations.push('Include more healthy fats from sources like olive oil, avocados, and nuts.');
        recommendations.push('Consider regular cardiovascular exercise to boost HDL levels.');
      }
      
      if (waistScore < 6) {
        recommendations.push('Focus on reducing abdominal fat through combined diet and exercise.');
        recommendations.push('Consider strength training to improve body composition.');
      }
      
      // Add default recommendations if we haven't added any specific ones
      if (recommendations.length === 0) {
        recommendations.push('Continue maintaining your current healthy lifestyle.');
        recommendations.push('Regular monitoring of metabolic markers is recommended even with optimal scores.');
      }
      
      return {
        totalScore,
        status,
        bmi,
        bmiCategory,
        insulinSensitivity: homaIr,
        insulinSensitivityCategory,
        metabolicFactors,
        recommendations
      };
    };
    
    // Helper functions for interpretations
    function getFastingGlucoseInterpretation(value: number): string {
      if (value < 70) return 'Below optimal range - may indicate hypoglycemia.';
      if (value <= 85) return 'Optimal range for metabolic health.';
      if (value <= 100) return 'Normal range, but lower values are associated with better metabolic health.';
      if (value <= 125) return 'Prediabetic range - indicates increased risk for diabetes.';
      return 'Diabetic range - consultation with a healthcare provider is recommended.';
    }
    
    function getHbA1cInterpretation(value: number): string {
      if (value <= 5.2) return 'Optimal range for long-term metabolic health.';
      if (value <= 5.7) return 'Normal range, with lower values generally indicating better glucose control.';
      if (value <= 6.4) return 'Prediabetic range - indicates increased risk for diabetes.';
      return 'Diabetic range - consultation with a healthcare provider is recommended.';
    }
    
    function getInsulinSensitivityInterpretation(homaIr: number): string {
      if (homaIr < 1) return 'Excellent insulin sensitivity.';
      if (homaIr < 1.5) return 'Good insulin sensitivity.';
      if (homaIr < 2) return 'Fair insulin sensitivity.';
      if (homaIr < 2.5) return 'Reduced insulin sensitivity.';
      if (homaIr < 3) return 'Poor insulin sensitivity - early insulin resistance.';
      return 'Significant insulin resistance - consultation with a healthcare provider is recommended.';
    }
    
    function getTriglyceridesInterpretation(value: number): string {
      if (value < 70) return 'Optimal level for metabolic health.';
      if (value < 100) return 'Very good level.';
      if (value < 150) return 'Normal range, with lower values generally better for metabolic health.';
      if (value < 200) return 'Borderline high - consider lifestyle modifications.';
      return 'High - consultation with a healthcare provider is recommended.';
    }
    
    function getHDLInterpretation(value: number): string {
      if (value >= 60) return 'Optimal level - associated with reduced cardiovascular risk.';
      if (value >= 40) return 'Acceptable range, with higher values generally better.';
      return 'Low HDL - associated with increased cardiovascular risk.';
    }
    
    function getWaistCircumferenceInterpretation(value: number): string {
      // This is simplified and doesn't account for gender or ethnicity differences
      if (value < 80) return 'Optimal range associated with lower metabolic risk.';
      if (value < 95) return 'Moderate risk range.';
      return 'Increased metabolic risk - abdominal obesity is associated with insulin resistance.';
    }
    
    // Set result and show it
    const calculatedResult = calculateMetabolicHealth();
    setResult(calculatedResult);
    setShowResults(true);
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setResult(null);
    setShowResults(false);
  };

  // Prepare radar chart data if we have results
  const radarData = result ? {
    labels: [
      'Fasting Glucose', 
      'HbA1c', 
      'Insulin Sensitivity', 
      'Triglycerides', 
      'HDL', 
      'Waist Circumference'
    ],
    datasets: [
      {
        label: 'Your Scores',
        data: [
          result.metabolicFactors.fastingGlucose.score,
          result.metabolicFactors.hba1c.score,
          result.metabolicFactors.insulinSensitivity.score,
          result.metabolicFactors.triglycerides.score,
          result.metabolicFactors.hdl.score,
          result.metabolicFactors.waistCircumference.score,
        ],
        backgroundColor: 'rgba(14, 165, 233, 0.2)',
        borderColor: 'rgba(14, 165, 233, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(14, 165, 233, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(14, 165, 233, 1)',
      },
      {
        label: 'Optimal',
        data: [10, 10, 10, 10, 10, 10],
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderColor: 'rgba(16, 185, 129, 0.3)',
        borderWidth: 1,
        pointRadius: 0,
        pointBackgroundColor: 'rgba(16, 185, 129, 0.5)',
        pointBorderColor: 'rgba(16, 185, 129, 0.5)',
      },
    ],
  } : null;

  const radarOptions = {
    scales: {
      r: {
        min: 0,
        max: 10,
        ticks: {
          stepSize: 2,
        },
      },
    },
  };

  return (
    <Layout title="Metabolic Health Calculator | Chronos Biotech">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-primary-800 mb-6">Metabolic Health Calculator</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <p className="text-lg text-secondary-700 mb-6">
            This tool provides a comprehensive assessment of your metabolic health by analyzing key biomarkers 
            related to glucose regulation, insulin sensitivity, lipid metabolism, and body composition.
          </p>
          
          {!showResults ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-primary-700 mb-4">Glucose Regulation</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    label="Fasting Glucose"
                    name="fastingGlucose"
                    type="number"
                    value={formData.fastingGlucose}
                    onChange={handleInputChange}
                    required
                    min={60}
                    max={200}
                    step={1}
                    units="mg/dL"
                    helpText="Optimal range: 70-85 mg/dL"
                  />
                  
                  <FormInput
                    label="2-Hour Postprandial Glucose"
                    name="postprandialGlucose"
                    type="number"
                    value={formData.postprandialGlucose}
                    onChange={handleInputChange}
                    required
                    min={70}
                    max={300}
                    step={1}
                    units="mg/dL"
                    helpText="Optimal range: <120 mg/dL"
                  />
                  
                  <FormInput
                    label="HbA1c"
                    name="hba1c"
                    type="number"
                    value={formData.hba1c}
                    onChange={handleInputChange}
                    required
                    min={4}
                    max={10}
                    step={0.1}
                    units="%"
                    helpText="Optimal range: <5.3%"
                  />
                  
                  <FormInput
                    label="Fasting Insulin"
                    name="fasting_insulin"
                    type="number"
                    value={formData.fasting_insulin}
                    onChange={handleInputChange}
                    required
                    min={2}
                    max={30}
                    step={0.1}
                    units="μIU/mL"
                    helpText="Optimal range: 2-6 μIU/mL"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-primary-700 mb-4">Lipid Metabolism</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    label="Triglycerides"
                    name="triglycerides"
                    type="number"
                    value={formData.triglycerides}
                    onChange={handleInputChange}
                    required
                    min={30}
                    max={300}
                    step={1}
                    units="mg/dL"
                    helpText="Optimal range: <100 mg/dL"
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
                    step={1}
                    units="mg/dL"
                    helpText="Optimal range: >50 mg/dL"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-primary-700 mb-4">Body Composition</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    label="Weight"
                    name="weight"
                    type="number"
                    value={formData.weight}
                    onChange={handleInputChange}
                    required
                    min={40}
                    max={200}
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
                    min={140}
                    max={220}
                    step={1}
                    units="cm"
                  />
                  
                  <FormInput
                    label="Waist Circumference"
                    name="waistCircumference"
                    type="number"
                    value={formData.waistCircumference}
                    onChange={handleInputChange}
                    required
                    min={50}
                    max={150}
                    step={0.5}
                    units="cm"
                    helpText="Measure at navel level"
                  />
                </div>
              </div>
              
              <div className="flex justify-center mt-8">
                <button type="submit" className="btn-primary px-8 py-3 text-lg">
                  Calculate Metabolic Health
                </button>
              </div>
            </form>
          ) : (
            result && (
              <div className="results-container">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <ResultCard
                      title="Metabolic Health Score"
                      value={`${result.totalScore.toFixed(1)}/10`}
                      interpretation={`Your metabolic health is ${result.status.toUpperCase()}.`}
                      status={
                        result.status === 'optimal' ? 'good' : 
                        result.status === 'good' ? 'good' : 
                        result.status === 'fair' ? 'warning' : 
                        'danger'
                      }
                    />
                    
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="p-4 bg-secondary-50 rounded-lg border border-secondary-200">
                        <h3 className="text-sm font-semibold text-secondary-700">BMI</h3>
                        <div className="text-xl font-bold">{result.bmi.toFixed(1)}</div>
                        <div className="text-sm text-secondary-600">{result.bmiCategory}</div>
                      </div>
                      
                      <div className="p-4 bg-secondary-50 rounded-lg border border-secondary-200">
                        <h3 className="text-sm font-semibold text-secondary-700">Insulin Sensitivity</h3>
                        <div className="text-xl font-bold">{result.insulinSensitivity.toFixed(1)}</div>
                        <div className="text-sm text-secondary-600">{result.insulinSensitivityCategory}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center">
                    {radarData && (
                      <Radar data={radarData} options={radarOptions} />
                    )}
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-primary-700 mb-4">Biomarker Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                  <BiomarkerRangeIndicator
                    label="Fasting Glucose"
                    value={formData.fastingGlucose}
                    min={60}
                    max={140}
                    minNormal={70}
                    maxNormal={100}
                    unit="mg/dL"
                  />
                  
                  <BiomarkerRangeIndicator
                    label="HbA1c"
                    value={formData.hba1c}
                    min={4}
                    max={8}
                    minNormal={4}
                    maxNormal={5.7}
                    unit="%"
                  />
                  
                  <BiomarkerRangeIndicator
                    label="Fasting Insulin"
                    value={formData.fasting_insulin}
                    min={2}
                    max={20}
                    minNormal={2}
                    maxNormal={8}
                    unit="μIU/mL"
                  />
                  
                  <BiomarkerRangeIndicator
                    label="Triglycerides"
                    value={formData.triglycerides}
                    min={30}
                    max={200}
                    minNormal={30}
                    maxNormal={150}
                    unit="mg/dL"
                  />
                  
                  <BiomarkerRangeIndicator
                    label="HDL Cholesterol"
                    value={formData.hdl}
                    min={20}
                    max={80}
                    minNormal={40}
                    maxNormal={80}
                    unit="mg/dL"
                  />
                  
                  <BiomarkerRangeIndicator
                    label="Waist Circumference"
                    value={formData.waistCircumference}
                    min={60}
                    max={120}
                    minNormal={60}
                    maxNormal={94}
                    unit="cm"
                  />
                </div>
                
                <h3 className="text-xl font-semibold text-primary-700 mt-8 mb-4">Detailed Analysis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(result.metabolicFactors).map(([biomarker, data]) => (
                    <div 
                      key={biomarker} 
                      className={`p-4 rounded-lg border ${
                        data.status === 'good' 
                          ? 'border-green-200 bg-green-50' 
                          : data.status === 'warning'
                            ? 'border-yellow-200 bg-yellow-50'
                            : 'border-red-200 bg-red-50'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium capitalize">{biomarker.replace(/([A-Z])/g, ' $1').trim()}</h4>
                        <span className="text-sm font-bold">{data.value.toFixed(1)}</span>
                      </div>
                      <div className="flex items-center mb-2">
                        <div className="w-full bg-secondary-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              data.status === 'good' 
                                ? 'bg-green-500' 
                                : data.status === 'warning'
                                  ? 'bg-yellow-500'
                                  : 'bg-red-500'
                            }`}
                            style={{ width: `${data.score * 10}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm font-medium">{data.score}/10</span>
                      </div>
                      <p className="text-sm text-secondary-700">{data.interpretation}</p>
                    </div>
                  ))}
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
          <h2 className="text-xl font-semibold text-primary-700 mb-4">About Metabolic Health</h2>
          <div className="text-secondary-700 space-y-4">
            <p>
              Metabolic health is a comprehensive measure of how well your body processes and uses energy. 
              It encompasses several key systems, including glucose regulation, insulin sensitivity, lipid metabolism, and body composition.
            </p>
            <p>
              Research shows that optimal metabolic health is associated with lower risks of diabetes, cardiovascular disease, and many other chronic conditions.
              Even small improvements in metabolic markers can lead to significant health benefits.
            </p>
            <p>
              This assessment tool uses current scientific understanding of metabolic health markers to provide you with a comprehensive score and specific recommendations.
            </p>
            <p className="font-medium">
              This tool is for informational purposes only. Always consult with healthcare professionals for personalized medical advice.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}