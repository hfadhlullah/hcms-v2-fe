/**
 * FormPageLayout - Consistent layout wrapper for form pages
 * - Header: Fixed at top
 * - Sidebar: Fixed on left, shows current section (scrollspy)
 * - Content: Scrollable area
 * - Footer: Fixed at bottom
 */

import { useRef, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { FormPageFooter } from './FormPageFooter';

interface FormSection {
    id: string;
    label: string;
}

interface FormPageLayoutProps {
    title: string;
    sections: FormSection[];
    onBack: () => void;
    onConfirm: () => void;
    isLoading?: boolean;
    isSaving?: boolean;
    isDisabled?: boolean;
    confirmText?: string;
    children: ReactNode;
}

// Constants for fixed element heights
const HEADER_HEIGHT = 65; // px
const FOOTER_HEIGHT = 68; // px
const SIDEBAR_WIDTH = 192; // px (w-48 = 12rem = 192px)

export function FormPageLayout({
    title,
    sections,
    onBack,
    onConfirm,
    isLoading = false,
    isSaving = false,
    isDisabled = false,
    confirmText = 'Confirm',
    children,
}: FormPageLayoutProps) {
    const contentRef = useRef<HTMLDivElement>(null);
    const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || '');

    // Scroll to section when clicking sidebar
    const scrollToSection = useCallback((sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element && contentRef.current) {
            // Set active immediately when clicking
            setActiveSection(sectionId);
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, []);

    // Detect which section is visible based on scroll position
    useEffect(() => {
        const contentElement = contentRef.current;
        if (!contentElement) return;

        const handleScroll = () => {
            // const scrollTop = contentElement.scrollTop;
            const containerHeight = contentElement.clientHeight;

            // Find which section is currently most visible
            let currentSection = sections[0]?.id || '';

            for (const section of sections) {
                const element = document.getElementById(section.id);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    const contentRect = contentElement.getBoundingClientRect();

                    // Calculate position relative to the content container
                    const elementTop = rect.top - contentRect.top;

                    // If the section is in the top half of the viewport, it's "active"
                    if (elementTop <= containerHeight * 0.3) {
                        currentSection = section.id;
                    }
                }
            }

            setActiveSection(currentSection);
        };

        // Initial check
        handleScroll();

        contentElement.addEventListener('scroll', handleScroll, { passive: true });
        return () => contentElement.removeEventListener('scroll', handleScroll);
    }, [sections]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-gray-500">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Fixed Header */}
            <header
                className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-6 py-4 z-30"
                style={{ height: HEADER_HEIGHT }}
            >
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span>Back</span>
                    </button>
                    <span className="text-gray-300">|</span>
                    <h1 className="text-lg font-medium text-gray-900">{title}</h1>
                </div>
            </header>

            {/* Fixed Sidebar */}
            <aside
                className="fixed left-0 bg-white border-r border-gray-200 overflow-y-auto z-20"
                style={{
                    top: HEADER_HEIGHT,
                    bottom: FOOTER_HEIGHT,
                    width: SIDEBAR_WIDTH
                }}
            >
                <nav className="py-4">
                    <ul className="space-y-1">
                        {sections.map((section) => (
                            <li key={section.id}>
                                <button
                                    onClick={() => scrollToSection(section.id)}
                                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${activeSection === section.id
                                        ? 'text-blue-600 bg-blue-50 border-l-2 border-blue-600'
                                        : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    {section.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>

            {/* Scrollable Content Area */}
            <main
                ref={contentRef}
                className="overflow-y-auto"
                style={{
                    position: 'fixed',
                    left: SIDEBAR_WIDTH,
                    right: 0,
                    top: HEADER_HEIGHT,
                    bottom: FOOTER_HEIGHT,
                }}
            >
                <div className="p-6">
                    <div className="max-w-3xl space-y-8">{children}</div>
                </div>
            </main>

            {/* Fixed Footer */}
            <footer
                className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30"
                style={{ height: FOOTER_HEIGHT }}
            >
                <FormPageFooter
                    onConfirm={onConfirm}
                    onCancel={onBack}
                    isLoading={isSaving}
                    isDisabled={isDisabled}
                    confirmText={confirmText}
                />
            </footer>
        </div>
    );
}
