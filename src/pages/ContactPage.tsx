import React, { useState, FormEvent, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Theme, Photo, UsageType } from '../types';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CustomCursor from '../components/CustomCursor';
import { useTypographyAnimation } from '../hooks/useTypographyAnimation';
import { PHOTOS } from '../components/HeroWorks';
import LicenseBadge from '../components/LicenseBadge';

interface ContactPageProps {
  theme: Theme;
  toggleTheme: () => void;
}

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  usageDescription?: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  usageDescription?: string;
}

const ContactPage: React.FC<ContactPageProps> = ({ theme, toggleTheme }) => {
  const [searchParams] = useSearchParams();
  const photoId = searchParams.get('photoId');
  const selectedPhoto: Photo | undefined = photoId ? PHOTOS.find(p => p.id === photoId) : undefined;

  const contactHeadingAnimation = useTypographyAnimation<HTMLHeadingElement>({
    intensity: 0.11,
    letterSpacingRange: 0.06,
  });

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: selectedPhoto ? `License Request: ${selectedPhoto.title}` : '',
    message: '',
    usageDescription: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Update subject when photo changes
  useEffect(() => {
    if (selectedPhoto) {
      setFormData(prev => ({
        ...prev,
        subject: `License Request: ${selectedPhoto.title}`,
      }));
    }
  }, [selectedPhoto]);

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

    if (selectedPhoto) {
      // For license requests, usage description is required
      if (!formData.usageDescription?.trim()) {
        newErrors.usageDescription = 'Usage description is required';
      } else if (formData.usageDescription.trim().length < 10) {
        newErrors.usageDescription = 'Usage description must be at least 10 characters';
      }
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
      
      // Format message for license requests
      let messageToSend = formData.message;
      if (selectedPhoto && formData.usageDescription) {
        messageToSend = `License Request for Photo: "${selectedPhoto.title}" (ID: ${selectedPhoto.id})

Usage Description:
${formData.usageDescription}

${formData.message ? `Additional Message:\n${formData.message}` : ''}

---
This is a license request submitted through the photography portfolio.`;
      }
      
      const response = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: messageToSend,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        throw new Error(errorBody?.error ?? "Failed to send message.");
      }

      setSubmitStatus('success');
      setFormData({ 
        name: '', 
        email: '', 
        subject: selectedPhoto ? `License Request: ${selectedPhoto.title}` : '', 
        message: '',
        usageDescription: '',
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000);
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputBaseClasses = `w-full px-0 py-3 bg-transparent border-b transition-all duration-300 font-light text-sm focus:outline-none ${
    theme === Theme.VIBRANT
      ? 'border-gray-300 text-black placeholder-gray-400 focus:border-black'
      : 'border-neutral-700 text-white placeholder-neutral-500 focus:border-white'
  }`;

  const labelClasses = `block text-xs font-light tracking-wider mb-1.5 ${
    theme === Theme.VIBRANT ? 'text-gray-600' : 'text-neutral-400'
  }`;

  const errorClasses = `text-xs mt-1 ${
    theme === Theme.VIBRANT ? 'text-red-600' : 'text-red-400'
  }`;

  return (
    <div className={`min-h-screen transition-colors duration-700 ${theme === Theme.VIBRANT ? 'bg-[#fafafa]' : 'bg-neutral-950'}`}>
      <CustomCursor theme={theme} />
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      
      <section 
        className="relative min-h-screen flex flex-col justify-center items-center py-20 px-6"
      >
        <div className="relative z-10 w-full max-w-3xl mx-auto">
          {/* Compact Header */}
          <div className="flex flex-col items-center text-center mb-12">
            <h2
              ref={contactHeadingAnimation.ref}
              style={contactHeadingAnimation.style}
              className={`text-4xl md:text-6xl serif italic mb-4 ${
                theme === Theme.VIBRANT 
                  ? 'bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent leading-[1.12] pb-[2px]'
                  : 'text-white'
              }`}
            >
              {selectedPhoto ? 'Request License' : "Let's Create"}
            </h2>
            
            <p className={`text-sm md:text-base leading-relaxed font-light max-w-xl ${theme === Theme.VIBRANT ? 'text-gray-600' : 'text-neutral-400'}`}>
              {selectedPhoto 
                ? `Request usage rights for "${selectedPhoto.title}"`
                : 'Interested in collaborating?'}
            </p>
          </div>

          {/* Photo Preview (if coming from photo) */}
          {selectedPhoto && (
            <div className="mb-8 flex justify-center">
              <div className="relative w-full max-w-md">
                <div className={`relative overflow-hidden rounded-sm ${
                  theme === Theme.VIBRANT 
                    ? 'bg-gray-200' 
                    : 'bg-neutral-900'
                }`} style={{ aspectRatio: selectedPhoto.aspectRatio }}>
                  <img
                    src={selectedPhoto.url}
                    alt={selectedPhoto.title}
                    className={`w-full h-full object-cover ${
                      theme === Theme.MONOCHROME ? 'grayscale' : ''
                    }`}
                  />
                  {selectedPhoto.licenseType && (
                    <LicenseBadge licenseType={selectedPhoto.licenseType} theme={theme} />
                  )}
                </div>
                <div className={`mt-3 text-center ${theme === Theme.VIBRANT ? 'text-gray-600' : 'text-neutral-400'}`}>
                  <p className="text-sm serif italic">{selectedPhoto.title}</p>
                  <p className="text-xs uppercase tracking-wider mt-1">{selectedPhoto.category}</p>
                </div>
              </div>
            </div>
          )}

          {/* Compact Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-5 mb-12">
            {/* Name & Email Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                  placeholder="Your name"
                  disabled={isSubmitting}
                />
                {errors.name && <p className={errorClasses}>{errors.name}</p>}
              </div>

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

            {/* Usage Description Field (only for license requests) */}
            {selectedPhoto && (
              <div>
                <label htmlFor="usageDescription" className={labelClasses}>
                  USAGE DESCRIPTION
                </label>
                <textarea
                  id="usageDescription"
                  name="usageDescription"
                  value={formData.usageDescription || ''}
                  onChange={handleChange}
                  rows={4}
                  className={`${inputBaseClasses} resize-none`}
                  placeholder="Describe how you plan to use this image (commercial, editorial, advertising, etc.)..."
                  disabled={isSubmitting}
                />
                {errors.usageDescription && <p className={errorClasses}>{errors.usageDescription}</p>}
              </div>
            )}

            {/* Message Field */}
            <div>
              <label htmlFor="message" className={labelClasses}>
                {selectedPhoto ? 'ADDITIONAL MESSAGE (OPTIONAL)' : 'MESSAGE'}
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className={`${inputBaseClasses} resize-none`}
                placeholder={selectedPhoto ? "Any additional information..." : "Tell me about your project..."}
                disabled={isSubmitting}
              />
              {errors.message && <p className={errorClasses}>{errors.message}</p>}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 text-sm tracking-widest font-light transition-all duration-300 ${
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
              <div className={`text-center py-3 text-xs ${
                theme === Theme.VIBRANT ? 'text-green-700' : 'text-green-300'
              }`}>
                <p className="font-light">Thank you! Your message has been sent successfully.</p>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className={`text-center py-3 text-xs ${
                theme === Theme.VIBRANT ? 'text-red-700' : 'text-red-300'
              }`}>
                <p className="font-light">Oops! Something went wrong. Please try again.</p>
              </div>
            )}
          </form>

          {/* Compact Direct Contact & Social Links */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-xs">
            <div className={`${theme === Theme.VIBRANT ? 'text-gray-500' : 'text-neutral-500'}`}>
              <span className="tracking-wider mr-2">OR</span>
              <a 
                href="mailto:jaishukreddy7@gmail.com" 
                className={`border-b pb-0.5 hover:pb-1 transition-all duration-300 tracking-wide ${
                  theme === Theme.VIBRANT ? 'border-black text-black' : 'border-white text-white'
                }`}
              >
                jaishukreddy7@gmail.com
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
