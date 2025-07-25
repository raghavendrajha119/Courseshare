/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			primary: '#6366f1',
  			'primary-foreground': '#ffffff',
  			destructive: '#ef4444',
  			'destructive-foreground': '#ffffff',
  			secondary: '#f9fafb',
  			'secondary-foreground': '#1f2937',
  			foreground: '#111827',
  			ring: '#6366f1',
  			background: '#ffffff',
  			input: '#e5e7eb',
  			accent: '#f3f4f6',
  			'accent-foreground': '#111827',
  			card: 'hsl(0, 0%, 100%)',
  			'card-foreground': 'hsl(222.2, 84%, 4.9%)',
  			'muted-foreground': 'hsl(215.4, 16.3%, 46.9%)'
  		},
  		borderRadius: {
  			xl: '1rem'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [],
};
