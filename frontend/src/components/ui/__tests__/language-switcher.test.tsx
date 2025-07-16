/**
 * Unit Tests for Language Switcher Component
 * Tests the language switching functionality and localStorage persistence
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LanguageSwitcher, useLanguage } from '../language-switcher';
import { languages } from '@/lib/utils';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('LanguageSwitcher Component', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
  });

  describe('Button variant', () => {
    it('renders with default English language', () => {
      render(<LanguageSwitcher variant="button" />);
      
      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByText('English')).toBeInTheDocument();
      expect(screen.getByText('🇬🇧')).toBeInTheDocument();
    });

    it('cycles through all available languages when clicked', () => {
      const mockOnLanguageChange = jest.fn();
      render(
        <LanguageSwitcher 
          variant="button" 
          onLanguageChange={mockOnLanguageChange}
        />
      );
      
      const button = screen.getByRole('button');
      
      // First click should change to Kinyarwanda
      fireEvent.click(button);
      expect(mockOnLanguageChange).toHaveBeenCalledWith('rw');
      
      // Second click should change to French
      fireEvent.click(button);
      expect(mockOnLanguageChange).toHaveBeenCalledWith('fr');
    });

    it('has proper accessibility attributes', () => {
      render(<LanguageSwitcher variant="button" />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', expect.stringContaining('Current language: English'));
    });
  });

  describe('Dropdown variant', () => {
    it('renders dropdown with all language options', () => {
      render(<LanguageSwitcher variant="dropdown" />);
      
      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
      expect(select).toHaveAttribute('aria-label', 'Select language');
      
      // Check all language options are present
      Object.entries(languages).forEach(([code, lang]) => {
        expect(screen.getByDisplayValue(`${lang.flag} ${lang.name}`)).toBeInTheDocument();
      });
    });

    it('changes language when option is selected', () => {
      const mockOnLanguageChange = jest.fn();
      render(
        <LanguageSwitcher 
          variant="dropdown" 
          onLanguageChange={mockOnLanguageChange}
        />
      );
      
      const select = screen.getByRole('combobox');
      fireEvent.change(select, { target: { value: 'fr' } });
      
      expect(mockOnLanguageChange).toHaveBeenCalledWith('fr');
    });
  });

  describe('Inline variant', () => {
    it('renders all language buttons', () => {
      render(<LanguageSwitcher variant="inline" />);
      
      Object.entries(languages).forEach(([code, lang]) => {
        const button = screen.getByLabelText(`Switch to ${lang.name}`);
        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent(lang.flag);
      });
    });

    it('highlights current language', () => {
      render(<LanguageSwitcher variant="inline" currentLanguage="rw" />);
      
      const rwButton = screen.getByLabelText('Switch to Kinyarwanda');
      expect(rwButton).toHaveClass('bg-primary', 'text-primary-foreground');
    });
  });
});

describe('useLanguage hook', () => {
  it('initializes with default language', () => {
    const TestComponent = () => {
      const { language, languages: availableLanguages } = useLanguage();
      return (
        <div>
          <span data-testid="current-language">{language}</span>
          <span data-testid="languages-count">{Object.keys(availableLanguages).length}</span>
        </div>
      );
    };

    render(<TestComponent />);
    
    expect(screen.getByTestId('current-language')).toHaveTextContent('en');
    expect(screen.getByTestId('languages-count')).toHaveTextContent('3');
  });

  it('loads saved language from localStorage', () => {
    localStorageMock.getItem.mockReturnValue('fr');
    
    const TestComponent = () => {
      const { language } = useLanguage();
      return <span data-testid="current-language">{language}</span>;
    };

    render(<TestComponent />);
    
    expect(localStorageMock.getItem).toHaveBeenCalledWith('techcare-language');
    expect(screen.getByTestId('current-language')).toHaveTextContent('fr');
  });

  it('saves language changes to localStorage', () => {
    const TestComponent = () => {
      const { language, changeLanguage } = useLanguage();
      return (
        <div>
          <span data-testid="current-language">{language}</span>
          <button onClick={() => changeLanguage('rw')}>Change to Kinyarwanda</button>
        </div>
      );
    };

    render(<TestComponent />);
    
    const button = screen.getByText('Change to Kinyarwanda');
    fireEvent.click(button);
    
    expect(localStorageMock.setItem).toHaveBeenCalledWith('techcare-language', 'rw');
    expect(screen.getByTestId('current-language')).toHaveTextContent('rw');
  });
});