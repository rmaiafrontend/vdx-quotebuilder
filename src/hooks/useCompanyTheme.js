import { useEffect } from 'react';
import { MOCK_COMPANY, DEFAULT_PRIMARY_COLOR } from '@/constants/company';

export function useCompanyTheme() {
    const company = MOCK_COMPANY;
    const primaryColor = company?.primary_color || localStorage.getItem('company_primary_color') || DEFAULT_PRIMARY_COLOR;

    useEffect(() => {
        if (company?.primary_color) {
            localStorage.setItem('company_primary_color', company.primary_color);
        }
    }, [company?.primary_color]);

    return { company, primaryColor };
}
