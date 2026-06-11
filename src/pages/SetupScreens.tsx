import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button, Card, PageHeader } from '../components/Shared';
import { useAuth } from '../context/AuthContext';
import {
  Briefcase,
  GraduationCap,
  Code,
  Heart,
  Search,
  Check } from
'lucide-react';
const SetupLayout = ({
  step,
  totalSteps = 5,
  title,
  subtitle,
  children,
  nextPath,
  onNext
}: any) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between text-sm font-medium text-slate-500 mb-2">
            <span>
              Step {step} of {totalSteps}
            </span>
            <span>{Math.round(step / totalSteps * 100)}% completed</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
              style={{
                width: `${step / totalSteps * 100}%`
              }} />
            
          </div>
        </div>

        <Card className="p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">{title}</h2>
          <p className="text-slate-500 mb-8">{subtitle}</p>

          <div className="min-h-[300px]">{children}</div>

          <div className="mt-8 flex justify-between items-center pt-6 border-t border-slate-100">
            {step > 1 ?
            <Button variant="ghost" onClick={() => navigate(-1)}>
                Back
              </Button> :

            <div></div>
            }
            <Button
              size="lg"
              onClick={() => {
                if (onNext) onNext();
                navigate(nextPath);
              }}>
              
              {step === totalSteps ? 'Complete Setup' : 'Continue'}
            </Button>
          </div>
        </Card>
      </div>
    </div>);

};
// 9. Basic Info
export const SetupBasicInfo = () => {
  const { user } = useAuth();
  return (
  <SetupLayout
  step={1}
  title="Let's set up your profile"
  subtitle="This helps us personalize your interview experience."
  nextPath="/setup-career">
  
    <div className="flex flex-col items-center mb-8">
      <div className="w-24 h-24 bg-indigo-100 rounded-full border-4 border-white shadow-sm flex items-center justify-center overflow-hidden">
        {user?.picture ? (
          <img src={user.picture} alt={user.name} className="w-full h-full object-cover" />
        ) : (
          <UserIcon className="w-12 h-12 text-indigo-400" />
        )}
      </div>
    </div>
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Full Name
        </label>
        <input
        type="text"
        defaultValue={user?.name || ''}
        className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
      
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Location (Optional)
        </label>
        <input
        type="text"
        placeholder="e.g. San Francisco, CA"
        className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
      
      </div>
    </div>
  </SetupLayout>
  );
};

// Helper for missing icon in previous component
const UserIcon = ({ className }: {className?: string;}) =>
<svg
  className={className}
  fill="none"
  viewBox="0 0 24 24"
  stroke="currentColor">
  
    <path
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  
  </svg>;

// 10. Career Goal
export const SetupCareerGoal = () => {
  const roles = [
  'Software Engineer',
  'Product Manager',
  'Data Scientist',
  'UX Designer',
  'Marketing Manager',
  'Sales Executive'];

  const [selected, setSelected] = useState('Software Engineer');
  return (
    <SetupLayout
      step={2}
      title="What's your target role?"
      subtitle="We'll tailor your mock interviews to this position."
      nextPath="/setup-experience">
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search for a role..."
          className="w-full pl-10 p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
        
      </div>
      <div className="space-y-3">
        <p className="text-sm font-medium text-slate-700">Popular roles</p>
        <div className="flex flex-wrap gap-2">
          {roles.map((role) =>
          <button
            key={role}
            onClick={() => setSelected(role)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selected === role ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
            
              {role}
            </button>
          )}
        </div>
      </div>
    </SetupLayout>);

};
// 11. Experience Level
export const SetupExperience = () => {
  const levels = [
  {
    id: 'entry',
    title: 'Entry Level',
    desc: '0-2 years of experience',
    icon: GraduationCap
  },
  {
    id: 'mid',
    title: 'Mid Level',
    desc: '3-5 years of experience',
    icon: Briefcase
  },
  {
    id: 'senior',
    title: 'Senior Level',
    desc: '6-10 years of experience',
    icon: Code
  },
  {
    id: 'exec',
    title: 'Executive / Leadership',
    desc: '10+ years of experience',
    icon: Heart
  }];

  const [selected, setSelected] = useState('mid');
  return (
    <SetupLayout
      step={3}
      title="What's your experience level?"
      subtitle="This determines the difficulty of your interview questions."
      nextPath="/setup-industry">
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {levels.map((level) =>
        <div
          key={level.id}
          onClick={() => setSelected(level.id)}
          className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selected === level.id ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 hover:border-indigo-200 hover:bg-slate-50'}`}>
          
            <level.icon
            className={`w-8 h-8 mb-3 ${selected === level.id ? 'text-indigo-600' : 'text-slate-400'}`} />
          
            <h3
            className={`font-bold ${selected === level.id ? 'text-indigo-900' : 'text-slate-900'}`}>
            
              {level.title}
            </h3>
            <p
            className={`text-sm mt-1 ${selected === level.id ? 'text-indigo-700' : 'text-slate-500'}`}>
            
              {level.desc}
            </p>
          </div>
        )}
      </div>
    </SetupLayout>);

};
// 12. Industry Selection
export const SetupIndustry = () => {
  const industries = [
  'Technology',
  'Finance',
  'Healthcare',
  'E-commerce',
  'Education',
  'Consulting',
  'Media',
  'Manufacturing'];

  const [selected, setSelected] = useState<string[]>(['Technology']);
  const toggle = (ind: string) => {
    if (selected.includes(ind)) setSelected(selected.filter((i) => i !== ind));else
    setSelected([...selected, ind]);
  };
  return (
    <SetupLayout
      step={4}
      title="Select your target industries"
      subtitle="Choose up to 3 industries you're interviewing for."
      nextPath="/setup-skills">
      
      <div className="grid grid-cols-2 gap-3">
        {industries.map((ind) => {
          const isSelected = selected.includes(ind);
          return (
            <div
              key={ind}
              onClick={() => toggle(ind)}
              className={`p-4 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${isSelected ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' : 'border-slate-200 hover:border-indigo-300'}`}>
              
              <span
                className={`font-medium ${isSelected ? 'text-indigo-900' : 'text-slate-700'}`}>
                
                {ind}
              </span>
              {isSelected && <Check className="w-5 h-5 text-indigo-600" />}
            </div>);

        })}
      </div>
    </SetupLayout>);

};
// 13. Skill Self-Assessment
export const SetupSkills = () => {
  const skills = [
  {
    id: 'tech',
    label: 'Technical Knowledge'
  },
  {
    id: 'behav',
    label: 'Behavioral Answers'
  },
  {
    id: 'comm',
    label: 'Communication / Clarity'
  },
  {
    id: 'conf',
    label: 'Overall Confidence'
  }];

  return (
    <SetupLayout
      step={5}
      title="Self-assessment"
      subtitle="How confident do you feel in these areas right now?"
      nextPath="/dashboard"
      onNext={() => {
        try {
          localStorage.setItem('setupComplete', 'true');
        } catch (e) {
          /* ignore */
        }
      }}>
      
      <div className="space-y-8">
        {skills.map((skill) =>
        <div key={skill.id}>
            <div className="flex justify-between mb-2">
              <label className="font-medium text-slate-700">
                {skill.label}
              </label>
              <span className="text-sm text-slate-500">Average</span>
            </div>
            <input
            type="range"
            min="1"
            max="100"
            defaultValue="50"
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
          
            <div className="flex justify-between mt-1 text-xs text-slate-400">
              <span>Needs Work</span>
              <span>Expert</span>
            </div>
          </div>
        )}
      </div>
    </SetupLayout>);

};