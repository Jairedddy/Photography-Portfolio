# Animated Testimonials Component - Setup Instructions

## ✅ What Was Done

### 1. Project Structure Setup
- ✅ **Path Aliases**: Configured `@` alias to point to `src/` directory
  - Updated `vite.config.ts` with path resolution
  - Updated `tsconfig.json` with path mapping
- ✅ **shadcn Structure**: Created `src/components/ui/` folder for shadcn-style components
- ✅ **Utils Library**: Created `src/lib/utils.ts` with `cn()` function for className merging

### 2. Dependencies Installed
- ✅ `framer-motion` - For smooth animations
- ✅ `clsx` - For conditional className handling
- ✅ `tailwind-merge` - For merging Tailwind classes

### 3. Tailwind CSS Configuration
- ✅ Added CSS variables for shadcn color system (foreground, muted-foreground, secondary, etc.)
- ✅ Updated `tailwind.config.js` to use CSS variables
- ✅ Added dark mode support via CSS variables

### 4. Component Adaptation
- ✅ Converted from Next.js to Vite/React:
  - Replaced `next/image` with standard `<img>` tag
  - Removed `"use client"` directive (not needed in Vite)
  - Replaced `@tabler/icons-react` with `lucide-react` (ArrowLeft, ArrowRight)
  - Added theme prop support for your existing Theme system
  - Added grayscale filter to images to match your monochrome aesthetic

### 5. Integration
- ✅ Integrated component into `AboutPage.tsx` with sample portrait data
- ✅ Component respects your theme system (light/dark)

## 📁 Files Created/Modified

### Created Files:
- `src/lib/utils.ts` - Utility function for className merging
- `src/components/ui/animated-testimonials.tsx` - Main component
- `src/components/ui/animated-testimonials-demo.tsx` - Demo component (optional)

### Modified Files:
- `vite.config.ts` - Added path alias resolution
- `tsconfig.json` - Added path mapping
- `package.json` - Added dependencies
- `tailwind.config.js` - Added shadcn color system
- `src/main.css` - Added CSS variables for theming
- `src/pages/AboutPage.tsx` - Integrated component

## 🎨 Component Usage

The component is now integrated into your About page. To customize it:

```tsx
<AnimatedTestimonials 
  testimonials={[
    {
      quote: "Your quote here",
      name: "Your Name",
      designation: "Your Title",
      src: "path/to/your/portrait.jpg"
    },
    // Add more portraits...
  ]}
  theme={theme}
  autoplay={false} // Set to true for auto-rotation
  className="optional-custom-classes"
/>
```

## 🖼️ Customizing Portrait Images

Replace the Unsplash URLs in `AboutPage.tsx` with your actual portrait photos. The component:
- Applies grayscale filter automatically (matches your monochrome theme)
- Handles image loading gracefully
- Supports any number of portraits

## 🎯 Design Feedback

**Using this carousel in the About page is a GREAT idea!** Here's why:

✅ **Visual Interest**: Adds dynamic movement to an otherwise static page
✅ **Personality**: Shows different sides of you as an artist
✅ **Professional**: Carousel animations feel polished and modern
✅ **Theme Match**: The grayscale filter aligns perfectly with your monochrome aesthetic
✅ **User Engagement**: Interactive element keeps visitors engaged

**Suggestions:**
- Use 3-5 high-quality portrait photos
- Keep quotes/philosophy short and impactful
- Consider using actual photos of you rather than stock images
- The grayscale effect already applied matches your portfolio's aesthetic perfectly

## 🚀 Next Steps

1. **Replace Stock Images**: Update the `src` URLs in `AboutPage.tsx` with your actual portrait photos
2. **Customize Quotes**: Replace the quotes with your own photography philosophy or artist statement
3. **Test Animations**: Run `npm run dev` and test the carousel navigation
4. **Optional**: Enable `autoplay={true}` if you want automatic rotation

## 📝 Notes

- The component uses your existing `Theme` enum for consistent styling
- All animations are smooth and performant using Framer Motion
- The component is fully responsive (mobile-friendly)
- Images are automatically grayscale-filtered to match your portfolio theme

## 🔧 Troubleshooting

If you encounter issues:

1. **Path alias not working**: Make sure `vite.config.ts` and `tsconfig.json` are saved correctly
2. **Styles not applying**: Check that `tailwind.config.js` includes the new color variables
3. **Animations not working**: Verify `framer-motion` is installed (`npm list framer-motion`)
4. **Type errors**: Ensure TypeScript can resolve the `@` alias (restart your IDE/editor)

## ✨ Component Features

- ✅ Smooth animations with Framer Motion
- ✅ Manual navigation (prev/next buttons)
- ✅ Optional autoplay
- ✅ Theme-aware styling
- ✅ Responsive design
- ✅ Grayscale image filter
- ✅ Word-by-word text reveal animation
- ✅ 3D card rotation effects

