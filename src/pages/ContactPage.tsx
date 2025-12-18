import React, { useState, FormEvent } from 'react';
import { Theme } from '../types';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CustomCursor from '../components/CustomCursor';
import { useTypographyAnimation } from '../hooks/useTypographyAnimation';

interface ContactPageProps {
  theme: Theme;
  toggleTheme: () => void;
}

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const ContactPage: React.FC<ContactPageProps> = ({ theme, toggleTheme }) => {
  const contactHeadingAnimation = useTypographyAnimation<HTMLHeadingElement>({
    intensity: 0.11,
    letterSpacingRange: 0.06,
  });

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const CONTACT_ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT ?? "/api/contact";
      
      const response = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        throw new Error(errorBody?.error ?? "Failed to send message.");
      }

      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputBaseClasses = `w-full px-0 py-4 bg-transparent border-b-2 transition-all duration-300 font-light text-base focus:outline-none ${
    theme === Theme.VIBRANT
      ? 'border-gray-300 text-black placeholder-gray-400 focus:border-black'
      : 'border-neutral-700 text-white placeholder-neutral-500 focus:border-white'
  }`;

  const labelClasses = `block text-sm font-light tracking-wider mb-2 ${
    theme === Theme.VIBRANT ? 'text-gray-700' : 'text-neutral-300'
  }`;

  const errorClasses = `text-xs mt-1 ${
    theme === Theme.VIBRANT ? 'text-red-600' : 'text-red-400'
  }`;

  return (
    <div className={`min-h-screen transition-colors duration-700 ${theme === Theme.VIBRANT ? 'bg-[#fafafa]' : 'bg-neutral-950'}`}>
      <CustomCursor theme={theme} />
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      
      <section 
        className="relative min-h-screen flex flex-col justify-center items-center py-32 px-6"
      >
        <div className="relative z-10 w-full max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex flex-col items-center gap-8 text-center mb-16">
            <h2
              ref={contactHeadingAnimation.ref}
              style={contactHeadingAnimation.style}
              className={`text-5xl md:text-7xl serif italic ${theme === Theme.VIBRANT ? 'text-black' : 'text-white'}`}
            >
              Let's Create
            </h2>
            
            <p className={`text-lg md:text-xl leading-relaxed font-light max-w-2xl ${theme === Theme.VIBRANT ? 'text-gray-600' : 'text-neutral-400'}`}>
              Interested in collaborating or commissioning a project? 
              Fill out the form below and let's discuss how we can bring your vision to life.
            </p>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className={labelClasses}>
                NAME
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={inputBaseClasses}
                placeholder="Your full name"
                disabled={isSubmitting}
              />
              {errors.name && <p className={errorClasses}>{errors.name}</p>}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className={labelClasses}>
                EMAIL
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={inputBaseClasses}
                placeholder="your.email@example.com"
                disabled={isSubmitting}
              />
              {errors.email && <p className={errorClasses}>{errors.email}</p>}
            </div>

            {/* Subject Field */}
            <div>
              <label htmlFor="subject" className={labelClasses}>
                SUBJECT
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className={inputBaseClasses}
                placeholder="Project inquiry, collaboration, etc."
                disabled={isSubmitting}
              />
              {errors.subject && <p className={errorClasses}>{errors.subject}</p>}
            </div>

            {/* Message Field */}
            <div>
              <label htmlFor="message" className={labelClasses}>
                MESSAGE
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                className={`${inputBaseClasses} resize-none`}
                placeholder="Tell me about your project..."
                disabled={isSubmitting}
              />
              {errors.message && <p className={errorClasses}>{errors.message}</p>}
            </div>

            {/* Submit Button */}
            <div className="pt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-6 text-lg tracking-widest font-light transition-all duration-300 ${
                  theme === Theme.VIBRANT
                    ? 'bg-black text-white hover:bg-gray-800 disabled:bg-gray-400'
                    : 'bg-white text-black hover:bg-gray-200 disabled:bg-neutral-700 disabled:text-neutral-400'
                } ${isSubmitting ? 'cursor-wait' : ''}`}
              >
                {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
              </button>
            </div>

            {/* Status Messages */}
            {submitStatus === 'success' && (
              <div className={`text-center py-4 rounded ${
                theme === Theme.VIBRANT ? 'bg-green-50 text-green-800' : 'bg-green-900/30 text-green-300'
              }`}>
                <p className="font-light">Thank you! Your message has been sent successfully.</p>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className={`text-center py-4 rounded ${
                theme === Theme.VIBRANT ? 'bg-red-50 text-red-800' : 'bg-red-900/30 text-red-300'
              }`}>
                <p className="font-light">Oops! Something went wrong. Please try again.</p>
              </div>
            )}
          </form>

          {/* Direct Contact & Social Links */}
          <div className="mt-20 flex flex-col items-center gap-8">
            <div className={`text-center ${theme === Theme.VIBRANT ? 'text-gray-500' : 'text-neutral-500'}`}>
              <p className="text-sm font-light tracking-wider mb-4">OR EMAIL DIRECTLY</p>
              <a 
                href="mailto:jaishukreddy7@gmail.com" 
                className={`text-lg md:text-xl border-b pb-1 hover:pb-2 transition-all duration-300 tracking-wide ${
                  theme === Theme.VIBRANT ? 'border-black text-black' : 'border-white text-white'
                }`}
              >
                jaishukreddy7@gmail.com
              </a>
            </div>

            <div className="flex gap-8 text-sm opacity-60">
              <a 
                href="#" 
                className={`hover:opacity-100 transition-opacity tracking-wider ${
                  theme === Theme.VIBRANT ? 'text-black' : 'text-white'
                }`}
              >
                Instagram
              </a>
              <a 
                href="#" 
                className={`hover:opacity-100 transition-opacity tracking-wider ${
                  theme === Theme.VIBRANT ? 'text-black' : 'text-white'
                }`}
              >
                Twitter
              </a>
              <a 
                href="#" 
                className={`hover:opacity-100 transition-opacity tracking-wider ${
                  theme === Theme.VIBRANT ? 'text-black' : 'text-white'
                }`}
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer theme={theme} />
    </div>
  );
};

export default ContactPage;
